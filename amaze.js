
// Maze dimensions
const MAZE_DIM = 20
const MAZE_WIDTH = 20
const MAZE_HEIGHT = 20

// How far we can see from the current location (taxi-cab).
const MAX_VISIBILITY = 3

// Visibiilty constants, should be listed in ascending order.
const V_HIDDEN = 0
const V_HAZY = 1
const V_VISIBLE = 2

// The different types of cells
const CELL_EMPTY = 0
const CELL_WALL = 1 // #
const CELL_PORTAL = 2 // ?
const CELL_GOAL = 3 // star

const OFFSET_CELL = 2.9 // width(|height) + gap

const DIR_UP = 0
const DIR_RIGHT = 1
const DIR_DOWN = 2
const DIR_LEFT = 3
  
const CLASS_MAP = {
  [CELL_EMPTY]: 'cell empty',
  [CELL_WALL]: 'cell wall',
  [CELL_PORTAL]: 'cell portal',
  [CELL_GOAL]: 'cell goal'
}
const V_CLASS_MAP = {
  [V_HIDDEN]: 'hidden',
  [V_HAZY]: 'hazy',
  [V_VISIBLE]: 'visible'
}

// The root element we're rendering into
const theEl = document.getElementById('root')
let theMaze
let theLoc

// Make a fancy maze
function amaze () {
  const width = MAZE_WIDTH
  const height = MAZE_HEIGHT
  const numCells = width * height
  const m = Array(numCells)
    .fill(0)
    .map(function () {
      const r = Math.random()
      if (r < 0.8) { return CELL_EMPTY }
      return CELL_WALL
      // TODO
      // if (r < 0.99) { return CELL_WALL }
      // return CELL_PORTAL
    })
  // Place the goal in the first or last 10% of the maze
  const rand = Math.random()
  const ixGoal = rand < 0.5
    ? Math.floor(Math.random() * numCells * 0.1)
    : Math.floor(Math.random() * numCells * 0.1 + numCells * 0.9)
  let ixSpawn = rand >= 0.5
    ? Math.floor(Math.random() * numCells * 0.1)
    : Math.floor(Math.random() * numCells * 0.1 + numCells * 0.9)
  m[ixGoal] = CELL_GOAL
  // Make sure we don't spawn on top of something
  while (m[ixSpawn]!== CELL_EMPTY && ixSpawn > 0) {
    ixSpawn = ixSpawn - 1
  }
  return [m, ixSpawn]
}

function init (el, maze) {
  const mDiv = document.createElement('div')
  mDiv.className = 'maze'
  maze.forEach(function () {
    const cDiv =  document.createElement('div')
    mDiv.appendChild(cDiv)
  })
  el.appendChild(mDiv)
}

function render (el, maze, loc) {
  const mask = getVisibleProximityMask(maze, loc)
  const mDiv = document.querySelectorAll('.maze')[0]
  const cellDivs = Array.prototype.slice.call(mDiv.children)
  
  maze.forEach(function (cell, ix) {
    const cDiv = cellDivs[ix]
    const visibility = mask[ix]
    cDiv.className = CLASS_MAP[cell] + ' ' + V_CLASS_MAP[visibility]
  })
  
  cellDivs[loc].classList.toggle('runner')
  const [top, left] = computeOffset(loc)
  mDiv.style.top = `${top}px`
  mDiv.style.left = `${left}px`
}

function getVisibleProximityMask (maze, loc) {
  const width = MAZE_WIDTH
  const height = MAZE_HEIGHT
  const numCells = width * height
  const mask = Array(numCells).fill(V_HIDDEN)
  const q = [loc, null]
  const visited = {}
  let dist = 1
  while (q.length) {
    const cell = q.shift()
    if (cell === null) {
      if (dist < MAX_VISIBILITY) {
        dist = dist + 1
        q.push(null)
      }
    } else {
      getNeighbors(maze, cell)
        .filter(function (n) {
          return !visited.hasOwnProperty(n)
        })
        .forEach(function (n) {
          visited[n] = 1
          mask[n] = Math.max(
            mask[n],
            dist === MAX_VISIBILITY ? V_HAZY : V_VISIBLE
          )
          if (dist < MAX_VISIBILITY) {
            q.push(n)
          }
        })
    }
  }
  return mask
}

// Determines the amount we need to offset the maze
// in order to center the element at loc
function computeOffset (loc) {
  // We'll need to convert between rem and px
  const dE = document.documentElement
  const pxPerRem = parseFloat(getComputedStyle(dE).fontSize)
  const offsetPx = OFFSET_CELL * pxPerRem
  
  // The natural top left corner of the loc cell within the maze wrapper
  const cellTop = offsetPx * (Math.floor(loc / MAZE_WIDTH))
  const cellLeft = offsetPx * (loc % MAZE_WIDTH)
  
  // It's easier (for me) to think about top and left,
  // but we really want the center of the element
  const box = theEl.getBoundingClientRect()
  let top = cellTop + box.top + offsetPx / 2
  let left = cellLeft + box.left + offsetPx / 2
  
  // Window boundaries
  const centerX = dE.clientWidth / 2
  const centerY = dE.clientHeight / 2
  
  return [centerY - top, centerX - left]
}

function move (direction) {
  const neighbors = getNeighbors(theMaze, theLoc)
    .filter(function (ix) {
      return theMaze[ix] !== CELL_WALL
    })
  const nextLoc = {
    [DIR_UP]: theLoc - MAZE_WIDTH,
    [DIR_RIGHT]: theLoc + 1,
    [DIR_DOWN]: theLoc + MAZE_WIDTH,
    [DIR_LEFT]: theLoc - 1
  }[direction]
  if (neighbors.includes(nextLoc)) {
    theLoc = nextLoc
    render(theEl, theMaze, theLoc)
  }
}

// Get the neighboring cells we can reach from loc.
// Can't walk through walls, can't go off the maze edge.
function getNeighbors (maze, loc) {
  const n = loc - MAZE_WIDTH
  const e = loc + 1
  const s = loc + MAZE_WIDTH
  const w = loc - 1
  const neighbors = [loc]
  if (maze[loc] === CELL_WALL) {
    return neighbors
  }
  if (n > -1) {
    neighbors.push(n)
  }
  if (s < maze.length) {
    neighbors.push(s)
  }
  if (e % MAZE_WIDTH !== 0) {
    neighbors.push(e)
  }
  if (w % MAZE_WIDTH !== MAZE_WIDTH - 1) {
    neighbors.push(w)
  }
  return neighbors
}

document.body.addEventListener('keyup', amazeKeyUpHandler)

function amazeKeyUpHandler (event) {
  const key = event.key
  if (key === 'ArrowUp' || key === 'w') {
    move(DIR_UP)
  }
  if (key === 'ArrowRight' || key === 'd') {
    move(DIR_RIGHT)
  }
  if (key === 'ArrowDown' || key === 's') {
    move(DIR_DOWN)
  }
  if (key === 'ArrowLeft' || key === 'a') {
    move(DIR_LEFT)
  }
}

const initialState = amaze()
theMaze = initialState[0]
theLoc = initialState[1]

init(theEl, theMaze)
render(theEl, theMaze, theLoc)

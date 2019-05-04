
document.body.addEventListener('click', handleLevel0Click)

function handleLevel0Click (event) {
  if (event.target.classList.contains('l1b')) {
    document.body.classList.toggle('level1')
    document.body.removeEventListener('click', handleLevel0Click)
    document.body.addEventListener('click', handleLevel1Click)
  }
}

function handleLevel1Click (event) {
  if (event.target.classList.contains('l2b')) {
    // Remove level1, add level2
    document.body.classList.toggle('level1')
    document.body.classList.toggle('level2')
    document.body.addEventListener('mazeEvent', handleMazeEvent)
    document.body.removeEventListener('click', handleLevel1Click)
    setTimeout(function () {
      addScript('amaze.js')
      addStylesheet('amaze.css')
    }, 500)
  }
}

function handleMazeEvent (event) {
  if (event.detail.type === 'foundGoal') {
    document.body.removeEventListener('mazeEvent', handleMazeEvent)
    // tear down maze
  }
}

function addScript (scriptPath) {
  const script = document.createElement('script')
  script.async = true
  script.src = scriptPath
  document.body.appendChild(script)
}

function addStylesheet (stylesheetPath) {
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = stylesheetPath
  document.body.appendChild(link)
}

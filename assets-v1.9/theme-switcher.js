;(function () {
  const themeSwitcher = document.getElementById('theme-switcher')
  const html = document.documentElement
  let isExpanded = false
  let isVisible = true
  let scrollRafId = null

  function getStoredTheme() {
    return localStorage.getItem('theme') || 'auto'
  }

  function setStoredTheme(theme) {
    localStorage.setItem('theme', theme)
  }

  function loadThemeCSS(theme) {
    const existingThemeCSS = document.querySelector('link[data-theme-css]')
    if (existingThemeCSS) {
      existingThemeCSS.remove()
    }

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = `assets-v1.9/themes/${theme}.css`
    link.setAttribute('data-theme-css', theme)
    link.onload = () => {
      window.setTimeout(() => {
        html.setAttribute('data-theme-ready', 'true')
      }, 100)
    }
    document.head.appendChild(link)
  }

  function applyTheme(theme) {
    html.removeAttribute('data-theme')
    loadThemeCSS(theme)
    if (theme !== 'auto') {
      html.setAttribute('data-theme', theme)
    }
  }

  function setActiveTheme(selectedTheme) {
    const items = themeSwitcher.querySelectorAll('li')
    items.forEach((item) => {
      const theme = item.getAttribute('data-theme')
      if (theme === selectedTheme) {
        item.classList.add('active')
      } else {
        item.classList.remove('active')
      }
    })
  }

  function collapseMenu() {
    if (!isExpanded) return
    isExpanded = false
    themeSwitcher.classList.remove('theme-switcher--expanded')
  }

  function expandMenu() {
    if (isExpanded) return
    isExpanded = true
    themeSwitcher.classList.add('theme-switcher--expanded')
  }

  function toggleMenu() {
    if (isExpanded) {
      collapseMenu()
    } else {
      expandMenu()
    }
  }

  function selectTheme(theme) {
    setStoredTheme(theme)
    applyTheme(theme)
    setActiveTheme(theme)
    collapseMenu()
  }

  function initializeTheme() {
    const storedTheme = getStoredTheme()
    applyTheme(storedTheme)
    setActiveTheme(storedTheme)
  }

  function handleScroll() {
    const shouldBeVisible = window.scrollY < 100

    if (shouldBeVisible !== isVisible) {
      isVisible = shouldBeVisible
      if (isVisible) {
        themeSwitcher.classList.remove('theme-switcher--hidden')
      } else {
        themeSwitcher.classList.add('theme-switcher--hidden')
        collapseMenu()
      }
    }
  }

  function onScroll() {
    if (scrollRafId) return

    scrollRafId = requestAnimationFrame(() => {
      handleScroll()
      scrollRafId = null
    })
  }

  function handleThemeItemClick(event) {
    const item = event.target.closest('li[data-theme]')

    if (item) {
      event.preventDefault()
      event.stopPropagation()

      const theme = item.getAttribute('data-theme')

      if (item.classList.contains('active') && !isExpanded) {
        expandMenu()
      } else {
        selectTheme(theme)
      }
    } else if (event.target === themeSwitcher) {
      event.preventDefault()
      toggleMenu()
    }
  }

  function handleKeydown(event) {
    if (event.key === 'Escape' && isExpanded) {
      event.preventDefault()
      collapseMenu()
      return
    }

    if (event.key === 'Enter' || event.key === ' ') {
      const item = event.target.closest('li[data-theme]')
      if (item) {
        event.preventDefault()
        const theme = item.getAttribute('data-theme')
        selectTheme(theme)
      } else if (event.target === themeSwitcher) {
        event.preventDefault()
        toggleMenu()
      }
    }
  }

  function handleClickOutside(event) {
    if (isExpanded && !themeSwitcher.contains(event.target)) {
      collapseMenu()
    }
  }

  themeSwitcher.addEventListener('click', handleThemeItemClick)
  themeSwitcher.addEventListener('keydown', handleKeydown)
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('scroll', onScroll)

  initializeTheme()
})()

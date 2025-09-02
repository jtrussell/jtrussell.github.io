;(function () {
  const themes = ['auto', 'light', 'dark']
  let currentThemeIndex = 0

  const themeToggle = document.getElementById('theme-toggle')
  const html = document.documentElement

  function getStoredTheme() {
    return localStorage.getItem('theme') || 'auto'
  }

  function setStoredTheme(theme) {
    localStorage.setItem('theme', theme)
  }

  function applyTheme(theme) {
    if (theme === 'auto') {
      html.removeAttribute('data-theme')
    } else {
      html.setAttribute('data-theme', theme)
    }
  }

  function updateToggleText(theme) {
    const labels = {
      auto: 'Auto',
      light: 'Light',
      dark: 'Dark',
    }
    themeToggle.textContent = labels[theme]
    themeToggle.setAttribute(
      'aria-label',
      `Current theme: ${labels[theme]}. Click to change.`
    )
  }

  function initializeTheme() {
    const storedTheme = getStoredTheme()
    currentThemeIndex = themes.indexOf(storedTheme)
    applyTheme(storedTheme)
    updateToggleText(storedTheme)
  }

  function toggleTheme() {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length
    const newTheme = themes[currentThemeIndex]

    setStoredTheme(newTheme)
    applyTheme(newTheme)
    updateToggleText(newTheme)
  }

  themeToggle.addEventListener('click', toggleTheme)

  themeToggle.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggleTheme()
    }
  })

  function handleScroll() {
    if (window.scrollY < 100) {
      themeToggle.classList.remove('theme-toggle--hidden')
    } else {
      themeToggle.classList.add('theme-toggle--hidden')
    }
  }

  let scrollTimeout
  function debouncedScrollHandler() {
    clearTimeout(scrollTimeout)
    scrollTimeout = setTimeout(handleScroll, 100)
  }

  window.addEventListener('scroll', debouncedScrollHandler)

  initializeTheme()
})()

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

  function applyTheme(theme) {
    if (theme === 'auto') {
      html.removeAttribute('data-theme')
    } else {
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
    themeSwitcher.style.maxHeight = '3rem'
    themeSwitcher.style.overflow = 'hidden'
  }

  function expandMenu() {
    if (isExpanded) return
    isExpanded = true
    themeSwitcher.classList.add('theme-switcher--expanded')
    themeSwitcher.style.maxHeight = 'none'
    themeSwitcher.style.overflow = 'visible'
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

  function applyStandardPositioning() {
    const styles = {
      position: 'fixed',
      bottom: '2rem',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: '1000',
      transition: 'all 0.3s ease, transform 0.3s ease, opacity 0.3s ease',
      maxHeight: '3rem',
      overflow: 'hidden',
    }

    Object.assign(themeSwitcher.style, styles)

    function updateMobileStyles() {
      if (window.innerWidth <= 768) {
        themeSwitcher.style.bottom = '0.75rem'
      } else {
        themeSwitcher.style.bottom = '1rem'
      }
    }

    updateMobileStyles()
    window.addEventListener('resize', updateMobileStyles)
  }

  function initializeTheme() {
    const storedTheme = getStoredTheme()
    applyTheme(storedTheme)
    setActiveTheme(storedTheme)
    applyStandardPositioning()
  }

  function handleScroll() {
    const shouldBeVisible = window.scrollY < 100

    if (shouldBeVisible !== isVisible) {
      isVisible = shouldBeVisible
      if (isVisible) {
        themeSwitcher.style.transform = 'translateX(-50%)'
        themeSwitcher.style.opacity = '1'
        themeSwitcher.style.pointerEvents = 'auto'
      } else {
        themeSwitcher.style.transform = 'translateX(-50%) translateY(100%)'
        themeSwitcher.style.opacity = '0'
        themeSwitcher.style.pointerEvents = 'none'
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

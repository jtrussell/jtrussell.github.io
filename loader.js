;(function() {
  const CURRENT_VERSION = 'v1.8'
  const AVAILABLE_ASSETS = {
    'theme-switcher.js': { type: 'script', path: 'theme-switcher.js' }
  }

  function getUrlParams() {
    const script = document.currentScript || document.querySelector('script[src*="loader.js"]')
    if (!script || !script.src) return {}
    const url = new URL(script.src)
    const params = {}
    url.searchParams.forEach((value, key) => {
      params[key] = value
    })
    return { params, baseUrl: url.origin }
  }

  function loadAsset(assetName, version, baseUrl) {
    const asset = AVAILABLE_ASSETS[assetName]
    if (!asset) return
    const assetUrl = `${baseUrl}/assets-${version}/${asset.path}`
    if (asset.type === 'script') {
      loadScript(assetUrl)
    }
  }

  function loadScript(url) {
    const existing = document.querySelector(`script[src="${url}"]`)
    if (existing) return
    const script = document.createElement('script')
    script.src = url
    script.async = true
    document.head.appendChild(script)
  }

  function init() {
    const { params, baseUrl } = getUrlParams()
    if (!params.asset) return
    const version = params.version || CURRENT_VERSION
    loadAsset(params.asset, version, baseUrl)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
})()
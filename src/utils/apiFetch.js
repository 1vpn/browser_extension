import { mainUrl, backupUrls } from 'utils/constants'

function setPrimaryReachable() {
  chrome.storage.local.set({ primaryApiUnreachable: false })
}

function setUsingBackupOnly() {
  chrome.storage.local.set({ primaryApiUnreachable: true })
}

function shouldUseResponse(response) {
  return (
    response.ok ||
    (response.status >= 400 && response.status < 500)
  )
}

const apiFetch = async (endpoint, options) => {
  const mainBase = 'https://' + mainUrl

  for (let i = 0; i < 2; i++) {
    try {
      const response = await fetch(
        mainBase + '/api/' + endpoint + '/',
        options
      )
      if (shouldUseResponse(response)) {
        chrome.storage.local.set({ activeUrl: mainUrl.trim() })
        setPrimaryReachable()
        return response
      }
    } catch (e) {
      console.log(e)
    }
  }

  for (const host of backupUrls) {
    const base = 'https://' + host
    try {
      const response = await fetch(
        base + '/api/' + endpoint + '/',
        options
      )
      if (shouldUseResponse(response)) {
        chrome.storage.local.set({ activeUrl: host.trim() })
        setUsingBackupOnly()
        return response
      }
    } catch (e) {
      console.log(e)
    }
  }

  setPrimaryReachable()
  throw new Error('All API hosts failed')
}

export default apiFetch

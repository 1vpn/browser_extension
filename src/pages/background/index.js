import { isFirefox, androidUrl, freeCredentials } from 'utils/constants'
import setBadge from 'utils/setBadge'
import apiFetch from 'utils/apiFetch'
import { handleProxyRequest } from 'utils/manageProxy'
import logout from 'utils/logout'
import spoofGeolocation from 'utils/spoofGeolocation'

chrome.runtime.onInstalled.addListener((details) => {
  setBadge()

  if (details.reason === 'install') {
    chrome.storage.local.set({ installDate: Date.now() })

    chrome.tabs.create({
      url: chrome.runtime.getURL('install.html'),
    })
  }
})

chrome.runtime.onStartup.addListener(() => {
  setBadge()
  chrome.storage.local.get(['isConnected'], (storage) => {
    if (storage.isConnected) {
      fetch('https://1vpn.org/proxy_auth/')
    }
  })
})

chrome.runtime.setUninstallURL(androidUrl)

chrome.webRequest.onAuthRequired.addListener(
  (details, callbackFn) => {
    const getCredentialsAsync = () => {
      return new Promise((resolve, reject) => {
        chrome.storage.local.get(
          ['isPremium', 'username', 'sessionAuthToken'],
          (storage) => {
            if (chrome.runtime.lastError) {
              reject(new Error(chrome.runtime.lastError))
            } else {
              const credentials = storage.isPremium
                ? {
                    username: storage.username,
                    password: storage.sessionAuthToken,
                  }
                : freeCredentials

              resolve({ authCredentials: credentials })
            }
          }
        )
      })
    }

    if (isFirefox) {
      return getCredentialsAsync()
    } else {
      getCredentialsAsync().then((credentials) => {
        callbackFn(credentials)
      })
    }
  },
  { urls: ['<all_urls>'] },
  [isFirefox ? 'blocking' : 'asyncBlocking']
)

if (isFirefox) {
  browser.proxy.onRequest.addListener(handleProxyRequest, {
    urls: ['<all_urls>'],
  })
}

chrome.alarms.create('fetchUserData', { periodInMinutes: 6 * 60 })

chrome.alarms.onAlarm.addListener((alarm) => {
  chrome.storage.local.get(['sessionAuthToken'], (storage) => {
    if (!storage.sessionAuthToken) return
    if (alarm.name === 'fetchUserData') {
      apiFetch('api/refresh_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Token ' + storage.sessionAuthToken,
        },
      })
        .then(async (response) => {
          if (!response.ok) {
            const err = await response.json()
            logout()
            throw err
          }
          return response.json()
        })
        .then((data) => {
          chrome.storage.local.set(data)
        })
        .catch((error) => {
          console.error('Error:', error)
        })
    }
  })
})

chrome.webNavigation.onCommitted.addListener((details) => {
  if (
    details.url?.startsWith('chrome://') ||
    details.url?.startsWith('chrome-extension://') ||
    details.url?.startsWith('https://chromewebstore.google.com/')
  )
    return

  chrome.storage.local.get(
    ['spoofGeolocation', 'isConnected', 'currentLocation'],
    (storage) => {
      if (
        storage.spoofGeolocation &&
        storage.isConnected &&
        storage.currentLocation
      ) {
        chrome.scripting.executeScript({
          target: { tabId: details.tabId, allFrames: true },
          world: 'MAIN',
          injectImmediately: true,
          func: spoofGeolocation,
          args: [
            {
              latitude: storage.currentLocation.latitude,
              longitude: storage.currentLocation.longitude,
            },
          ],
        })
      }
    }
  )
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'popupOpened') {
    chrome.storage.local.get(['sessionAuthToken', 'username'], (storage) => {
      const authToken = storage.sessionAuthToken
        ? 'Token ' + storage.sessionAuthToken
        : null

      apiFetch('get_user_data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken && { Authorization: authToken }),
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.username) {
            chrome.storage.local.set(data)
          } else if (storage.username) {
            logout()
          }
        })
        .catch((error) => {
          console.error('Error fetching user data:', error)
        })
    })
    return true
  }
})

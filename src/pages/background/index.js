import {
  isFirefox,
  androidUrl,
  freeCredentials,
  backupUrl,
  websiteUrl,
} from 'utils/constants'
import setBadge from 'utils/setBadge'
import apiFetch from 'utils/apiFetch'
import { handleProxyRequest, connect } from 'utils/manageProxy'
import logout from 'utils/logout'
import spoofGeolocation from 'utils/spoofGeolocation'
import freeLocations from 'utils/freeLocations'

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
      fetch(`${websiteUrl}/proxy_auth/`)
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
      apiFetch('refresh_token', {
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
    ['spoofGeolocation', 'isConnected', 'currentLocation', 'locations'],
    (storage) => {
      if (
        storage.spoofGeolocation &&
        storage.isConnected &&
        storage.currentLocation
      ) {
        const locations = storage.locations || freeLocations
        const location = locations.find(
          (loc) => loc.countryCode === storage.currentLocation
        )
        if (location) {
          chrome.scripting.executeScript({
            target: { tabId: details.tabId, allFrames: true },
            world: 'MAIN',
            injectImmediately: true,
            func: spoofGeolocation,
            args: [
              {
                latitude: location.latitude,
                longitude: location.longitude,
              },
            ],
          })
        }
      }
    }
  )
})

const handleUserData = (data, wasLoggedIn) => {
  if (data.username) {
    chrome.storage.local.get(['isPremium', 'isConnected'], (prevStorage) => {
      const wasPremium = prevStorage.isPremium || false
      const isConnected = prevStorage.isConnected || false
      chrome.storage.local.set(data, () => {
        if (data.isPremium !== wasPremium && isConnected) {
          connect()
        }
      })
    })
  } else if (wasLoggedIn) {
    logout()
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'popupOpened') {
    chrome.storage.local.get(['sessionAuthToken', 'username'], (storage) => {
      const authToken = storage.sessionAuthToken
        ? 'Token ' + storage.sessionAuthToken
        : null
      const wasLoggedIn = !!storage.username

      apiFetch('get_user_data_web', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken && { Authorization: authToken }),
        },
      })
        .then(async (response) => {
          if (!response.ok) throw new Error('get_user_data_web failed')
          return response.json()
        })
        .then((data) => handleUserData(data, wasLoggedIn))
        .catch(() => {
          fetch(`${backupUrl}/api/get_user_data_api/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(authToken && { Authorization: authToken }),
            },
          })
            .then(async (response) => {
              if (!response.ok) throw new Error('get_user_data_api failed')
              return response.json()
            })
            .then((data) => handleUserData(data, wasLoggedIn))
            .catch((apiError) => {
              console.error('Error fetching user data from API:', apiError)
            })
        })
    })
    return true
  }
})

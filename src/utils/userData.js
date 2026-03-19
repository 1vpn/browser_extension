import apiFetch from 'utils/apiFetch'
import { connect } from 'utils/manageProxy'
import logout from 'utils/logout'

const locationsArrayToMap = (locationsArray) =>
  Array.isArray(locationsArray)
    ? locationsArray.reduce((locationsByCode, locationItem) => {
        if (locationItem && locationItem.cityCode) {
          locationsByCode[locationItem.cityCode] = locationItem
        }
        return locationsByCode
      }, {})
    : locationsArray

const storeUserData = (userDataPayload, onStored) => {
  const processedUserData = { ...userDataPayload }

  if (Array.isArray(processedUserData.locations)) {
    processedUserData.locations = locationsArrayToMap(
      processedUserData.locations
    )
  }

  chrome.storage.local.set(processedUserData, () => {
    if (typeof onStored === 'function') {
      onStored()
    }
  })
}

export const fetchUserData = () => {
  chrome.storage.local.get(['sessionAuthToken', 'username'], (storageValues) => {
    const sessionAuthTokenValue = storageValues.sessionAuthToken
      ? 'Token ' + storageValues.sessionAuthToken
      : null
    const wasLoggedIn = !!storageValues.username

    const headers = {
      'Content-Type': 'application/json',
      ...(sessionAuthTokenValue
        ? { Authorization: sessionAuthTokenValue }
        : {}),
    }

    apiFetch('get_user_data_api', {
      method: 'POST',
      headers,
      body: JSON.stringify({}),
    })
      .then(async (apiResponse) => {
        if (!apiResponse.ok) throw new Error('get_user_data failed')
        return apiResponse.json()
      })
      .then((userDataPayload) => {
        if (userDataPayload && userDataPayload.username) {
          chrome.storage.local.get(['isConnected'], (connectionStorage) => {
            const isConnectedValue = connectionStorage.isConnected || false
            storeUserData(userDataPayload, () => {
              if (userDataPayload.isPremium && isConnectedValue) {
                connect()
              }
            })
          })
          return
        }

        if (wasLoggedIn) logout()
      })
      .catch((apiError) => {
        console.error('Error fetching user data from API:', apiError)
      })
  })
}

export const fetchLoginUserData = (onSuccess, onError) => {
  chrome.storage.local.get(['sessionAuthToken'], (storageValues) => {
    const sessionAuthTokenValue = storageValues.sessionAuthToken
      ? 'Token ' + storageValues.sessionAuthToken
      : null

    const headers = {
      'Content-Type': 'application/json',
      ...(sessionAuthTokenValue
        ? { Authorization: sessionAuthTokenValue }
        : {}),
    }

    apiFetch('get_user_data_api', {
      method: 'POST',
      headers,
      body: JSON.stringify({}),
    })
      .then(async (apiResponse) => {
        if (!apiResponse.ok) throw new Error('get_user_data failed')
        return apiResponse.json()
      })
      .then((userDataPayload) => {
        if (!userDataPayload || !userDataPayload.username) {
          throw new Error('Could not load account')
        }

        chrome.storage.local.get(['isConnected'], (connectionStorage) => {
          const isConnectedValue = connectionStorage.isConnected || false
          storeUserData(userDataPayload, () => {
            if (userDataPayload.isPremium && isConnectedValue) {
              connect()
            }
            if (typeof onSuccess === 'function') {
              onSuccess()
            }
          })
        })
      })
      .catch((apiError) => {
        if (typeof onError === 'function') {
          onError(apiError)
        }
      })
  })
}

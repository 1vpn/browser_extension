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

    apiFetch('get_user_data_web', {
      method: 'POST',
      headers,
      body: JSON.stringify({}),
    })
      .then(async (response) => {
        if (!response.ok) return null
        return response.json()
      })
      .then((payload) => {
        if (payload && payload.username) {
          chrome.storage.local.get(['isConnected'], (connectionStorage) => {
            storeUserData(payload, () => {
              if (payload.isPremium && connectionStorage.isConnected) {
                connect()
              }
            })
          })
        } else if (wasLoggedIn) {
          logout()
        }
      })
      .catch((error) => {
        console.error('Error fetching user data:', error)
      })
  })
}

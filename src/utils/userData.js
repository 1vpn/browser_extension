import { backupUrl } from 'utils/constants'
import apiFetch from 'utils/apiFetch'
import { connect } from 'utils/manageProxy'
import logout from 'utils/logout'

export const handleUserData = (data, wasLoggedIn) => {
  if (data.username) {
    chrome.storage.local.get(['isPremium', 'isConnected'], (prevStorage) => {
      const wasPremium = prevStorage.isPremium || false
      const isConnected = prevStorage.isConnected || false

      const processedData = { ...data }
      if (Array.isArray(processedData.locations)) {
        processedData.locations = processedData.locations.reduce(
          (acc, location) => {
            if (location && location.countryCode) {
              acc[location.countryCode] = location
            }
            return acc
          },
          {}
        )
      }

      chrome.storage.local.set(processedData, () => {
        if (data.isPremium !== wasPremium && isConnected) {
          connect()
        }
      })
    })
  } else if (wasLoggedIn) {
    logout()
  }
}

export const fetchUserData = () => {
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
}

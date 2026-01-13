import freeLocations from './freeLocations'

const setBadge = () => {
  chrome.storage.local.get(
    ['isConnected', 'currentLocation', 'locations'],
    (storage) => {
      if (storage.isConnected && storage.currentLocation) {
        const locations = storage.locations || freeLocations
        const location = locations[storage.currentLocation]
        if (location && location.countryCode) {
          chrome.action.setBadgeBackgroundColor({ color: '#22c774' })
          chrome.action.setBadgeTextColor({ color: '#fff' })
          chrome.action.setBadgeText({
            text: location.countryCode.substring(0, 2).toUpperCase(),
          })
        } else {
          chrome.action.setBadgeText({ text: '' })
        }
      } else {
        chrome.action.setBadgeText({ text: '' })
      }
    }
  )
}

export default setBadge

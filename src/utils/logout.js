import { disconnect } from 'utils/manageProxy'
import freeLocations from 'utils/freeLocations'

const logout = () => {
  disconnect()

  const keysToKeep = [
    'messages',
    'installDate',
    'locationUnlocked',
    'upgradeModalClicked',
    'upgradeModalLastShown',
    'installModalCopiedTime',
    'userModalType',
  ]

  chrome.storage.local.get(null, (items) => {
    const keysToRemove = Object.keys(items).filter(
      (key) => !keysToKeep.includes(key)
    )
    if (keysToRemove.length) {
      chrome.storage.local.remove(keysToRemove)
    }
    const firstLocation = Object.values(freeLocations)[0]
    if (firstLocation) {
      chrome.storage.local.set({ currentLocation: firstLocation.countryCode })
    }
  })
}

export default logout

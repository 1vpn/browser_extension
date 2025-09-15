import { disconnect } from 'utils/manageProxy'
import freeLocations from 'utils/freeLocations'

const logout = () => {
  disconnect()

  const keysToKeep = [
    'messages',
    'unlocked',
    'installDate',
    'upgradeModalClicked',
    'upgradeModalLastShown',
  ]

  chrome.storage.local.get(null, (items) => {
    const keysToRemove = Object.keys(items).filter(
      (key) => !keysToKeep.includes(key)
    )
    if (keysToRemove.length) {
      chrome.storage.local.remove(keysToRemove)
    }
    chrome.storage.local.set({ currentLocation: freeLocations[0] })
  })
}

export default logout

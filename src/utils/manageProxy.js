import setBadge from './setBadge'
import { isFirefox, websiteUrl } from './constants'
import freeLocations from './freeLocations'

const handleProxyRequest = (details) => {
  return new Promise((resolve, reject) => {
    const url = new URL(details.url)
    const hostname = url.hostname

    const whitelistDomains = ['localhost', '127.0.0.1', '1vpn.website']

    if (whitelistDomains.includes(hostname)) {
      resolve({ type: 'direct' })
      return
    }

    chrome.storage.local.get(
      ['isConnected', 'currentLocation', 'locations'],
      (storage) => {
        if (storage.isConnected && storage.currentLocation) {
          const locations = storage.locations || freeLocations
          const location = locations[storage.currentLocation]
          if (location && location.hosts) {
            const host = location.hosts[0]
            resolve({
              type: 'https',
              host: host.hostname,
              port: host.port,
            })
          } else {
            resolve({ type: 'direct' })
          }
        } else {
          resolve({ type: 'direct' })
        }
      }
    )
  })
}

const getPacScript = (hosts) => {
  const hostNamesString = hosts.reduce(
    (hostsString, host) =>
      (hostsString += `HTTPS ${host.hostname}:${host.port};`),
    ''
  )

  return `
    function FindProxyForURL(url, host) {
      if (dnsDomainIs(host, "1vpn.website")) {
        return "DIRECT";
      }
      // For all other cases use the specified proxy settings
      return "${hostNamesString}";
    }
  `
}

const connect = async () => {
  chrome.storage.local.get(
    ['currentLocation', 'locations', 'isPremium'],
    (storage) => {
      if (!storage.currentLocation) return

      const locations = storage.locations || freeLocations
      const location = locations[storage.currentLocation]

      if (!location || !location.hosts) return

      if (!isFirefox) {
        chrome.management.getAll((extensions) => {
          extensions.forEach((extension) => {
            if (
              extension.permissions &&
              extension.permissions.includes('proxy')
            ) {
              if (extension.id !== chrome.runtime.id) {
                chrome.management.setEnabled(extension.id, false)
              }
            }
          })
        })

        const randomizedHosts = [...location.hosts].sort(
          () => Math.random() - 0.5
        )
        const pacScript = getPacScript(randomizedHosts)

        chrome.proxy.settings
          .set({
            value: {
              mode: 'pac_script',
              pacScript: {
                data: pacScript,
                mandatory: true,
              },
            },
            scope: 'regular',
          })
          .then(async () => {
            fetch(`${websiteUrl}/proxy_auth/`)
          })
      }

      chrome.storage.local.set({ isConnected: true })
      setBadge()
    }
  )
}

const disconnect = () => {
  if (!isFirefox) {
    chrome.proxy.settings.set({
      value: { mode: 'direct', rules: {} },
      scope: 'regular',
    })
  }
  chrome.storage.local.set({
    isConnected: false,
  })
  chrome.action.setBadgeText({ text: '' })
}

export { handleProxyRequest, connect, disconnect }

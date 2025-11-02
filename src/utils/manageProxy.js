import setBadge from './setBadge'
import { isFirefox, websiteUrl, ipCheckUrl } from './constants'
import apiFetch from './apiFetch'

const handleProxyRequest = (details) => {
  return new Promise((resolve, reject) => {
    const url = new URL(details.url)
    const hostname = url.hostname

    const whitelistDomains = ['localhost', '127.0.0.1', '1vpn.website']

    if (whitelistDomains.includes(hostname)) {
      resolve({ type: 'direct' })
      return
    }

    chrome.storage.local.get(['isConnected', 'currentLocation'], (storage) => {
      if (storage.isConnected) {
        const host = storage.currentLocation.hosts[0]
        resolve({
          type: 'https',
          host: host.hostname,
          port: host.port,
        })
      } else {
        resolve({ type: 'direct' })
      }
    })
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

const connect = async (hosts) => {
  let storedIp = null
  const ipResponse = await fetch(ipCheckUrl)
  if (ipResponse.ok) {
    const ipData = await ipResponse.json()
    storedIp = ipData.ip || null
  }

  console.log('storedIp', storedIp)

  if (!isFirefox) {
    chrome.management.getAll((extensions) => {
      extensions.forEach((extension) => {
        if (extension.permissions && extension.permissions.includes('proxy')) {
          if (extension.id !== chrome.runtime.id) {
            chrome.management.setEnabled(extension.id, false)
          }
        }
      })
    })

    const randomizedHosts = [...hosts].sort(() => Math.random() - 0.5)
    const selectedHost = randomizedHosts[0]
    const hostname = selectedHost ? selectedHost.hostname : null

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
        try {
          const authResponse = await fetch(`${websiteUrl}/proxy_auth/`)
          if (!authResponse.ok) {
            throw new Error('Proxy auth failed')
          }
        } catch (error) {
          if (storedIp) {
            await apiFetch('api/report_server_issue', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                ip_address: storedIp,
                https_host: hostname,
              }),
            })
          }
        }
      })
  }

  setBadge()
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

import { websiteUrl, backupUrl } from 'utils/constants'

const apiFetch = async (endpoint, options) => {
  const fetchWithRetry = async (apiUrl, isRetry = false) => {
    try {
      const response = await fetch(`${apiUrl}/api/${endpoint}/`, options)
      return response
    } catch (error) {
      console.log(error)

      if (!isRetry) {
        return await fetchWithRetry(backupUrl, true)
      } else {
        throw error
      }
    }
  }

  return await fetchWithRetry(websiteUrl)
}

export default apiFetch

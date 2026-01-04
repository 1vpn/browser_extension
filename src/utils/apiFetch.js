import { websiteUrl } from 'utils/constants'

const apiFetch = async (endpoint, options) => {
  const fetchWithRetry = async (apiUrl) => {
    try {
      const response = await fetch(`${apiUrl}/api/${endpoint}/`, options)
      return response
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  return await fetchWithRetry(websiteUrl)
}

export default apiFetch

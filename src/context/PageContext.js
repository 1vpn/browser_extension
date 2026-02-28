import React, { createContext, useState, useEffect } from 'react'
import { TWELVE_HOURS } from 'utils/constants'

export const PageContext = createContext()

export const PageProvider = ({ children }) => {
  const [pages, setPages] = useState([])

  useEffect(() => {
    chrome.storage.local.get(
      [
        'noAccount',
        'sessionAuthToken',
        'isPremium',
        'upgradeModalLastShown',
        'upgradeButtonClicked',
      ],
      (storage) => {
        let initialPage = 'main'

        if (!storage.isPremium) {
          const upgradeModalLastShown = storage.upgradeModalLastShown || 0
          const upgradeButtonClicked = storage.upgradeButtonClicked || false

          // Reset button clicked status after 12 hours
          if (
            upgradeModalLastShown > 0 &&
            Date.now() - upgradeModalLastShown >= TWELVE_HOURS
          ) {
            chrome.storage.local.set({ upgradeButtonClicked: false })
          }

          // Show upgrade page every 12 hours
          if (!upgradeButtonClicked) {
            const shouldShowModal =
              upgradeModalLastShown === 0 ||
              Date.now() - upgradeModalLastShown >= TWELVE_HOURS

            if (shouldShowModal) {
              initialPage = 'upgrade'
              chrome.storage.local.set({ upgradeModalLastShown: Date.now() })
            }
          }
        }

        setPages([initialPage])
      }
    )
  }, [])

  const currentPage = pages[0]

  const setCurrentPage = (page) => {
    setPages((prevPages) => [page, ...prevPages].slice(0, 3))
  }

  const goBackPage = () => {
    const previousPage = pages[1]

    if (previousPage) {
      setPages(pages.slice(1))
    }
  }

  return (
    <PageContext.Provider value={{ currentPage, setCurrentPage, goBackPage }}>
      {children}
    </PageContext.Provider>
  )
}


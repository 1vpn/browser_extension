import React, { createContext, useState, useEffect } from 'react'

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
        'upgradePageType',
      ],
      (storage) => {
        let initialPage = 'main'

        if (!storage.isPremium) {
          const now = Date.now()
          const upgradeModalLastShown = storage.upgradeModalLastShown || 0
          const twentyFourHours = 24 * 60 * 60 * 1000
          const upgradeButtonClicked = storage.upgradeButtonClicked || false
          let upgradePageType = storage.upgradePageType

          if (
            upgradeModalLastShown > 0 &&
            now - upgradeModalLastShown >= twentyFourHours
          ) {
            chrome.storage.local.set({ upgradeButtonClicked: false })
            upgradePageType = null
          }

          if (!upgradeButtonClicked) {
            if (!upgradePageType) {
              if (upgradeModalLastShown === 0) {
                upgradePageType = 'upgrade'
              } else {
                upgradePageType =
                  Math.random() < 0.5 ? 'upgrade' : 'specialOffer'
              }
              chrome.storage.local.set({ upgradePageType })
            }
            initialPage = upgradePageType

            if (
              upgradeModalLastShown === 0 ||
              now - upgradeModalLastShown >= twentyFourHours
            ) {
              chrome.storage.local.set({ upgradeModalLastShown: now })
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

import React, { createContext, useState, useEffect } from 'react'
import { TWELVE_HOURS } from 'utils/constants'
import { checkAndManageSpecialOffer } from 'utils/specialOffer'

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
        'specialOfferExpirationTime',
      ],
      (storage) => {
        let initialPage = 'main'
        const now = Date.now()

        if (!storage.isPremium) {
          // Check and manage special offer expiration/reactivation
          const specialOffer = checkAndManageSpecialOffer(
            storage.specialOfferExpirationTime,
            now
          )

          // Update storage if expiration time changed
          if (specialOffer.expirationTime !== storage.specialOfferExpirationTime) {
            chrome.storage.local.set({
              specialOfferExpirationTime: specialOffer.expirationTime,
            })
          }

          const isSpecialOfferActive = specialOffer.isActive

          const upgradeModalLastShown = storage.upgradeModalLastShown || 0
          const upgradeButtonClicked = storage.upgradeButtonClicked || false

          // Reset button clicked status after 12 hours
          if (
            upgradeModalLastShown > 0 &&
            now - upgradeModalLastShown >= TWELVE_HOURS
          ) {
            chrome.storage.local.set({ upgradeButtonClicked: false })
          }

          // Show upgrade or special offer page every 12 hours
          if (!upgradeButtonClicked) {
            const shouldShowModal =
              upgradeModalLastShown === 0 ||
              now - upgradeModalLastShown >= TWELVE_HOURS

            if (shouldShowModal) {
              // On first open, show upgrade page
              if (upgradeModalLastShown === 0) {
                initialPage = 'upgrade'
              } else {
                // After first open, show special offer if active, otherwise upgrade
                initialPage = isSpecialOfferActive ? 'specialOffer' : 'upgrade'
              }

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


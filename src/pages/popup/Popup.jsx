import { useEffect, useState, useContext } from 'react'
import { PageContext } from 'context/PageContext'
import useLocalization from 'hooks/useLocalization'
import useChromeStorage from 'hooks/useChromeStorage'
import { Flex, Box } from 'theme-ui'
import freeLocations from 'utils/freeLocations'
import { connect, disconnect } from 'utils/manageProxy'
import { localeMessageKeys } from 'utils/constants'
import { checkAndManageSpecialOffer, formatTimeRemaining } from 'utils/specialOffer'
import MainPage from './MainPage'
import OptionsPage from './OptionsPage'
import LocationsPage from './LocationsPage'
import UpgradePage from './UpgradePage'
import SpecialOfferPage from './SpecialOfferPage'
import AndroidPage from './AndroidPage'

const Popup = () => {
  const { currentPage, setCurrentPage } = useContext(PageContext)
  const messages = useLocalization(localeMessageKeys)

  const [isLoaded, setIsLoaded] = useState(false)
  const [isSpecialOfferActive, setIsSpecialOfferActive] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(null)

  const [sessionAuthToken] = useChromeStorage('sessionAuthToken', '')
  const [installDate] = useChromeStorage('installDate', 0)
  const [locations] = useChromeStorage('locations', freeLocations)
  const [isPremium] = useChromeStorage('isPremium', false)
  const [isConnected, setIsConnected] = useChromeStorage('isConnected', false)
  const [currentCityCode, setCurrentCityCode] = useChromeStorage(
    'currentLocation',
    ''
  )
  const [spoofGeolocation, setSpoofGeolocation] = useChromeStorage(
    'spoofGeolocation',
    false
  )
  const [disableWebRtc, setDisableWebRtc] = useChromeStorage(
    'disableWebRtc',
    false
  )

  useEffect(() => {
    chrome.runtime.sendMessage({ type: 'popupOpened' })

    let interval

    const checkSpecialOfferStatus = () => {
      chrome.storage.local.get(['specialOfferExpirationTime', 'currentLocation'], (storage) => {
        const now = Date.now()
        
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

        const expirationTime = specialOffer.expirationTime
        const isActive = specialOffer.isActive
        setIsSpecialOfferActive(isActive)

        if (isActive && expirationTime) {
          const remaining = Math.max(0, expirationTime - now)
          
          if (remaining === 0) {
            setTimeRemaining(null)
            setIsSpecialOfferActive(false)
          } else {
            setTimeRemaining(formatTimeRemaining(remaining))
          }
        } else {
          setTimeRemaining(null)
        }

        if (!storage.currentLocation) {
          const firstLocation = Object.values(locations)[0]
          if (firstLocation) {
            setCurrentCityCode(firstLocation.cityCode)
          }
        }
        setIsLoaded(true)
      })
    }

    checkSpecialOfferStatus()

    // Check periodically to update when timer expires
    interval = setInterval(checkSpecialOfferStatus, 1000)

    return () => {
      if (interval) clearInterval(interval)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleConnectionToggle = () => {
    setIsConnected(!isConnected)
    if (isConnected) {
      disconnect()
    } else {
      connect()
    }
  }

  const handleLocationToggle = (location) => {
    setCurrentPage('main')
    setCurrentCityCode(location.cityCode)
    setIsConnected(true)
    connect()
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'locations':
        return (
          <LocationsPage
            locations={isPremium ? locations : freeLocations}
            currentCityCode={currentCityCode}
            handleLocationToggle={handleLocationToggle}
            installDate={installDate}
            messages={messages}
            isPremium={isPremium}
          />
        )
      case 'options':
        return (
          <OptionsPage
            sessionAuthToken={sessionAuthToken}
            isPremium={isPremium}
            spoofGeolocation={spoofGeolocation}
            setSpoofGeolocation={setSpoofGeolocation}
            disableWebRtc={disableWebRtc}
            setDisableWebRtc={setDisableWebRtc}
            messages={messages}
          />
        )
      case 'upgrade':
        return <UpgradePage messages={messages} />
      case 'specialOffer':
        return <SpecialOfferPage messages={messages} />
      case 'android':
        return <AndroidPage messages={messages} />
      case 'main':
      default:
        return (
          <MainPage
            isPremium={isPremium}
            isConnected={isConnected}
            currentCityCode={currentCityCode}
            locations={isPremium ? locations : freeLocations}
            handleConnectionToggle={handleConnectionToggle}
            installDate={installDate}
            messages={messages}
            isSpecialOfferActive={isSpecialOfferActive}
            timeRemaining={timeRemaining}
          />
        )
    }
  }

  if (!isLoaded) {
    return <Box sx={{ width: 0, height: 0 }} />
  }

  return (
    <Flex
      sx={{
        width: '100%',
        minWidth: '375px',
        flexDirection: 'column',
        backgroundColor: 'white',
      }}
    >
      {renderCurrentPage()}
    </Flex>
  )
}

export default Popup

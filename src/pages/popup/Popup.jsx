import { useEffect, useState, useContext } from 'react'
import { PageContext } from 'context/PageContext'
import useLocalization from 'hooks/useLocalization'
import useChromeStorage from 'hooks/useChromeStorage'
import { Flex, Box } from 'theme-ui'
import freeLocations from 'utils/freeLocations'
import { connect, disconnect } from 'utils/manageProxy'
import { localeMessageKeys } from 'utils/constants'
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

  const [sessionAuthToken] = useChromeStorage('sessionAuthToken', '')
  const [installDate] = useChromeStorage('installDate', 0)
  const [locations] = useChromeStorage('locations', freeLocations)
  const [isPremium] = useChromeStorage('isPremium', false)
  const [isConnected, setIsConnected] = useChromeStorage('isConnected', false)
  const [currentLocationCode, setCurrentLocationCode] = useChromeStorage(
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

    chrome.storage.local.get(['currentLocation'], (storage) => {
      if (!storage.currentLocation && locations[0]) {
        setCurrentLocationCode(locations[0].countryCode)
      }
      setIsLoaded(true)
    })
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
    setCurrentLocationCode(location.countryCode)
    setIsConnected(true)
    connect()
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'locations':
        return (
          <LocationsPage
            locations={isPremium ? locations : freeLocations}
            currentLocationCode={currentLocationCode}
            handleLocationToggle={handleLocationToggle}
            installDate={installDate}
            messages={messages}
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
            currentLocationCode={currentLocationCode}
            locations={isPremium ? locations : freeLocations}
            handleConnectionToggle={handleConnectionToggle}
            installDate={installDate}
            messages={messages}
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

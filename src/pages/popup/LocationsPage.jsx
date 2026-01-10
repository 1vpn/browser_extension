import { useState, useContext } from 'react'
import { Flex, Text } from 'theme-ui'
import { PageContext } from 'context/PageContext'
import flags from 'utils/flags'
import PageHeader from './PageHeader'
import Location from './Location'
import ReviewModal from './ReviewModal'
import InstallModal from './InstallModal'
import Arrow from 'assets/arrow.svg'

const LocationsPage = ({
  locations,
  currentLocationCode,
  handleLocationToggle,
  installDate,
  messages,
  isPremium,
}) => {
  const { goBackPage } = useContext(PageContext)
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)

  const sortedLocations = Object.values(locations).sort((a, b) => {
    if (!isPremium) {
      const aIsPremium = a.isPremium ? 1 : 0
      const bIsPremium = b.isPremium ? 1 : 0
      if (aIsPremium !== bIsPremium) return aIsPremium - bIsPremium
    }
    const countryCompare = (a.country || '').localeCompare(b.country || '')
    if (countryCompare !== 0) return countryCompare
    return (a.city || '').localeCompare(b.city || '')
  })

  return (
    <>
      <PageHeader
        left={<Text sx={{ fontSize: '20px' }}>{messages.locations}</Text>}
        rightIcon={Arrow}
        onRightClick={goBackPage}
      />
      <InstallModal
        messages={messages}
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />
      <ReviewModal
        messages={messages}
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
      />
      <Flex
        sx={{
          position: 'relative',
          flexDirection: 'column',
          maxHeight: '525px',
          overflowY: 'overlay',
          overflowX: 'hidden',
          // p: isFirefox ? '0 24px 24px 0' : '0 18px 24px 0',
        }}
      >
        <Flex sx={{ flexDirection: 'column' }}>
          {sortedLocations.map((location) => {
            return (
              <Location
                title={location.city || messages[location.countryCode]}
                subTitle={location.country}
                id={location.countryCode}
                checked={currentLocationCode === location.countryCode}
                location={location}
                handleLocationToggle={handleLocationToggle}
                installDate={installDate}
                setIsReviewModalOpen={setIsReviewModalOpen}
                setIsInstallModalOpen={setIsInstallModalOpen}
                icon={flags[location.countryCode]}
                isPremium={location.isPremium}
                messages={messages}
                key={location.countryCode}
              />
            )
          })}
        </Flex>
      </Flex>
    </>
  )
}

export default LocationsPage

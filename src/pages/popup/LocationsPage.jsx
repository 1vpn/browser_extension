import { useState, useContext } from 'react'
import { Flex, Text } from 'theme-ui'
import { PageContext } from 'context/PageContext'
import flags from 'utils/flags'
import PageHeader from './PageHeader'
import Location from './Location'
import ReviewModal from './ReviewModal'
import ShareModal from './ShareModal'
import InstallModal from './InstallModal'
import Arrow from 'assets/arrow.svg'

const LocationsPage = ({
  locations,
  currentLocation,
  handleLocationToggle,
  installDate,
  messages,
}) => {
  const { goBackPage } = useContext(PageContext)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)

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
      <ShareModal
        messages={messages}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
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
          {locations.map((location) => {
            return (
              <Location
                title={messages[location.countryCode]}
                subTitle={
                  location.countryCode + ' ' + messages[location.countryCode]
                }
                id={location.countryCode}
                checked={currentLocation.country === location.country}
                location={location}
                handleLocationToggle={handleLocationToggle}
                installDate={installDate}
                setIsReviewModalOpen={setIsReviewModalOpen}
                setIsInstallModalOpen={setIsInstallModalOpen}
                setIsShareModalOpen={setIsShareModalOpen}
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

import { useState, useContext } from 'react'
import { Flex, Box, Text } from 'theme-ui'
import { isFirefox, websiteUrl } from 'utils/constants'
import { PageContext } from 'context/PageContext'
import flags from 'utils/flags'
import PageHeader from './PageHeader'
import Toggle from './Toggle'
import ReviewModal from './ReviewModal'
import ShareModal from './ShareModal'
import InstallModal from './InstallModal'
import ChevronRight from 'assets/chevronRight.svg'

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
        rightIcon={ChevronRight}
        onRightClick={goBackPage}
      />
      <Box sx={{ px: '24px' }}>
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
            overflowY: 'auto',
            p: isFirefox ? '0 24px 24px 0' : '0 18px 24px 0',
          }}
        >
          <Flex sx={{ pt: '24px', gap: '24px', flexDirection: 'column' }}>
            {locations.map((location) => {
              return (
                <Toggle
                  title={messages[location.countryCode]}
                  id={location.countryCode}
                  checked={currentLocation.country === location.country}
                  onToggle={async () => {
                    if (location.isPremium) {
                      chrome.tabs.create({
                        url: `${websiteUrl}/select_plan`,
                      })
                    } else if (location.ratingLocked) {
                      chrome.storage.local.get(
                        ['locationUnlocked', 'installModalCopiedTime'],
                        (result) => {
                          if (result.locationUnlocked === true) {
                            handleLocationToggle(location)
                          } else {
                            const now = Date.now()
                            const installModalCopiedTime =
                              result.installModalCopiedTime || 0
                            if (
                              installModalCopiedTime &&
                              now - installModalCopiedTime > 2 * 60 * 1000
                            ) {
                              handleLocationToggle(location)
                              return
                            }
                            const installTime = installDate
                              ? new Date(installDate).getTime()
                              : 0
                            if (
                              installDate &&
                              now - installTime > 48 * 60 * 60 * 1000
                            ) {
                              setIsReviewModalOpen(true)
                              return
                            }
                            chrome.storage.local.get(
                              ['userModalType'],
                              (modalResult) => {
                                let modalType = modalResult.userModalType
                                if (!modalType) {
                                  modalType =
                                    Math.random() < 0.5 ? 'install' : 'share'
                                  chrome.storage.local.set({
                                    userModalType: modalType,
                                  })
                                }
                                if (modalType === 'install') {
                                  setIsInstallModalOpen(true)
                                } else {
                                  setIsShareModalOpen(true)
                                }
                              }
                            )
                          }
                        }
                      )
                    } else {
                      handleLocationToggle(location)
                    }
                  }}
                  icon={flags[location.countryCode]}
                  hideToggle={location.isPremium}
                  messages={messages}
                  key={location.countryCode}
                />
              )
            })}
          </Flex>
        </Flex>
      </Box>
    </>
  )
}

export default LocationsPage

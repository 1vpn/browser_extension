import { useState } from 'react'
import { Flex } from 'theme-ui'
import { isFirefox, websiteUrl } from 'utils/constants'
import flags from 'utils/flags'
import PageHeader from './PageHeader'
import Toggle from './Toggle'
import ReviewModal from './ReviewModal'
import ShareModal from './ShareModal'
import InstallModal from './InstallModal'

const LocationsPage = ({
  locations,
  currentLocation,
  handleLocationToggle,
  installDate,
  messages,
}) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)

  return (
    <PageHeader
      title={messages.locations}
      styles={{
        p: '0 0 0 24px',
      }}
    >
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
                          // Only allow review modal after 24h from install
                          const installTime = installDate
                            ? new Date(installDate).getTime()
                            : 0
                          if (
                            installDate &&
                            now - installTime > 24 * 60 * 60 * 1000
                          ) {
                            setIsReviewModalOpen(true)
                            return
                          }
                          // Only one of install/share modal per user
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
    </PageHeader>
  )
}

export default LocationsPage

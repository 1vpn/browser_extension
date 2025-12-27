import { useState, useEffect, useContext } from 'react'
import { PageContext } from 'context/PageContext'
import { Box, Flex, Button, Link, Text } from 'theme-ui'
import { isFirefox, websiteUrl } from 'utils/constants'
import UpgradeModal from './UpgradeModal'
import flags from 'utils/flags'
import Logo from 'assets/logo.svg'
import MenuIcon from 'assets/menu.svg'
import Star from 'assets/star.svg'
import ChevronRight from 'assets/chevronRight.svg'
import PageHeader from './PageHeader'

const MainPage = ({
  isPremium,
  isConnected,
  currentLocation,
  handleConnectionToggle,
  installDate,
  messages,
}) => {
  const { setCurrentPage } = useContext(PageContext)
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false)

  useEffect(() => {
    const checkUpgradeModal = async () => {
      if (isPremium) return
      chrome.storage.local.get(
        ['upgradeModalClicked', 'upgradeModalLastShown'],
        (result) => {
          const now = Date.now()
          const installTime = installDate ? new Date(installDate).getTime() : 0
          const lastShown = result.upgradeModalLastShown || 0

          if (!result.upgradeModalClicked) {
            if (installDate && now - installTime < 60 * 60 * 1000) {
              return
            }
            if (!installDate || now - installTime >= 60 * 60 * 1000) {
              setIsUpgradeModalOpen(true)
              chrome.storage.local.set({
                upgradeModalClicked: true,
                upgradeModalLastShown: now,
              })
              return
            }
          }

          if (
            result.upgradeModalClicked &&
            now - lastShown > 48 * 60 * 60 * 1000
          ) {
            setIsUpgradeModalOpen(true)
            chrome.storage.local.set({ upgradeModalLastShown: now })
          }
        }
      )
    }

    if (!isFirefox) {
      checkUpgradeModal()
    }
  }, [installDate, isPremium])

  return (
    <>
      <UpgradeModal
        messages={messages}
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />
      <Flex
        sx={{
          flexDirection: 'column',
          color: 'black',
          overflow: 'hidden',
        }}
      >
        <PageHeader
          left={
            <Link
              href={websiteUrl}
              target="_blank"
              sx={{
                all: 'unset',
                cursor: 'pointer',
                height: '28px',
                display: 'block',
              }}
            >
              <Box
                as={Logo}
                sx={{
                  height: '28px',
                  width: 'auto',
                }}
              />
            </Link>
          }
          rightIcon={MenuIcon}
          onRightClick={() => setCurrentPage('options')}
        />
        <Flex
          sx={{
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            pt: '60px',
            pb: '48px',
          }}
        >
          <Flex
            sx={{
              height: '90px',
              width: '175px',
              justifyContent: 'center',
            }}
          >
            <Button
              id="proxyToggle"
              onClick={() => handleConnectionToggle()}
              title={isConnected ? messages.connected : messages.disconnected}
              sx={{
                appearance: 'none',
                cursor: 'pointer',
                p: '8px 10px',
                height: '100%',
                width: '100%',
                borderRadius: '70px',
                backgroundColor: isConnected ? 'blue' : 'toggleGrey',
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <Box
                sx={{
                  height: '70px',
                  width: '70px',
                  backgroundColor: '#fff',
                  borderRadius: '100%',
                  transform: `translateX(${isConnected ? '85px' : '0px'})`,
                  transition: 'all 0.2s ease-in-out',
                }}
              />
            </Button>
          </Flex>
          <Box
            sx={{
              mt: '16px',
              fontSize: '18px',
            }}
          >
            {isConnected ? messages.connected : messages.disconnected}
          </Box>
        </Flex>
        <Flex
          sx={{
            flexDirection: 'column',
            px: '22px',
            pb: '24px',
          }}
        >
          <Button
            id="locationsPageButton"
            onClick={() => setCurrentPage('locations')}
            title={messages.goToLocationsPage}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              p: '16px 18px',
              width: '100%',
              borderRadius: '8px',
              fontSize: '16px',
              color: 'black',
              backgroundColor: 'white',
              border: '1px solid',
              borderColor: 'darkBorderGrey',
              transition: 'all 0.2s ease-in-out',
              ':hover': {
                backgroundColor: 'borderGrey50',
              },
            }}
          >
            <Box
              as={flags[currentLocation.countryCode]}
              sx={{
                height: '30px',
                width: '30px',
                borderRadius: '6px',
                backgroundColor: 'toggleGrey',
              }}
            />
            <Flex
              sx={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                flex: 1,
                ml: '18px',
              }}
            >
              <Text sx={{ fontSize: '14px', fontWeight: 400 }}>
                {/* {messages[currentLocation.countryCode]} */}
                New York
              </Text>
              <Text sx={{ fontSize: '13px', color: 'grey', fontWeight: 300 }}>
                {/* {currentLocation.countryCode} */}
                United States
              </Text>
            </Flex>
            <Box as={ChevronRight} />
          </Button>

          {!isPremium && (
            <>
              <Link
                id="upgradeLink"
                href={`${websiteUrl}/select_plan`}
                target="_blank"
                title="Upgrade to Premium"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  p: '16px 18px',
                  width: '100%',
                  borderRadius: '8px',
                  fontSize: '16px',
                  color: 'white',
                  backgroundColor: 'blue',
                  transition: 'all 0.2s ease-in-out',
                  mt: '16px',
                  textDecoration: 'none',
                  ':hover': {
                    backgroundColor: 'darkBlue',
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '34px',
                    width: '34px',
                    borderRadius: '6px',
                    backgroundColor: 'white20',
                    overflow: 'visible',
                  }}
                >
                  <Box
                    as={Star}
                    sx={{
                      height: '18px',
                      width: '18px',
                      overflow: 'visible',
                    }}
                  />
                </Box>
                <Flex
                  sx={{
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    flex: 1,
                    ml: '18px',
                  }}
                >
                  <Text sx={{ fontSize: '14px', fontWeight: 400 }}>
                    Upgrade to Premium
                  </Text>
                  <Text sx={{ fontSize: '13px', fontWeight: 300 }}>
                    More locations & faster speeds
                  </Text>
                </Flex>
                <Box
                  as={ChevronRight}
                  sx={{
                    color: 'white',
                  }}
                />
              </Link>
            </>
          )}

          {/* {!isPremium && (
            <>
              {chrome.i18n.getUILanguage().startsWith('ru') ? (
                <Text
                  sx={{
                    fontSize: '12px',
                    textAlign: 'center',
                    mt: '24px',
                  }}
                >
                  Серверы могут блокироваться в России из-за ограничений со
                  стороны правительства. Мы работаем над их обходом. Спасибо.
                </Text>
              ) : (
                <Link
                  id="upgradeLink"
                  href={`${websiteUrl}/select_plan`}
                  target="_blank"
                  sx={{
                    all: 'unset',
                    cursor: 'pointer',
                    fontSize: '12px',
                    textAlign: 'center',
                    mt: '24px',
                    ':hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  <Text
                    sx={{
                      color: 'darkBlue',
                      textDecoration: 'underline',
                    }}
                  >
                    {messages.upgradeText1}
                  </Text>{' '}
                  {messages.upgradeText2}
                </Link>
              )}
            </>
          )} */}
        </Flex>
      </Flex>
    </>
  )
}

export default MainPage

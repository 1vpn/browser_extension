import { useState, useContext } from 'react'
import { Flex, Link, Button, Box, Text } from 'theme-ui'
import { isFirefox, websiteUrl } from 'utils/constants'
import { PageContext } from 'context/PageContext'
import PageHeader from './PageHeader'
import Toggle from './Toggle'
import AndroidModal from './AndroidModal'
import ChevronRight from 'assets/chevronRight.svg'

const OptionsPage = ({
  sessionAuthToken,
  isPremium,
  spoofGeolocation,
  setSpoofGeolocation,
  disableWebRtc,
  setDisableWebRtc,
  messages,
}) => {
  const { goBackPage } = useContext(PageContext)
  const [isAndroidModalOpen, setIsAndroidModalOpen] = useState(false)

  const handleSpoofGeolocationToggle = () => {
    chrome.storage.local.set({
      spoofGeolocation: !spoofGeolocation,
    })

    setSpoofGeolocation(!spoofGeolocation)
  }

  const handleDisableWebRtcToggle = () => {
    const disableWebRtcValue = isFirefox
      ? 'proxy_only'
      : 'disable_non_proxied_udp'

    chrome.privacy.network.webRTCIPHandlingPolicy.set({
      value: disableWebRtc ? 'default' : disableWebRtcValue,
    })

    chrome.storage.local.set({
      disableWebRtc: !disableWebRtc,
    })

    setDisableWebRtc(!disableWebRtc)
  }

  return (
    <>
      <PageHeader
        left={<Text sx={{ fontSize: '20px' }}>{messages.options}</Text>}
        rightIcon={ChevronRight}
        onRightClick={goBackPage}
      />
      <Flex
        sx={{
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between',
        }}
      >
        {/* <AndroidModal
        messages={messages}
        isOpen={isAndroidModalOpen}
        onClose={() => setIsAndroidModalOpen(false)}
        /> */}
        {!(sessionAuthToken && isPremium) && (
          <Flex
            sx={{
              gap: '16px',
              p: '22px',
              borderBottom: '1px solid',
              borderColor: 'borderGrey',
            }}
          >
            {sessionAuthToken && !isPremium ? (
              <Link
                href={`${websiteUrl}/select_plan`}
                target="_blank"
                variant="styles.baseButton"
              >
                {messages.upgrade}
              </Link>
            ) : (
              <>
                <Link
                  id="upgradeButton"
                  href={`${websiteUrl}/select_plan`}
                  target="_blank"
                  variant="styles.baseButton"
                >
                  {messages.upgrade}
                </Link>
                <Link
                  id="loginButton"
                  href={`${websiteUrl}/login`}
                  target="_blank"
                  variant="styles.baseButton"
                  sx={{
                    bg: 'white',
                    color: 'black',
                    border: '1px solid',
                    borderColor: 'darkBorderGrey',
                    ':hover': {
                      bg: 'borderGrey50',
                    },
                  }}
                >
                  {messages.login}
                </Link>
              </>
            )}
          </Flex>
        )}
        <Flex
          sx={{
            flexDirection: 'column',
            // gap: '20px',
            // pt: '20px',
          }}
        >
          <Toggle
            title={messages.spoofGeolocation}
            subTitle={messages.spoofGeolocationSubTitle}
            id="spoofGeolocationToggle"
            checked={spoofGeolocation}
            onToggle={() => handleSpoofGeolocationToggle()}
            showBorder
          />
          <Toggle
            title={messages.disableWebRtc}
            subTitle={messages.disableWebRtcSubTitle}
            id="disableWebRtcToggle"
            checked={disableWebRtc}
            onToggle={() => handleDisableWebRtcToggle()}
            showBorder
          />
          {/* <Button
            onClick={() => setIsAndroidModalOpen(true)}
            variant="styles.baseButton"
          >
            {messages.tryOurAndroidApp}
          </Button> */}
        </Flex>
      </Flex>
    </>
  )
}

export default OptionsPage

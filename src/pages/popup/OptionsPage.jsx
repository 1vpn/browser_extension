import { useContext } from 'react'
import { Flex, Link, Box, Text, Button } from 'theme-ui'
import { isFirefox } from 'utils/constants'
import logout from 'utils/logout'
import { PageContext } from 'context/PageContext'
import PageHeader from './PageHeader'
import Option from './Option'
import Arrow from 'assets/arrow.svg'

const OptionsPage = ({
  activeUrl,
  sessionAuthToken,
  isPremium,
  spoofGeolocation,
  setSpoofGeolocation,
  disableWebRtc,
  setDisableWebRtc,
  messages,
}) => {
  const { goBackPage, setCurrentPage } = useContext(PageContext)

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
        rightIcon={Arrow}
        onRightClick={goBackPage}
      />
      <Flex
        sx={{
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between',
        }}
      >
        {sessionAuthToken && isPremium ? (
          <Flex
            sx={{
              gap: '16px',
              p: '22px',
              borderBottom: '1px solid',
              borderColor: 'borderGrey',
            }}
          >
            <Link
              id="accountButton"
              href={`https://${activeUrl}/account`}
              target="_blank"
              variant="styles.baseButton"
            >
              {messages.account}
            </Link>
            <Button
              id="logoutButton"
              type="button"
              onClick={() => logout()}
              variant="styles.outlineButton"
            >
              {messages.logout}
            </Button>
          </Flex>
        ) : (
          <Flex
            sx={{
              gap: '16px',
              p: '22px',
              borderBottom: '1px solid',
              borderColor: 'borderGrey',
            }}
          >
            {isPremium ? (
              <Link
                id="accountButton"
                href={`https://${activeUrl}/account`}
                target="_blank"
                variant="styles.baseButton"
              >
                {messages.account}
              </Link>
            ) : (
              <Link
                id="upgradeButton"
                href={
                `https://${activeUrl}` +
                `/referral_redirect?from=options_page&url=${encodeURIComponent(`https://${activeUrl}/select_plan/`)}`
                }
                target="_blank"
                variant="styles.baseButton"
              >
                {messages.upgrade}
              </Link>
            )}
            {!sessionAuthToken ? (
              <Button
                id="loginButton"
                onClick={() => setCurrentPage('login')}
                variant="styles.outlineButton"
              >
                {messages.login}
              </Button>
            ) : (
              <Button
                id="logoutButton"
                type="button"
                onClick={() => logout()}
                variant="styles.outlineButton"
              >
                {messages.logout}
              </Button>
            )}
          </Flex>
        )}
        <Flex
          sx={{
            flexDirection: 'column',
          }}
        >
          <Option
            title={messages.spoofGeolocation}
            subTitle={messages.spoofGeolocationSubTitle}
            id="spoofGeolocationToggle"
            checked={spoofGeolocation}
            onToggle={() => handleSpoofGeolocationToggle()}
          />
          <Option
            title={messages.disableWebRtc}
            subTitle={messages.disableWebRtcSubTitle}
            id="disableWebRtcToggle"
            checked={disableWebRtc}
            onToggle={() => handleDisableWebRtcToggle()}
          />
          <Option
            title={messages.tryAndroidApp}
            subTitle={messages.getAndroidApp}
            id="tryAndroidApp"
            onClick={() => setCurrentPage('android')}
          />
          <Box
            sx={{
              p: '12px',
              textAlign: 'center',
            }}
          >
            <Text
              sx={{
                fontSize: '12px',
                color: 'grey',
                fontWeight: 300,
              }}
            >
              v{chrome.runtime.getManifest().version}
            </Text>
          </Box>
        </Flex>
      </Flex>
    </>
  )
}

export default OptionsPage

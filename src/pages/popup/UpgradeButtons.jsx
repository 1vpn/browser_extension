import { useContext } from 'react'
import { PageContext } from 'context/PageContext'
import { Flex, Button, Link } from 'theme-ui'
import { websiteUrl } from 'utils/constants'

const UpgradeButtons = ({
  primaryButtonText,
  from = 'upgrade_page',
  messages,
}) => {
  const { setCurrentPage } = useContext(PageContext)

  const handleUpgradeClick = () => {
    chrome.storage.local.set({
      upgradeButtonClicked: true,
      upgradePageType: null,
    })
  }

  const handleContinueFree = () => {
    chrome.storage.local.set({
      upgradeButtonClicked: true,
      upgradePageType: null,
    })
    setCurrentPage('main')
  }

  return (
    <Flex sx={{ flexDirection: 'column', gap: '16px' }}>
      <Link
        id="upgradeButton"
        href={
          websiteUrl +
          `/referral_redirect?from=${from}&url=https://1vpn.org/select_plan/`
        }
        target="_blank"
        variant="styles.baseButton"
        onClick={handleUpgradeClick}
      >
        {primaryButtonText}
      </Link>
      <Button
        onClick={handleContinueFree}
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
        {messages.continueFree}
      </Button>
    </Flex>
  )
}

export default UpgradeButtons

import { Text, Button, Box } from 'theme-ui'
import { websiteUrl } from 'utils/constants'
import Modal from './Modal'

const UpgradeModal = ({ messages, isOpen, onClose }) => {
  const handleClick = () => {
    onClose()
    window.open(
      websiteUrl +
        '/referral_redirect?from=special_offer&url=https://1vpn.org/select_plan/',
      '_blank'
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} width="250px">
      <Box
        sx={{
          fontSize: '20px',
          mb: '6px',
          textAlign: 'center',
        }}
      >
        {messages.specialOffer}
      </Box>
      <Box
        sx={{
          textAlign: 'center',
          fontSize: '13px',
          mb: '12px',
        }}
      >
        <Text sx={{ color: 'blue' }}>{messages.saveSixtyPercent}</Text>{' '}
        {messages.upgradeModalText}
      </Box>
      <Button
        onClick={handleClick}
        variant="styles.baseButton"
        sx={{
          height: '40px',
        }}
      >
        {messages.claimOffer}
      </Button>
      <Box
        sx={{
          textAlign: 'center',
          mt: '6px',
          fontSize: '11px',
          color: 'grey',
        }}
      >
        {`${messages.until} ${new Date(
          Date.now() + 5 * 24 * 60 * 60 * 1000
        ).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}`}
      </Box>
    </Modal>
  )
}

export default UpgradeModal

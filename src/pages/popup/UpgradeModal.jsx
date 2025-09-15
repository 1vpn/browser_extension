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
          mb: '12px',
          textAlign: 'center',
        }}
      >
        {messages.specialOffer}
      </Box>
      <Box
        as="ul"
        sx={{
          listStyle: 'none',
          p: 0,
          textAlign: 'left',
          fontSize: '13px',
          mb: '12px',
        }}
      >
        <Box
          as="li"
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: '14px',
          }}
        >
          <Box sx={{ color: 'green', fontWeight: 600, marginRight: '8px' }}>
            ✓
          </Box>
          <Text sx={{ color: 'blue', mr: '4px' }}>
            {messages.sixtyPercentOff}
          </Text>{' '}
          {messages.onAnnualPlan}
        </Box>
        <Box
          as="li"
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: '14px',
          }}
        >
          <Box sx={{ color: 'green', fontWeight: 600, marginRight: '8px' }}>
            ✓
          </Box>
          {messages.moreServerLocations}
        </Box>
        <Box
          as="li"
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: '12px',
          }}
        >
          <Box sx={{ color: 'green', fontWeight: 600, marginRight: '8px' }}>
            ✓
          </Box>
          {messages.fasterSpeeds}
        </Box>
        <Box as="li" sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ color: 'green', fontWeight: 600, marginRight: '8px' }}>
            ✓
          </Box>
          {messages.moneyBackGuarantee}
        </Box>
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
          color: 'textGrey',
        }}
      >
        {`${messages.until} ${new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
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

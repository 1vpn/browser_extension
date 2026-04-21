import { Button, Box } from 'theme-ui'
import Modal from './Modal'
import { reviewUrl } from 'utils/constants'

const ReviewModal = ({ messages, isOpen, onClose }) => {
  const handleReviewClick = () => {
    chrome.storage.local.set({ locationUnlocked: true }).then(() => {
      onClose()
      window.open(reviewUrl, '_blank')
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} width="300px">
      <Box
        sx={{
          width: '100%',
        }}
      >
        <Box
          sx={{
            mb: '12px',
            textAlign: 'center',
            fontSize: '16px',
            fontWeight: 400,
            color: 'black',
          }}
        >
          {messages.reviewToUnlock}
        </Box>
        <Box
          sx={{
            mb: '20px',
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: 300,
            color: 'grey',
          }}
        >
          {messages.leaveReviewToUnlock}
        </Box>
        <Button
          onClick={handleReviewClick}
          variant="styles.baseButton"
          sx={{ height: '40px' }}
        >
          {messages.reviewModalButton}
        </Button>
      </Box>
    </Modal>
  )
}

export default ReviewModal

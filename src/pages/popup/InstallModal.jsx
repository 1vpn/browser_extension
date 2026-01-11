import { Input, Button, Box } from 'theme-ui'
import Modal from './Modal'
import { useState } from 'react'
import { websiteUrl } from 'utils/constants'

const InstallModal = ({ messages, isOpen, onClose }) => {
  const installUrl = `${websiteUrl}?from=zv45k6`
  const [copied, setCopied] = useState(false)

  const handleModalClick = () => {
    chrome.storage.local.set({ installModalCopiedTime: Date.now() })
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(installUrl).then(() => {
      setCopied(true)
      handleModalClick()
      setTimeout(() => setCopied(false), 1200)
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} width="300px">
      <Box
        onClick={handleModalClick}
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
          {messages.referToUnlock}
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
          {messages.toUnlockThisLocation}
        </Box>
        <Input
          readOnly
          value={installUrl}
          sx={{
            width: '100%',
            mb: '20px',
            textAlign: 'center',
            fontSize: '14px',
            px: '8px',
            py: '10px',
            borderRadius: '8px',
            border: '1px solid',
            borderColor: 'lightGrey',
            color: 'black',
            backgroundColor: 'white',
            '&:focus': {
              outline: 'none',
            },
          }}
        />
        <Button
          onClick={handleCopy}
          variant="styles.baseButton"
          sx={{ height: '40px' }}
          disabled={copied}
        >
          {copied ? messages.linkCopied : messages.copyLink}
        </Button>
      </Box>
    </Modal>
  )
}

export default InstallModal

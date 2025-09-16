import { Input, Button, Box } from 'theme-ui'
import Modal from './Modal'
import { useState } from 'react'

const InstallModal = ({ messages, isOpen, onClose }) => {
  const installUrl = 'https://1vpn.org/?from=zv45k6'
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(installUrl).then(() => {
      setCopied(true)
      chrome.storage.local.set({ installModalCopiedTime: Date.now() })
      setTimeout(() => setCopied(false), 1200)
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} width="250px">
      <Box
        sx={{
          mb: '12px',
          textAlign: 'center',
        }}
      >
        {messages.installModalText}
      </Box>
      <Input
        readOnly
        value={installUrl}
        sx={{
          width: '100%',
          mb: '12px',
          textAlign: 'center',
          fontSize: '14px',
          px: '8px',
          py: '10px',
          borderRadius: '6px',
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
    </Modal>
  )
}

export default InstallModal

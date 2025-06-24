import { Button, Box } from 'theme-ui'
import { androidUrl } from 'utils/constants'
import Modal from './Modal'
import { QRCodeSVG } from 'qrcode.react'

const AndroidModal = ({ messages, isOpen, onClose }) => {
  const handleClick = () => {
    onClose()
    window.open(androidUrl, '_blank')
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} width="220px">
      <Box>Try Our Android App</Box>
      <Box
        sx={{
          fontSize: '12px',
          color: 'textGrey',
          mb: '8px',
        }}
      >
        Scan or click the QR code
      </Box>
      <Button
        onClick={handleClick}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          cursor: 'pointer',
          backgroundColor: 'transparent',
          padding: '0',
        }}
      >
        <QRCodeSVG
          value={androidUrl}
          width="108"
          height="108"
          bgColor="transparent"
          fgColor="#222"
          level="Q"
        />
      </Button>
    </Modal>
  )
}

export default AndroidModal

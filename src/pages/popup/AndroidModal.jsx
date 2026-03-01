import { Box, Button } from 'theme-ui'
import { QRCodeSVG } from 'qrcode.react'
import Modal from './Modal'
import { androidUrl } from 'utils/constants'

const AndroidModal = ({ messages, isOpen, onClose }) => (
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
          {messages.installAndroidToUnlock}
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
          {messages.scanOrClickQRCode}
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Button
            onClick={() => {
              window.open(androidUrl, '_blank')
              onClose()
            }}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              cursor: 'pointer',
              backgroundColor: 'transparent',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid',
              borderColor: 'borderGrey',
              transition: 'all 0.2s ease-in-out',
              ':hover': {
                backgroundColor: 'borderGrey50',
              },
            }}
          >
            <QRCodeSVG
              value={androidUrl}
              width="160"
              height="160"
              bgColor="transparent"
              fgColor="#000"
              level="Q"
            />
          </Button>
        </Box>
      </Box>
    </Modal>
)

export default AndroidModal

import { Box, Flex } from 'theme-ui'

const Modal = ({ isOpen, onClose, children, width }) => {
  if (!isOpen) return null

  return (
    <Flex
      onClick={onClose}
      sx={{
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        height: '100vh',
        width: '100vw',
        position: 'fixed',
        top: '0',
        left: '0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: '1000',
        cursor: 'pointer',
      }}
    >
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: width || '220px',
          background: 'white',
          borderRadius: '6px',
          p: '24px',
          textAlign: 'center',
          position: 'relative',
          cursor: 'default',
        }}
      >
        {children}
      </Box>
    </Flex>
  )
}

export default Modal

import { Button, Box, Flex, Image } from 'theme-ui'
import Modal from './Modal'
import { reviewUrl } from 'utils/constants'
import XIcon from 'assets/x.svg'
import FacebookIcon from 'assets/facebook.svg'
import LinkedInIcon from 'assets/linkedin.svg'
import VKIcon from 'assets/vk.svg'
import OKIcon from 'assets/ok.svg'
import TelegramIcon from 'assets/telegram.svg'

const UnlockModal = ({ messages, isOpen, onClose }) => {
  const showShareModal = Math.random() < 0.1

  const shareText = encodeURIComponent(messages.shareText)
  const shareUrl = encodeURIComponent('https://1vpn.org')

  const sharePlatforms = [
    {
      name: messages.x,
      url: `https://twitter.com/intent/tweet?text=${shareText}`,
      color: '#1DA1F2',
      icon: XIcon,
    },
    {
      name: messages.facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      color: '#1877F2',
      icon: FacebookIcon,
    },
    {
      name: messages.linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
      color: '#0077B5',
      icon: LinkedInIcon,
    },
    {
      name: messages.vk,
      url: `https://vk.com/share.php?url=${shareUrl}`,
      color: '#4C75A3',
      icon: VKIcon,
    },
    {
      name: messages.ok,
      url: `https://connect.ok.ru/dk?st.cmd=WidgetSharePreview&st.shareUrl=${shareUrl}`,
      color: '#FF6600',
      icon: OKIcon,
    },
    {
      name: messages.telegram,
      url: `https://t.me/share/url?url=${shareUrl}&text=${shareText}`,
      color: '#0088CC',
      icon: TelegramIcon,
    },
  ]

  const handleReviewClick = () => {
    chrome.storage.local.set({ unlocked: true }).then(() => {
      onClose()
      const trustpilotUrl = 'https://trustpilot.com/evaluate/1vpn.org'
      const openTrustpilot = Math.random() < 0.02
      window.open(openTrustpilot ? trustpilotUrl : reviewUrl, '_blank')
    })
  }

  const handleShare = (platform) => {
    chrome.storage.local.set({ unlocked: true }).then(() => {
      onClose()
      window.open(platform.url, '_blank')
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Box
        sx={{
          mb: '12px',
          textAlign: 'center',
        }}
      >
        {showShareModal ? messages.shareModalTitle : messages.reviewModalTitle}
      </Box>

      {showShareModal ? (
        <Flex
          sx={{
            gap: '12px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            maxWidth: '200px',
          }}
        >
          {sharePlatforms.map((platform) => (
            <Button
              key={platform.name}
              onClick={() => handleShare(platform)}
              sx={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: 'none',
                background: 'transparent',
                padding: 0,
                '&:hover': {
                  opacity: 0.8,
                },
              }}
              title={platform.name}
            >
              <Image
                src={platform.icon}
                sx={{
                  width: '40px',
                  height: '40px',
                }}
              />
            </Button>
          ))}
        </Flex>
      ) : (
        <Button
          onClick={handleReviewClick}
          variant="styles.baseButton"
          sx={{ height: '40px' }}
        >
          {messages.reviewModalButton}
        </Button>
      )}
    </Modal>
  )
}

export default UnlockModal

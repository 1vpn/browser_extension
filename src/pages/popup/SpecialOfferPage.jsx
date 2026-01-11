import { useState, useEffect } from 'react'
import { Box, Flex } from 'theme-ui'
import Star from 'assets/star.svg'
import UpgradeFeatures from './UpgradeFeatures'
import UpgradeButtons from './UpgradeButtons'

const SpecialOfferPage = ({ messages }) => {
  const [timeRemaining, setTimeRemaining] = useState(null)

  useEffect(() => {
    const expirationTime = Date.now() + 24 * 60 * 60 * 1000
    let interval

    const updateTimer = () => {
      const now = Date.now()
      const remaining = Math.max(0, expirationTime - now)

      if (remaining === 0) {
        setTimeRemaining(null)
        return
      }

      const hours = Math.floor(remaining / (1000 * 60 * 60))
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000)

      setTimeRemaining(
        `${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      )
    }

    updateTimer()
    interval = setInterval(updateTimer, 1000)

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [])

  return (
    <Flex
      sx={{
        flexDirection: 'column',
        flex: 1,
      }}
    >
      <Flex
        sx={{
          bg: 'blue',
          color: 'white',
          p: '36px',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '64px',
            width: '64px',
            borderRadius: '12px',
            backgroundColor: 'white20',
            mb: '24px',
          }}
        >
          <Box
            as={Star}
            sx={{
              height: '40px',
              width: '40px',
            }}
          />
        </Box>
        <Box
          sx={{
            fontSize: '24px',
            mb: '20px',
            fontWeight: 400,
            display: 'block',
            height: 'auto',
          }}
        >
          {messages.specialOffer}
        </Box>
        <Flex
          sx={{
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            fontWeight: 300,
            minHeight: '32px',
          }}
        >
          {timeRemaining && (
            <>
              <Box
                sx={{
                  px: '16px',
                  py: '6px',
                  borderRadius: '8px',
                  backgroundColor: 'white20',
                  fontSize: '15px',
                  fontWeight: 400,
                }}
              >
                {messages.saveSixtyPercent}
              </Box>
              <Box sx={{ fontSize: '14px' }}>{messages.until}</Box>
              <Box
                sx={{
                  px: '16px',
                  py: '6px',
                  borderRadius: '8px',
                  backgroundColor: 'white20',
                  fontSize: '15px',
                  fontWeight: 400,
                }}
              >
                {timeRemaining}
              </Box>
            </>
          )}
        </Flex>
      </Flex>
      <UpgradeFeatures messages={messages} />
      <Box sx={{ px: '24px', pb: '24px' }}>
        <UpgradeButtons
          primaryButtonText={messages.claimOffer}
          from="special_offer"
          messages={messages}
        />
      </Box>
    </Flex>
  )
}

export default SpecialOfferPage

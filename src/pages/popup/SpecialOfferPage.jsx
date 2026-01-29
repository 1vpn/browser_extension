import { useState, useEffect } from 'react'
import { Box, Flex } from 'theme-ui'
import Gift from 'assets/gift.svg'
import { checkAndManageSpecialOffer, formatTimeRemaining, getCurrentMonthDeal } from 'utils/specialOffer'
import UpgradeFeatures from './UpgradeFeatures'
import UpgradeButtons from './UpgradeButtons'

const SpecialOfferPage = ({ messages }) => {
  const [timeRemaining, setTimeRemaining] = useState(null)

  useEffect(() => {
    let interval

    const initializeTimer = () => {
      chrome.storage.local.get(['specialOfferExpirationTime'], (storage) => {
      const now = Date.now()
        
        const specialOffer = checkAndManageSpecialOffer(
          storage.specialOfferExpirationTime,
          now
        )

        if (specialOffer.expirationTime !== storage.specialOfferExpirationTime) {
          chrome.storage.local.set({
            specialOfferExpirationTime: specialOffer.expirationTime,
          })
        }

        const expirationTime = specialOffer.expirationTime

        const updateTimer = () => {
          const currentTime = Date.now()
          const remaining = Math.max(0, expirationTime - currentTime)

      if (remaining === 0) {
        setTimeRemaining(null)
        return
      }

          setTimeRemaining(formatTimeRemaining(remaining))
    }

    updateTimer()
    interval = setInterval(updateTimer, 1000)
      })
    }

    initializeTimer()

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
            as={Gift}
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
          {getCurrentMonthDeal(messages)}
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

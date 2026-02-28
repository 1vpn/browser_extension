import { useState, useEffect } from 'react'
import { Box, Flex, Text } from 'theme-ui'
import Star from 'assets/star.svg'
import { formatTimeRemaining } from 'utils/formatTime'
import { FORTY_EIGHT_HOURS } from 'utils/constants'
import UpgradeFeatures from './UpgradeFeatures'
import UpgradeButtons from './UpgradeButtons'

const UpgradePage = ({ messages, installDate = 0 }) => {
  const [tick, setTick] = useState(() => Date.now())

  const expirationTime = installDate
    ? installDate + FORTY_EIGHT_HOURS
    : 0
  const now = tick
  const showCountdown = expirationTime > 0 && now < expirationTime
  const timeRemaining = showCountdown
    ? formatTimeRemaining(Math.max(0, expirationTime - now))
    : null

  useEffect(() => {
    if (!showCountdown) return
    const intervalId = setInterval(() => setTick(Date.now()), 1000)
    return () => clearInterval(intervalId)
  }, [showCountdown])

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
        <Text sx={{ fontSize: '24px', mb: '20px', fontWeight: 400 }}>
          {messages.chooseYourPlan}
        </Text>
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
          {showCountdown
            ? `${messages.save33OnPremiumUntil} ${timeRemaining}`
            : messages.save33OnPremium}
        </Box>
      </Flex>
      <UpgradeFeatures messages={messages} />
      <Box sx={{ px: '24px', pb: '24px' }}>
        <UpgradeButtons
          primaryButtonText={messages.getPremium}
          messages={messages}
        />
      </Box>
    </Flex>
  )
}

export default UpgradePage

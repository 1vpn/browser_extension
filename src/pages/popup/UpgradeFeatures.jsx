import { Box, Flex } from 'theme-ui'
import Globe from 'assets/globe.svg'
import Lightning from 'assets/lightning.svg'
import Check from 'assets/check.svg'

const UpgradeFeatures = ({ messages }) => {
  const upgradeFeatures = [
    {
      title: messages.unlockAllServerLocations,
      subTitle: messages.accessServersWorldwide,
      icon: Globe,
    },
    {
      title: messages.fastestSpeeds,
      subTitle: messages.consistentAndFastInternetSpeeds,
      icon: Lightning,
    },
    {
      title: messages.tenDayMoneyBackGuarantee,
      subTitle: messages.fullRefundIfNotSatisfied,
      icon: Check,
    },
  ]

  return (
    <Flex
      sx={{
        flexDirection: 'column',
        p: '24px',
        gap: '24px',
      }}
    >
      {upgradeFeatures.map((feature, index) => (
        <Flex
          key={index}
          sx={{
            alignItems: 'flex-start',
            gap: '18px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '36px',
              width: '36px',
              borderRadius: '6px',
              backgroundColor: 'blue10',
              flexShrink: 0,
            }}
          >
            <Box
              as={feature.icon}
              sx={{
                height: '20px',
                width: '20px',
                color: 'blue',
              }}
            />
          </Box>
          <Flex
            sx={{
              flex: 1,
              flexDirection: 'column',
            }}
          >
            <Box sx={{ fontSize: '14px' }}>{feature.title}</Box>
            <Box
              sx={{
                fontSize: '13px',
                color: 'grey',
                fontWeight: 300,
              }}
            >
              {feature.subTitle}
            </Box>
          </Flex>
        </Flex>
      ))}
    </Flex>
  )
}

export default UpgradeFeatures

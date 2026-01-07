import { Box, Flex, Text } from 'theme-ui'
import Star from 'assets/star.svg'
import UpgradeFeatures from './UpgradeFeatures'
import UpgradeButtons from './UpgradeButtons'

const UpgradePage = ({ messages }) => {
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
        <Text sx={{ fontSize: '24px', mb: '12px' }}>Choose Your Plan</Text>
        <Text sx={{ fontWeight: 300 }}>Unlock all features with premium</Text>
      </Flex>
      <UpgradeFeatures />
      <Box sx={{ px: '24px', pb: '24px' }}>
        <UpgradeButtons />
      </Box>
    </Flex>
  )
}

export default UpgradePage

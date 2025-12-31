import { useContext } from 'react'
import { PageContext } from 'context/PageContext'
import { Box, Flex, Button, Link, Text } from 'theme-ui'
import { websiteUrl } from 'utils/constants'
import Star from 'assets/star.svg'
import Globe from 'assets/globe.svg'
import Lightning from 'assets/lightning.svg'
import Support from 'assets/support.svg'
import Check from 'assets/check.svg'

const UpgradePage = ({ messages }) => {
  const { setCurrentPage } = useContext(PageContext)

  const features = [
    {
      title: 'Unlock All Server Locations',
      subTitle: 'Access servers worldwide',
      icon: Globe,
    },
    {
      title: 'Fastest Speeds',
      subTitle: 'Optimized for streaming & browsing',
      icon: Lightning,
    },
    {
      title: '24/7 Customer Support',
      subTitle: 'Get help whenever you need it',
      icon: Support,
    },
    {
      title: '10-Day Money-Back Guarantee',
      subTitle: 'Risk-free trial period',
      icon: Check,
    },
  ]

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
      <Flex
        sx={{
          flexDirection: 'column',
          p: '24px',
          gap: '21px',
        }}
      >
        {features.map((feature, index) => (
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
              <Text sx={{ fontSize: '14px' }}>{feature.title}</Text>
              <Text
                sx={{
                  fontSize: '13px',
                  color: 'grey',
                  fontWeight: 300,
                }}
              >
                {feature.subTitle}
              </Text>
            </Flex>
          </Flex>
        ))}
        <Flex sx={{ flexDirection: 'column', gap: '12px' }}>
          <Link
            id="upgradeButton"
            href={
              websiteUrl +
              '/referral_redirect?from=upgrade_page&url=https://1vpn.org/select_plan/'
            }
            target="_blank"
            variant="styles.baseButton"
          >
            Get Premium
          </Link>
          <Button
            onClick={() => setCurrentPage('main')}
            variant="styles.baseButton"
            sx={{
              bg: 'white',
              color: 'black',
              border: '1px solid',
              borderColor: 'darkBorderGrey',
              ':hover': {
                bg: 'borderGrey50',
              },
            }}
          >
            Continue Free
          </Button>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default UpgradePage

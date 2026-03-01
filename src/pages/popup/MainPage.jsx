import { useContext } from 'react'
import { PageContext } from 'context/PageContext'
import { Box, Flex, Button, Link, Text } from 'theme-ui'
import { websiteUrl } from 'utils/constants'
import flags from 'utils/flags'
import Logo from 'assets/logo.svg'
import MenuIcon from 'assets/menu.svg'
import Star from 'assets/star.svg'
import ChevronRight from 'assets/chevronRight.svg'
import PageHeader from './PageHeader'

const MainPage = ({
  isPremium,
  isConnected,
  currentCityCode,
  locations,
  handleConnectionToggle,
  messages,
  isSpecialOfferActive,
  timeRemaining,
}) => {
  const { setCurrentPage } = useContext(PageContext)

  return (
    <Flex
      sx={{
        flexDirection: 'column',
        color: 'black',
        overflow: 'hidden',
      }}
    >
      <PageHeader
        left={
          <Link
            href={websiteUrl}
            target="_blank"
            sx={{
              all: 'unset',
              cursor: 'pointer',
              height: '28px',
              display: 'block',
            }}
          >
            <Box
              as={Logo}
              sx={{
                height: '28px',
                width: 'auto',
              }}
            />
          </Link>
        }
        rightIcon={MenuIcon}
        onRightClick={() => setCurrentPage('options')}
      />
      <Flex
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          pt: '60px',
          pb: '48px',
        }}
      >
        <Flex
          sx={{
            height: '90px',
            width: '175px',
            justifyContent: 'center',
          }}
        >
          <Button
            id="proxyToggle"
            onClick={() => handleConnectionToggle()}
            title={isConnected ? messages.connected : messages.disconnected}
            sx={{
              appearance: 'none',
              cursor: 'pointer',
              p: '8px 10px',
              height: '100%',
              width: '100%',
              borderRadius: '70px',
              backgroundColor: isConnected ? 'blue' : 'toggleGrey',
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <Box
              sx={{
                height: '70px',
                width: '70px',
                backgroundColor: '#fff',
                borderRadius: '100%',
                transform: `translateX(${isConnected ? '85px' : '0px'})`,
                transition: 'all 0.2s ease-in-out',
              }}
            />
          </Button>
        </Flex>
        <Box
          sx={{
            mt: '16px',
            fontSize: '18px',
          }}
        >
          {isConnected ? messages.connected : messages.disconnected}
        </Box>
      </Flex>
      <Flex
        sx={{
          flexDirection: 'column',
          px: '22px',
          pb: '24px',
        }}
      >
        <Button
          id="locationsPageButton"
          onClick={() => setCurrentPage('locations')}
          title={messages.goToLocationsPage}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            p: '16px 18px',
            width: '100%',
            borderRadius: '8px',
            fontSize: '16px',
            color: 'black',
            backgroundColor: 'white',
            border: '1px solid',
            borderColor: 'darkBorderGrey',
            transition: 'all 0.2s ease-in-out',
            ':hover': {
              backgroundColor: 'borderGrey50',
            },
          }}
        >
          {currentCityCode && locations[currentCityCode] && (
            <>
              <Box
                as={flags[currentCityCode]}
                sx={{
                  height: '30px',
                  width: '30px',
                  borderRadius: '6px',
                  backgroundColor: 'toggleGrey',
                }}
              />
              <Flex
                sx={{
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  flex: 1,
                  ml: '18px',
                }}
              >
                <Text sx={{ fontSize: '14px', fontWeight: 400 }}>
                  {messages[locations[currentCityCode].cityCode]}
                </Text>
                <Text sx={{ fontSize: '13px', color: 'grey', fontWeight: 300 }}>
                  {messages[locations[currentCityCode].countryCode]}
                </Text>
              </Flex>
            </>
          )}
          <Box
            as={ChevronRight}
            sx={{
              color: 'grey',
              height: '24px',
              width: '24px',
            }}
          />
        </Button>

        {!isPremium && (
          <>
            <Button
              id="upgradeLink"
              onClick={() => setCurrentPage('upgrade')}
              title={messages.upgradeToPremium}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                p: '16px 18px',
                width: '100%',
                borderRadius: '8px',
                fontSize: '16px',
                color: 'white',
                backgroundColor: 'blue',
                transition: 'all 0.2s ease-in-out',
                mt: '16px',
                textDecoration: 'none',
                ':hover': {
                  backgroundColor: 'darkBlue',
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '32px',
                  width: '32px',
                  borderRadius: '6px',
                  backgroundColor: 'white20',
                  overflow: 'visible',
                }}
              >
                <Box
                  as={Star}
                  sx={{
                    overflow: 'visible',
                    height: '18px',
                    width: '18px',
                  }}
                />
              </Box>
              <Flex
                sx={{
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  flex: 1,
                  ml: '18px',
                }}
              >
                <Text sx={{ fontSize: '14px', fontWeight: 400 }}>
                  {messages.upgradeToPremium}
                </Text>
                <Text sx={{ fontSize: '13px', fontWeight: 300 }}>
                  {isSpecialOfferActive && timeRemaining
                    ? `${messages.save33Percent} ${messages.until} ${timeRemaining}`
                    : messages.save33OnPremium}
                </Text>
              </Flex>
              <Box
                as={ChevronRight}
                sx={{
                  color: 'white',
                }}
              />
            </Button>
          </>
        )}

        {chrome.i18n.getUILanguage().startsWith('ru') && !isPremium && (
          <Box
            sx={{
              fontSize: '12px',
              textAlign: 'center',
              mt: '16px',
              p: '16px 18px',
              borderRadius: '8px',
              backgroundColor: 'white',
              border: '1px solid',
              borderColor: 'darkBorderGrey',
              color: 'grey',
              fontWeight: 300,
            }}
          >
            Серверы могут блокироваться в России из-за ограничений со стороны
            правительства. Мы работаем над их обходом. Спасибо.
          </Box>
        )}
      </Flex>
    </Flex>
  )
}

export default MainPage

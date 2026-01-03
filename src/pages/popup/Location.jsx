import { Flex, Box } from 'theme-ui'
import ChevronRight from 'assets/chevronRight.svg'
import Check from 'assets/check.svg'
import Star from 'assets/star.svg'
import { websiteUrl } from 'utils/constants'

const Location = ({
  title,
  subTitle,
  id,
  checked,
  link,
  icon,
  isPremium,
  location,
  handleLocationToggle,
  installDate,
  setIsReviewModalOpen,
  setIsInstallModalOpen,
  messages,
}) => {
  const handleClick = async () => {
    if (link) {
      window.open(link, '_blank')
      return
    }

    if (!location) return

    if (location.isPremium) {
      chrome.tabs.create({
        url: `${websiteUrl}/select_plan`,
      })
    } else if (location.ratingLocked) {
      chrome.storage.local.get(
        ['locationUnlocked', 'installModalCopiedTime'],
        (result) => {
          if (result.locationUnlocked === true) {
            handleLocationToggle(location)
          } else {
            const now = Date.now()
            const installModalCopiedTime = result.installModalCopiedTime || 0
            if (
              installModalCopiedTime &&
              now - installModalCopiedTime > 2 * 60 * 1000
            ) {
              handleLocationToggle(location)
              return
            }
            const installTime = installDate
              ? new Date(installDate).getTime()
              : 0
            if (installDate && now - installTime > 72 * 60 * 60 * 1000) {
              setIsReviewModalOpen(true)
              return
            }
            setIsInstallModalOpen(true)
          }
        }
      )
    } else {
      handleLocationToggle(location)
    }
  }

  return (
    <Flex
      id={id}
      onClick={handleClick}
      sx={{
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer',
        p: '16px 22px',
        gap: '48px',
        borderBottom: '1px solid',
        borderColor: 'borderGrey',
        transition: 'all 0.2s ease-in-out',
        ':hover': {
          bg: 'borderGrey50',
        },
        ':last-child': {
          borderBottom: 'none',
        },
      }}
    >
      <Flex
        sx={{
          alignItems: 'center',
          gap: '18px',
          flex: 1,
        }}
      >
        {icon && (
          <Box
            as={icon}
            sx={{
              height: '30px',
              width: '30px',
              borderRadius: '6px',
              backgroundColor: 'toggleGrey',
              flexShrink: 0,
            }}
          />
        )}
        <Box
          title={title}
          sx={{
            flex: 1,
          }}
        >
          <Box sx={{ fontSize: '14px' }}>{title}</Box>
          <Box
            sx={{
              fontSize: '13px',
              color: 'grey',
              fontWeight: 300,
            }}
          >
            {subTitle}
          </Box>
        </Box>
      </Flex>
      {checked ? (
        <Box
          as={Check}
          sx={{
            height: '24px',
            width: '24px',
            color: 'green',
          }}
        />
      ) : isPremium ? (
        <Box
          as={Star}
          sx={{
            height: '20px',
            width: '20px',
            color: 'yellow',
            fill: 'yellow',
          }}
        />
      ) : (
        <Box
          as={ChevronRight}
          sx={{
            height: '24px',
            width: '24px',
            color: 'grey',
          }}
        />
      )}
    </Flex>
  )
}

export default Location

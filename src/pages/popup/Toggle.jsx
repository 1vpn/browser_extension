import { Flex, Box, Image, Button } from 'theme-ui'
import Star from 'assets/star.svg'

const Toggle = ({
  title,
  subTitle,
  id,
  checked,
  onToggle,
  icon,
  hideToggle,
  showBorder,
  messages,
}) => {
  return (
    <Flex
      sx={{
        flexDirection: 'column',
        p: '22px',
        gap: '8px',
        ...(showBorder && {
          borderBottom: '1px solid',
          borderColor: 'borderGrey',
        }),
      }}
    >
      <Flex
        id={id}
        onClick={onToggle}
        title={hideToggle ? messages.upgradeLocation : title}
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          cursor: 'pointer',
          gap: '8px',
        }}
      >
        <Flex
          sx={{
            alignItems: 'center',
            gap: '24px',
          }}
        >
          {icon ? (
            <Image
              src={icon}
              sx={{
                height: '20px',
                width: '20px',
                borderRadius: '6px',
                borderColor: 'grey',
              }}
            />
          ) : null}
          <Box>{title}</Box>
        </Flex>
        {hideToggle ? (
          <Image
            src={Star}
            sx={{
              height: '18px',
            }}
          />
        ) : (
          <Flex
            sx={{ height: '20px', minWidth: '36px', justifyContent: 'center' }}
          >
            <Button
              sx={{
                appearance: 'none',
                cursor: 'pointer',
                p: '2px',
                height: '100%',
                width: '100%',
                borderRadius: '68px',
                backgroundColor: checked ? 'blue' : 'darkGrey',
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <Box
                sx={{
                  height: '16px',
                  width: '16px',
                  backgroundColor: '#fff',
                  borderRadius: '50%',
                  transform: `translateX(${checked ? '100%' : '0%'})`,
                  transition: 'all 0.2s ease-in-out',
                }}
              />
            </Button>
          </Flex>
        )}
      </Flex>
      {subTitle && (
        <Box
          sx={{
            fontSize: '12px',
            color: 'textGrey',
            mr: '48px',
            maxWidth: '228px',
          }}
        >
          {subTitle}
        </Box>
      )}
    </Flex>
  )
}

export default Toggle

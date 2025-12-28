import { Flex, Box, Button } from 'theme-ui'
import ChevronRight from 'assets/chevronRight.svg'

const Option = ({ title, subTitle, id, checked, onToggle, link, messages }) => {
  const handleClick = () => {
    if (link) {
      window.open(link, '_blank')
    } else if (onToggle) {
      onToggle()
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
        p: '22px',
        gap: '48px',
        borderBottom: '1px solid',
        borderColor: 'borderGrey',
        transition: 'all 0.2s ease-in-out',
        ':hover': {
          bg: 'borderGrey50',
        },
      }}
    >
      <Box
        title={title}
        sx={{
          flex: 1,
        }}
      >
        <Box sx={{ fontSize: '14px', mb: '4px' }}>{title}</Box>
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
      {link ? (
        <Box
          as={ChevronRight}
          sx={{
            height: '24px',
            width: '24px',
            color: 'grey',
          }}
        />
      ) : (
        <Flex
          sx={{ height: '20px', minWidth: '36px', justifyContent: 'center' }}
        >
          <Button
            sx={{
              appearance: 'none',
              p: '2px',
              height: '100%',
              width: '100%',
              borderRadius: '68px',
              cursor: 'pointer',
              backgroundColor: checked ? 'blue' : 'toggleGrey',
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <Box
              sx={{
                height: '16px',
                width: '16px',
                backgroundColor: 'white',
                borderRadius: '50%',
                transform: `translateX(${checked ? '100%' : '0%'})`,
                transition: 'all 0.2s ease-in-out',
              }}
            />
          </Button>
        </Flex>
      )}
    </Flex>
  )
}

export default Option

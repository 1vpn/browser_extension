import { useContext } from 'react'
import { PageContext } from 'context/PageContext'
import { Flex, Button, Text } from 'theme-ui'
import { androidUrl } from 'utils/constants'
import PageHeader from './PageHeader'
import Arrow from 'assets/arrow.svg'
import { QRCodeSVG } from 'qrcode.react'

const AndroidPage = ({ messages }) => {
  const { goBackPage } = useContext(PageContext)

  return (
    <Flex
      sx={{
        flexDirection: 'column',
        flex: 1,
      }}
    >
      <PageHeader
        left={<Text sx={{ fontSize: '20px' }}>Get Android App</Text>}
        rightIcon={Arrow}
        onRightClick={goBackPage}
      />
      <Flex
        sx={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          p: '24px',
          gap: '20px',
        }}
      >
        <Button
          onClick={() => {
            window.open(androidUrl, '_blank')
          }}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            cursor: 'pointer',
            backgroundColor: 'transparent',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid',
            borderColor: 'borderGrey',
            transition: 'all 0.2s ease-in-out',
            ':hover': {
              backgroundColor: 'borderGrey50',
            },
          }}
        >
          <QRCodeSVG
            value={androidUrl}
            width="180"
            height="180"
            bgColor="transparent"
            fgColor="#000"
            level="Q"
          />
        </Button>
        <Text
          sx={{
            fontSize: '15px',
            color: 'grey',
            textAlign: 'center',
            fontWeight: 300,
          }}
        >
          {messages.scanOrClickQRCode}
        </Text>
      </Flex>
    </Flex>
  )
}

export default AndroidPage

import { ThemeProvider } from 'theme-ui'
import { theme } from 'theme'
import { createRoot } from 'react-dom/client'
import { Flex, Box, Link } from 'theme-ui'
import { androidUrl, localeMessageKeys } from 'utils/constants'
import useLocalization from 'hooks/useLocalization'
import InstallVideo from 'assets/install.mp4'
import { QRCodeSVG } from 'qrcode.react'
import 'assets/index.css'

const App = () => {
  const messages = useLocalization(localeMessageKeys)

  return (
    <ThemeProvider theme={theme}>
      <Flex
        sx={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          maxWidth: '854px',
          mx: 'auto',
          py: '48px',
          gap: '48px',
        }}
      >
        <Flex
          sx={{
            gap: '24px',
            flexDirection: 'column',
            justifyContent: 'center',
            textAlign: 'center',
            backgroundColor: 'backgroundGrey',
            borderRadius: '12px',
            p: '32px',
          }}
        >
          <Box
            sx={{
              fontSize: '32px',
              color: 'black',
              lineHeight: '1.2',
            }}
          >
            {messages.installSuccess}
          </Box>
          <Box
            sx={{
              fontSize: '16px',
              color: 'textGrey',
              mb: '16px',
            }}
          >
            {messages.installInstructions}
          </Box>
          <video
            style={{
              borderRadius: '12px',
              width: '100%',
              aspectRatio: '16/9',
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
            loop
            autoPlay
          >
            <source src={InstallVideo} type="video/mp4" />
          </video>
        </Flex>

        <Flex
          sx={{
            gap: '32px',
            flexDirection: 'row',
            fontSize: '14px',
            width: '100%',
            mx: 'auto',
            backgroundColor: 'backgroundGrey',
            borderRadius: '12px',
            p: '32px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '12px',
              flex: 1,
              minWidth: 0,
            }}
          >
            <Box
              sx={{
                fontSize: '22px',
                color: 'black',
                mb: '4px',
              }}
            >
              {messages.tryOurAndroidApp}
            </Box>
            <Box
              sx={{
                fontSize: '15px',
                color: 'textGrey',
                mb: '8px',
              }}
            >
              {messages.scanQrCodeOrClickButton}
            </Box>
            <Link
              href={androidUrl}
              target="_blank"
              variant="styles.baseButton"
              sx={{
                width: '215px',
                fontSize: '16px',
                fontWeight: 500,
                mt: '8px',
              }}
            >
              {messages.downloadApp}
            </Link>
          </Box>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'white',
              borderRadius: '12px',
              p: '12px',
              flexShrink: 0,
            }}
          >
            <QRCodeSVG
              value={androidUrl}
              width="108"
              height="108"
              bgColor="#fff"
              fgColor="#222"
              level="Q"
            />
          </Box>
        </Flex>
      </Flex>
    </ThemeProvider>
  )
}

const container = document.getElementById('app-container')
const root = createRoot(container)
root.render(<App />)

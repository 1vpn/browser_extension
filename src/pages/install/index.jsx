import { ThemeProvider } from 'theme-ui'
import { theme } from 'theme'
import { createRoot } from 'react-dom/client'
import { Flex, Box } from 'theme-ui'
import { localeMessageKeys } from 'utils/constants'
import useLocalization from 'hooks/useLocalization'
import InstallVideo from 'assets/install.mp4'
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
          maxWidth: '1000px',
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
              color: 'grey',
              mb: '16px',
            }}
          >
            {messages.installInstructions}
          </Box>
          <Box
            sx={{
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'borderGrey',
            }}
          >
            <video
              style={{
                width: '100%',
                aspectRatio: '16/9',
                display: 'block',
              }}
              loop
              autoPlay
            >
              <source src={InstallVideo} type="video/mp4" />
            </video>
          </Box>
        </Flex>
      </Flex>
    </ThemeProvider>
  )
}

const container = document.getElementById('app-container')
const root = createRoot(container)
root.render(<App />)

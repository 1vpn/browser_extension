import { useState } from 'react'
import { Flex, Text, Input, Button, Link } from 'theme-ui'
import { useContext } from 'react'
import { PageContext } from 'context/PageContext'
import PageHeader from './PageHeader'
import Arrow from 'assets/arrow.svg'
import apiFetch from 'utils/apiFetch'
import { fetchLoginUserData } from 'utils/userData'
import { errorCodes } from 'utils/constants'

const textLinkSx = {
  fontSize: '14px',
  fontWeight: 300,
  color: 'black',
  textDecoration: 'none',
  cursor: 'pointer',
  transition: 'opacity 100ms linear',
  ':hover': {
    opacity: 0.75,
  },
}

const LoginPage = ({ activeUrl, messages }) => {
  const { goBackPage, setCurrentPage } = useContext(PageContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [token2fa, setToken2fa] = useState('')
  const [show2fa, setShow2fa] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const twoFaRequiredText = messages.loginTwoFaRequired || messages.twoFaToken

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password) {
      setError(
        messages.loginEnterEmailAndPassword || messages.loginInvalidCredentials
      )
      return
    }
    if (show2fa && !token2fa.trim()) {
      setError(twoFaRequiredText)
      return
    }
    setLoading(true)
    try {
      const body = { email: email.trim(), password }
      if (show2fa && token2fa.trim()) body.token = token2fa.trim()
      let response
      try {
        response = await apiFetch('login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      } catch {
        setError(messages.loginCouldNotReachServers)
        setLoading(false)
        return
      }
      const data = await response.json()

      if (!response.ok) {
        if (data.code === errorCodes.invalidToken) {
          setShow2fa(true)
          setError(data.error || messages.loginInvalidOrMissingTwoFaToken)
        } else {
          setError(data.error || messages.loginInvalidCredentials)
        }
        setLoading(false)
        return
      }

      const token = data.token ?? data.key ?? data.sessionAuthToken
      if (!token) {
        setError(messages.loginInvalidResponseFromServer)
        setLoading(false)
        return
      }
      await new Promise((r) =>
        chrome.storage.local.set({ sessionAuthToken: token }, r)
      )
      fetchLoginUserData(
        () => {
          setCurrentPage('main')
          setLoading(false)
        },
        () => {
          setError(messages.loginCouldNotLoadAccount)
          setLoading(false)
        }
      )
    } catch (err) {
      setError(err.message || messages.loginNetworkError)
      setLoading(false)
    }
  }

  return (
    <>
      <PageHeader
        left={<Text sx={{ fontSize: '20px' }}>{messages.login}</Text>}
        rightIcon={Arrow}
        onRightClick={goBackPage}
      />
      <Flex
        as="form"
        onSubmit={handleSubmit}
        sx={{
          flexDirection: 'column',
          flex: 1,
          p: '22px',
          gap: '22px',
        }}
      >
        <Input
          id="login-email"
          type="text"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            setShow2fa(false)
            setToken2fa('')
          }}
          placeholder={messages.email}
          variant="forms.input"
          autoFocus
        />
        <Input
          id="login-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={messages.password}
          variant="forms.input"
        />
        {show2fa && (
          <Input
            id="login-2fa"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            value={token2fa}
            onChange={(e) => setToken2fa(e.target.value)}
            placeholder={messages.twoFaToken || twoFaRequiredText}
            variant="forms.input"
          />
        )}
        {error && (
          <Text
            sx={{
              color: 'red',
              fontSize: '14px',
              fontWeight: 300,
              textAlign: 'center',
              width: '100%',
            }}
          >
            {error}
          </Text>
        )}
        <Button
          type="submit"
          variant="styles.baseButton"
          disabled={loading}
          sx={{ height: 48 }}
        >
          {loading ? messages.loading : messages.login}
        </Button>
        <Flex
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'nowrap',
            gap: '12px',
          }}
        >
          <Link
            href={`https://${activeUrl}/signup`}
            target="_blank"
            sx={{ ...textLinkSx, textAlign: 'left' }}
          >
            {messages.signUp}
          </Link>
          <Link
            href={`https://${activeUrl}/password_reset_request`}
            target="_blank"
            sx={{ ...textLinkSx, textAlign: 'right' }}
          >
            {messages.resetPassword}
          </Link>
        </Flex>
      </Flex>
    </>
  )
}

export default LoginPage

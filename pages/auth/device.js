import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { supabase } from '../../src/lib/supabase'

export default function DeviceAuth() {
  const router = useRouter()
  const { code } = router.query

  const [userCode, setUserCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [user, setUser] = useState(null)
  const [checkingAuth, setCheckingAuth] = useState(true)

  // Check if user is logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setCheckingAuth(false)
    }
    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Pre-fill code from URL
  useEffect(() => {
    if (code) {
      setUserCode(code)
    }
  }, [code])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!user) {
      // Redirect to login with return URL
      const returnUrl = `/auth/device?code=${encodeURIComponent(userCode)}`
      router.push(`/auth/login?returnTo=${encodeURIComponent(returnUrl)}`)
      return
    }

    try {
      // Get the current session to include auth token
      const { data: { session } } = await supabase.auth.getSession()

      if (!session?.access_token) {
        setError('Session expired. Please sign in again.')
        setLoading(false)
        return
      }

      const cleanCode = userCode.toUpperCase().replace(/[^A-Z0-9]/g, '')
      const formattedCode = cleanCode.length >= 8
        ? `${cleanCode.slice(0, 4)}-${cleanCode.slice(4, 8)}`
        : cleanCode

      const response = await fetch('/api/trpc/auth.authorizeDevice?batch=1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          "0": { json: { userCode: formattedCode } },
        }),
      })

      const result = await response.json()

      if (result[0]?.error) {
        setError(result[0].error.json?.message || result[0].error.message || 'Invalid or expired code')
      } else if (result[0]?.result?.data?.success) {
        setSuccess(true)
      } else {
        setError('Failed to authorize device')
      }
    } catch (err) {
      setError('Failed to authorize device. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const formatCode = (value) => {
    // Remove non-alphanumeric and format as XXXX-YYYY
    const clean = value.toUpperCase().replace(/[^A-Z0-9]/g, '')
    if (clean.length <= 4) return clean
    return `${clean.slice(0, 4)}-${clean.slice(4, 8)}`
  }

  if (checkingAuth) {
    return (
      <div className="auth-page">
        <Head>
          <title>Device Authorization - Glock</title>
        </Head>
        <div className="auth-container">
          <div className="auth-loading">Loading...</div>
        </div>
        <style jsx>{styles}</style>
      </div>
    )
  }

  if (success) {
    return (
      <div className="auth-page">
        <Head>
          <title>Device Authorized - Glock</title>
        </Head>
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-logo">
              <img src="/glock-logo.png" alt="Glock" className="logo-img" />
            </div>
            <div className="success-icon">✓</div>
            <h1 className="auth-title">Device Authorized</h1>
            <p className="auth-subtitle">
              You can now close this window and return to your terminal.
            </p>
          </div>
        </div>
        <style jsx>{styles}</style>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <Head>
        <title>Device Authorization - Glock</title>
      </Head>
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-logo">
            <img src="/glock-logo.png" alt="Glock" className="logo-img" />
          </div>
          <h1 className="auth-title">Authorize Device</h1>
          <p className="auth-subtitle">
            Enter the code displayed in your terminal to authorize the Glock CLI.
          </p>

          {!user && (
            <div className="auth-notice">
              You'll need to sign in to authorize this device.
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="code-input-wrapper">
              <input
                type="text"
                value={userCode}
                onChange={(e) => setUserCode(formatCode(e.target.value))}
                placeholder="XXXX-YYYY"
                maxLength={9}
                className="code-input"
                autoFocus
                autoComplete="off"
                spellCheck="false"
              />
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button
              type="submit"
              disabled={loading || userCode.replace(/-/g, '').length !== 8}
              className="auth-button"
            >
              {loading ? 'Authorizing...' : user ? 'Authorize Device' : 'Continue to Sign In'}
            </button>
          </form>

          {user && (
            <div className="auth-user">
              Signed in as <strong>{user.email}</strong>
              <button
                onClick={() => supabase.auth.signOut()}
                className="sign-out-link"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  )
}

const styles = `
  .auth-page {
    min-height: 100vh;
    background: #0a0a0a;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  .auth-container {
    width: 100%;
    max-width: 420px;
  }

  .auth-card {
    background: #111;
    border: 1px solid #222;
    border-radius: 12px;
    padding: 2.5rem;
    text-align: center;
  }

  .auth-logo {
    margin-bottom: 1.5rem;
  }

  .logo-img {
    height: 48px;
    width: 48px;
    border-radius: 8px;
  }

  .auth-title {
    font-family: 'Alte Haas Grotesk', -apple-system, sans-serif;
    font-size: 1.5rem;
    font-weight: 400;
    letter-spacing: -1px;
    color: #fff;
    margin: 0 0 0.5rem 0;
  }

  .auth-subtitle {
    font-size: 0.9375rem;
    color: #888;
    margin: 0 0 1.5rem 0;
    line-height: 1.5;
  }

  .auth-notice {
    background: rgba(212, 168, 83, 0.1);
    border: 1px solid rgba(212, 168, 83, 0.2);
    color: #d4a853;
    font-size: 0.8125rem;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
  }

  .auth-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .code-input-wrapper {
    position: relative;
  }

  .code-input {
    width: 100%;
    padding: 1rem;
    font-family: 'SF Mono', 'Monaco', monospace;
    font-size: 1.5rem;
    font-weight: 500;
    letter-spacing: 4px;
    text-align: center;
    text-transform: uppercase;
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 8px;
    color: #fff;
    outline: none;
    transition: border-color 0.2s;
  }

  .code-input::placeholder {
    color: #444;
    letter-spacing: 4px;
  }

  .code-input:focus {
    border-color: #555;
  }

  .auth-error {
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.2);
    color: #ef4444;
    font-size: 0.8125rem;
    padding: 0.75rem 1rem;
    border-radius: 8px;
  }

  .auth-button {
    width: 100%;
    padding: 0.875rem;
    font-family: inherit;
    font-size: 1rem;
    font-weight: 500;
    background: #fff;
    color: #0a0a0a;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s, transform 0.2s;
  }

  .auth-button:hover:not(:disabled) {
    background: #e0e0e0;
    transform: translateY(-1px);
  }

  .auth-button:disabled {
    background: #333;
    color: #666;
    cursor: not-allowed;
  }

  .auth-user {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid #222;
    font-size: 0.8125rem;
    color: #666;
  }

  .auth-user strong {
    color: #999;
  }

  .sign-out-link {
    display: block;
    margin-top: 0.5rem;
    background: none;
    border: none;
    color: #666;
    font-size: 0.75rem;
    cursor: pointer;
    text-decoration: underline;
  }

  .sign-out-link:hover {
    color: #999;
  }

  .success-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 1.5rem;
    background: rgba(34, 197, 94, 0.1);
    border: 2px solid #22c55e;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    color: #22c55e;
  }

  .auth-loading {
    text-align: center;
    color: #666;
    padding: 3rem;
  }
`

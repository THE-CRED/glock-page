import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { supabase } from '../../src/lib/supabase'

export default function Login() {
  const router = useRouter()
  const { returnTo } = router.query

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  // Check if already logged in (wait for router to be ready)
  useEffect(() => {
    if (!router.isReady) return

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        handleRedirect()
      }
    }
    checkSession()
  }, [router.isReady])

  const handleRedirect = () => {
    if (returnTo) {
      router.push(decodeURIComponent(returnTo))
    } else {
      router.push('/')
    }
  }

  const handleEmailAuth = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })
        if (error) throw error
        setMessage('Check your email for a confirmation link.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        handleRedirect()
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthLogin = async (provider) => {
    setError('')
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?returnTo=${encodeURIComponent(returnTo || '/')}`,
        },
      })
      if (error) throw error
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const handleMagicLink = async () => {
    if (!email) {
      setError('Please enter your email address')
      return
    }

    setError('')
    setMessage('')
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?returnTo=${encodeURIComponent(returnTo || '/')}`,
        },
      })
      if (error) throw error
      setMessage('Check your email for a magic link.')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <Head>
        <title>{isSignUp ? 'Sign Up' : 'Sign In'} - Glock</title>
      </Head>
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-logo">
            <img src="/glock-logo.png" alt="Glock" className="logo-img" />
          </div>
          <h1 className="auth-title">{isSignUp ? 'Create Account' : 'Welcome Back'}</h1>
          <p className="auth-subtitle">
            {isSignUp
              ? 'Sign up to authorize your CLI'
              : 'Sign in to authorize your CLI'}
          </p>

          {/* OAuth Buttons */}
          <div className="oauth-buttons">
            <button
              onClick={() => handleOAuthLogin('github')}
              disabled={loading}
              className="oauth-button github"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="oauth-icon">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Continue with GitHub
            </button>
            <button
              onClick={() => handleOAuthLogin('google')}
              disabled={loading}
              className="oauth-button google"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="oauth-icon">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </div>

          <div className="divider">
            <span>or</span>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailAuth} className="auth-form">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="auth-input"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="auth-input"
              required
              minLength={6}
            />

            {error && <div className="auth-error">{error}</div>}
            {message && <div className="auth-message">{message}</div>}

            <button
              type="submit"
              disabled={loading}
              className="auth-button"
            >
              {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
            </button>

            <button
              type="button"
              onClick={handleMagicLink}
              disabled={loading}
              className="magic-link-button"
            >
              Send Magic Link
            </button>
          </form>

          <div className="auth-footer">
            {isSignUp ? (
              <p>
                Already have an account?{' '}
                <button onClick={() => setIsSignUp(false)} className="toggle-link">
                  Sign In
                </button>
              </p>
            ) : (
              <p>
                Don't have an account?{' '}
                <button onClick={() => setIsSignUp(true)} className="toggle-link">
                  Sign Up
                </button>
              </p>
            )}
          </div>
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

  .oauth-buttons {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .oauth-button {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 0.75rem;
    font-family: inherit;
    font-size: 0.9375rem;
    font-weight: 500;
    background: #1a1a1a;
    color: #fff;
    border: 1px solid #333;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
  }

  .oauth-button:hover:not(:disabled) {
    background: #222;
    border-color: #444;
  }

  .oauth-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .oauth-icon {
    width: 20px;
    height: 20px;
  }

  .divider {
    display: flex;
    align-items: center;
    margin: 1.5rem 0;
  }

  .divider::before,
  .divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #333;
  }

  .divider span {
    padding: 0 1rem;
    font-size: 0.8125rem;
    color: #666;
  }

  .auth-form {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .auth-input {
    width: 100%;
    padding: 0.875rem 1rem;
    font-family: inherit;
    font-size: 0.9375rem;
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 8px;
    color: #fff;
    outline: none;
    transition: border-color 0.2s;
  }

  .auth-input::placeholder {
    color: #666;
  }

  .auth-input:focus {
    border-color: #555;
  }

  .auth-error {
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.2);
    color: #ef4444;
    font-size: 0.8125rem;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    text-align: left;
  }

  .auth-message {
    background: rgba(34, 197, 94, 0.1);
    border: 1px solid rgba(34, 197, 94, 0.2);
    color: #22c55e;
    font-size: 0.8125rem;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    text-align: left;
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
    margin-top: 0.5rem;
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

  .magic-link-button {
    width: 100%;
    padding: 0.75rem;
    font-family: inherit;
    font-size: 0.875rem;
    font-weight: 500;
    background: transparent;
    color: #888;
    border: 1px solid #333;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .magic-link-button:hover:not(:disabled) {
    border-color: #555;
    color: #fff;
  }

  .magic-link-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .auth-footer {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid #222;
    font-size: 0.875rem;
    color: #666;
  }

  .auth-footer p {
    margin: 0;
  }

  .toggle-link {
    background: none;
    border: none;
    color: #fff;
    font-weight: 500;
    cursor: pointer;
    text-decoration: underline;
    font-size: inherit;
  }

  .toggle-link:hover {
    color: #ccc;
  }
`

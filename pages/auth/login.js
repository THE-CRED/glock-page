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
      const decoded = decodeURIComponent(returnTo)
      // Validate: must be a relative path, no protocol injection
      if (decoded.startsWith('/') && !decoded.startsWith('//') && !decoded.includes(':')) {
        router.push(decoded)
        return
      }
    }
    router.push('/')
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
            emailRedirectTo: `${window.location.origin}/auth/callback?returnTo=${encodeURIComponent(returnTo || '/')}`,
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

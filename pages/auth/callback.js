import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { supabase } from '../../src/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()
  const [error, setError] = useState('')

  useEffect(() => {
    const handleCallback = async () => {
      const { returnTo } = router.query

      // Supabase handles the OAuth callback automatically via the hash
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()

      if (sessionError) {
        setError(sessionError.message)
        return
      }

      if (session) {
        // Redirect to the return URL or home
        const redirectTo = returnTo ? decodeURIComponent(returnTo) : '/'
        router.push(redirectTo)
      } else {
        // Wait for auth state change
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
          if (session) {
            const redirectTo = returnTo ? decodeURIComponent(returnTo) : '/'
            router.push(redirectTo)
            subscription.unsubscribe()
          }
        })

        // Timeout after 10 seconds
        setTimeout(() => {
          subscription.unsubscribe()
          setError('Authentication timed out. Please try again.')
        }, 10000)
      }
    }

    if (router.isReady) {
      handleCallback()
    }
  }, [router.isReady, router.query])

  if (error) {
    return (
      <div className="callback-page">
        <Head>
          <title>Authentication Error - Glock</title>
        </Head>
        <div className="callback-container">
          <div className="callback-card error">
            <div className="error-icon">!</div>
            <h1>Authentication Failed</h1>
            <p>{error}</p>
            <button onClick={() => router.push('/auth/login')} className="retry-button">
              Try Again
            </button>
          </div>
        </div>
        <style jsx>{styles}</style>
      </div>
    )
  }

  return (
    <div className="callback-page">
      <Head>
        <title>Authenticating... - Glock</title>
      </Head>
      <div className="callback-container">
        <div className="callback-card">
          <div className="spinner"></div>
          <h1>Authenticating...</h1>
          <p>Please wait while we complete your sign in.</p>
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  )
}

const styles = `
  .callback-page {
    min-height: 100vh;
    background: #0a0a0a;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  .callback-container {
    width: 100%;
    max-width: 420px;
  }

  .callback-card {
    background: #111;
    border: 1px solid #222;
    border-radius: 12px;
    padding: 3rem 2.5rem;
    text-align: center;
  }

  .callback-card h1 {
    font-family: 'Alte Haas Grotesk', -apple-system, sans-serif;
    font-size: 1.25rem;
    font-weight: 400;
    letter-spacing: -0.5px;
    color: #fff;
    margin: 1.5rem 0 0.5rem 0;
  }

  .callback-card p {
    font-size: 0.9375rem;
    color: #888;
    margin: 0;
  }

  .spinner {
    width: 40px;
    height: 40px;
    margin: 0 auto;
    border: 3px solid #333;
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .error-icon {
    width: 48px;
    height: 48px;
    margin: 0 auto;
    background: rgba(239, 68, 68, 0.1);
    border: 2px solid #ef4444;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: bold;
    color: #ef4444;
  }

  .callback-card.error h1 {
    color: #ef4444;
  }

  .retry-button {
    margin-top: 1.5rem;
    padding: 0.75rem 1.5rem;
    font-family: inherit;
    font-size: 0.9375rem;
    font-weight: 500;
    background: #fff;
    color: #0a0a0a;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .retry-button:hover {
    background: #e0e0e0;
  }
`

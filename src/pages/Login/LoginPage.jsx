/**
 * LoginPage — Inicio de sesión con Supabase Auth.
 * Email + password → signIn() → redirige al Dashboard.
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { InputField, Button } from '../../components/ui'
import { useAuth } from '../../context/AuthContext'
import orcaLogo from '/orca-logo.png'

export default function LoginPage() {
  const navigate = useNavigate()
  const { signIn } = useAuth()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }

    setLoading(true)
    setError('')

    const { error: authError } = await signIn(email, password)

    if (authError) {
      setError('Invalid email or password. Please try again.')
      setLoading(false)
      return
    }

    // AuthContext detecta el cambio de sesión y App.jsx redirige automáticamente
    navigate('/')
  }

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-neutral-950 px-6 pb-10">

      {/* Logo + Brand */}
      <div className="flex flex-col items-center mt-16 mb-8 gap-2">
        <img
          src={orcaLogo}
          alt="ORCA Logo"
          className="w-[100px] h-[100px] object-contain"
        />
        <h1 className="text-display font-bold text-neutral-50">ORCA</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleLogin} className="flex flex-col gap-6 w-full">
        <InputField
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError('') }}
        />
        <InputField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError('') }}
        />

        {/* Forgot Password */}
        <div className="flex justify-end -mt-2 px-2">
          <button
            type="button"
            className="text-caption font-medium text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer"
          >
            Forgot Password?
          </button>
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-destructive-400 text-center -mt-2">{error}</p>
        )}

        {/* Login Button */}
        <div className="flex justify-center">
          <Button
            type="submit"
            variant="primary"
            size="sm"
            className="min-w-[96px]"
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Login'}
          </Button>
        </div>

        {/* Sign Up */}
        <div className="flex flex-col items-center gap-4 mt-4">
          <p className="text-h2 font-semibold text-neutral-50">
            Don&apos;t Have an Account?
          </p>
          <Button
            type="button"
            variant="primary"
            size="sm"
            className="min-w-[108px]"
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </Button>
        </div>
      </form>
    </div>
  )
}

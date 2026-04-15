/**
 * SignUpPage — Registro de cuenta con Supabase Auth.
 * Valida passwords, llama signUp() y redirige al Dashboard.
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { InputField, Button } from '../../components/ui'
import { useAuth } from '../../context/AuthContext'
import orcaLogo from '../../assets/logo/orcalogo2.png'

export default function SignUpPage() {
  const navigate = useNavigate()
  const { signUp } = useAuth()

  const [form, setForm] = useState({
    fullName: '', email: '', password: '', confirmPassword: '',
  })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.fullName.trim() || !form.email || !form.password) {
      setError('All fields are required.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    setError('')

    const { error: authError } = await signUp(form.email, form.password)

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    // Supabase puede requerir confirmación por email dependiendo de la config.
    // Si está desactivada, la sesión se crea de inmediato y AuthContext redirige.
    navigate('/')
  }

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-neutral-950 px-6 pb-10">

      {/* Back arrow */}
      <div className="self-start mt-10">
        <button
          onClick={() => navigate(-1)}
          className="text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
          aria-label="Go back"
        >
          <svg width="21" height="14" viewBox="0 0 21 14" fill="none">
            <path d="M20 7H1M1 7L7 1M1 7L7 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Logo + Brand */}
      <div className="flex flex-col items-center mt-4 mb-6 gap-2">
        <img
          src={orcaLogo}
          alt="ORCA Logo"
          className="w-[100px] h-[100px] object-contain"
        />
        <h1 className="text-display font-bold text-neutral-50">ORCA</h1>
        <h2 className="text-h1 font-bold text-neutral-50">Join Orca</h2>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
        <InputField
          label="Full Name"
          value={form.fullName}
          onChange={handleChange('fullName')}
        />
        <InputField
          label="Email Address"
          type="email"
          value={form.email}
          onChange={handleChange('email')}
        />
        <InputField
          label="Password"
          type="password"
          value={form.password}
          onChange={handleChange('password')}
        />
        <InputField
          label="Confirm Password"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange('confirmPassword')}
        />

        {/* Error */}
        {error && (
          <p className="text-sm text-destructive-400 text-center -mt-2">{error}</p>
        )}

        <div className="flex justify-center mt-2">
          <Button
            type="submit"
            variant="primary"
            size="sm"
            className="min-w-[166px]"
            disabled={loading}
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </Button>
        </div>
      </form>
    </div>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { InputField, Button } from '../../components/ui'
import { supabase } from '../../lib/supabase'
import orcaLogo from '../../assets/logo/orcalogo2.png'

export default function ForgotPasswordPage() {
const navigate = useNavigate()
const [email, setEmail]     = useState('')
const [loading, setLoading] = useState(false)
const [sent, setSent]       = useState(false)
const [error, setError]     = useState('')

const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) { setError('Please enter your email.'); return }

    setLoading(true)
    setError('')

    const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
    })

    if (authError) {
    setError(authError.message)
    setLoading(false)
    return
    }

    setSent(true)
    setLoading(false)
}

return (
    <div className="flex flex-col items-center w-full min-h-screen bg-neutral-950 px-6 pb-10">

      {/* Back */}
    <div className="self-start mt-10">
        <button
        onClick={() => navigate(-1)}
        className="text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
        >
        <svg width="21" height="14" viewBox="0 0 21 14" fill="none">
            <path d="M20 7H1M1 7L7 1M1 7L7 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        </button>
    </div>

      {/* Logo */}
    <div className="flex flex-col items-center mt-4 mb-8 gap-2">
        <img src={orcaLogo} alt="ORCA Logo" className="w-[100px] h-[100px] object-contain" />
        <h1 className="text-display font-bold text-neutral-50">ORCA</h1>
    </div>

    {sent ? (
        <div className="flex flex-col items-center gap-4 text-center">
        <p className="text-h2 font-semibold text-neutral-50">Check your email</p>
        <p className="text-sm text-neutral-400">
            We sent a password reset link to <span className="text-neutral-200">{email}</span>.
        </p>
        <Button variant="primary" size="sm" onClick={() => navigate('/login')}>
            Back to Login
        </Button>
        </div>
    ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
        <div className="flex flex-col gap-2">
            <p className="text-h2 font-semibold text-neutral-50">Forgot Password?</p>
            <p className="text-sm text-neutral-400">
            Enter your email and we'll send you a reset link.
            </p>
        </div>

        <InputField
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError('') }}
        />

        {error && <p className="text-sm text-destructive-400 -mt-2">{error}</p>}

        <div className="flex justify-center">
            <Button type="submit" variant="primary" size="sm" className="min-w-[160px]" disabled={loading}>
            {loading ? 'Sending…' : 'Send Reset Link'}
            </Button>
        </div>
        </form>
    )}
    </div>
)
}
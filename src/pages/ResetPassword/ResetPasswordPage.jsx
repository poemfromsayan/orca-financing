import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { InputField, Button } from '../../components/ui'
import { supabase } from '../../lib/supabase'
import orcaLogo from '../../assets/logo/orcalogo2.png'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [password, setPassword]         = useState('')
  const [confirm, setConfirm]           = useState('')
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState('')
  const [ready, setReady]               = useState(false)

  // Supabase emite PASSWORD_RECOVERY cuando el usuario llega desde el link del email
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }

    setLoading(true)
    setError('')

    const { error: authError } = await supabase.auth.updateUser({ password })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    navigate('/')
  }

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-neutral-950 px-6 pb-10">

      <div className="flex flex-col items-center mt-16 mb-8 gap-2">
        <img src={orcaLogo} alt="ORCA Logo" className="w-[100px] h-[100px] object-contain" />
        <h1 className="text-display font-bold text-neutral-50">ORCA</h1>
      </div>

      {!ready ? (
        <p className="text-sm text-neutral-400 text-center">Verifying your reset link…</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
          <div className="flex flex-col gap-2">
            <p className="text-h2 font-semibold text-neutral-50">New Password</p>
            <p className="text-sm text-neutral-400">Enter your new password below.</p>
          </div>

          <InputField
            label="New Password"
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError('') }}
          />
          <InputField
            label="Confirm Password"
            type="password"
            value={confirm}
            onChange={(e) => { setConfirm(e.target.value); setError('') }}
          />

          {error && <p className="text-sm text-destructive-400 -mt-2">{error}</p>}

          <div className="flex justify-center">
            <Button type="submit" variant="primary" size="sm" className="min-w-[160px]" disabled={loading}>
              {loading ? 'Saving…' : 'Save Password'}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
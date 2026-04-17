/**
 * ProfilePage — Información del usuario y configuración de la app.
 *
 * Secciones:
 *   - Avatar editable (foto de perfil) + nombre editable
 *   - Stats: balance actual, total de transacciones, gastos e ingresos
 *   - Acceso a Monthly Budgets
 *   - Currency selector
 *   - Appearance toggle (dark/light mode)
 *   - Data Management: reset con confirmación inline
 *   - Logout
 */

import { useState, useRef } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import NavBar from '../../components/layout/NavBar'
import { useTransactions } from '../../context/TransactionContext'
import { useCurrency } from '../../context/CurrencyContext'

// ── Íconos ────────────────────────────────────────────────────────────────────

function EditIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6M14 11v6"/>
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
  )
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  )
}

function CameraIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  )
}

// ── Compresor de imagen ───────────────────────────────────────────────────────
const compressImage = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = ({ target: { result } }) => {
      const img = new Image()
      img.onerror = reject
      img.onload = () => {
        const SIZE   = 200
        const canvas = document.createElement('canvas')
        canvas.width  = SIZE
        canvas.height = SIZE
        const ctx = canvas.getContext('2d')
        const side = Math.min(img.width, img.height)
        const sx   = (img.width  - side) / 2
        const sy   = (img.height - side) / 2
        ctx.drawImage(img, sx, sy, side, side, 0, 0, SIZE, SIZE)
        resolve(canvas.toDataURL('image/jpeg', 0.75))
      }
      img.src = result
    }
    reader.readAsDataURL(file)
  })

// ── Fila de stat ──────────────────────────────────────────────────────────────
function StatRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-neutral-800 last:border-0">
      <p className="text-sm text-neutral-400">{label}</p>
      <p className="text-body font-medium text-neutral-50">{value}</p>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const navigate = useNavigate()
  const { balance, transactions, resetData } = useTransactions()
  const { isDark, toggleTheme } = useTheme()
  const { signOut } = useAuth()
  const { formatAmount, currency, currencies, changeCurrency } = useCurrency()

  // ── Foto de perfil ──────────────────────────────────────────────────────────
  const fileInputRef = useRef(null)
  const [photo, setPhoto]               = useState(() => localStorage.getItem('orca_user_photo') || null)
  const [photoLoading, setPhotoLoading] = useState(false)

  const handleAvatarClick = () => fileInputRef.current?.click()

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return
    setPhotoLoading(true)
    try {
      const compressed = await compressImage(file)
      setPhoto(compressed)
      localStorage.setItem('orca_user_photo', compressed)
    } catch {
      // Si falla la compresión, no hacemos nada
    } finally {
      setPhotoLoading(false)
      e.target.value = ''
    }
  }

  const removePhoto = () => {
    setPhoto(null)
    try { localStorage.removeItem('orca_user_photo') } catch {}
  }

  // ── Nombre editable ─────────────────────────────────────────────────────────
  const [name, setName]       = useState(() => localStorage.getItem('orca_user_name') || 'Your Name')
  const [editing, setEditing] = useState(false)
  const [draft, setDraft]     = useState(name)

  const initial = name.trim().charAt(0).toUpperCase() || 'U'

  const saveName = () => {
    const trimmed = draft.trim() || 'Your Name'
    setName(trimmed)
    setDraft(trimmed)
    setEditing(false)
    try { localStorage.setItem('orca_user_name', trimmed) } catch {}
  }

  // ── Reset ───────────────────────────────────────────────────────────────────
  const [confirmReset, setConfirmReset] = useState(false)

  const handleReset = () => {
    resetData()
    setConfirmReset(false)
  }

  // ── Stats ───────────────────────────────────────────────────────────────────
  const totalExpenses = transactions.filter((t) => t.type === 'expense').length
  const totalIncome   = transactions.filter((t) => t.type === 'income').length

  return (
    <div className="flex flex-col w-full max-w-[393px] min-h-screen bg-neutral-950 pb-[92px]">

      {/* Header */}
      <div className="flex items-center justify-center px-6 pt-10 pb-6">
        <h1 className="text-h1 font-bold text-white">Profile</h1>
      </div>

      {/* ── Avatar + nombre ── */}
      <div className="flex flex-col items-center gap-4 px-6 pb-8">
        <div className="relative group">
          <button
            onClick={handleAvatarClick}
            disabled={photoLoading}
            aria-label="Change profile photo"
            className="size-20 rounded-full overflow-hidden relative flex items-center justify-center cursor-pointer focus:outline-none"
          >
            {photo ? (
              <img src={photo} alt="Profile" className="size-full object-cover" />
            ) : (
              <div className="size-full bg-brand-500 flex items-center justify-center text-display font-bold text-white select-none">
                {photoLoading ? '…' : initial}
              </div>
            )}
            <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white">
              <CameraIcon />
            </div>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            aria-hidden="true"
          />
        </div>

        {photo && (
          <button
            onClick={removePhoto}
            className="text-caption text-neutral-600 hover:text-destructive-400 transition-colors cursor-pointer -mt-2"
          >
            Remove photo
          </button>
        )}

        {editing ? (
          <div className="flex items-center gap-2">
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && saveName()}
              className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2 text-body text-neutral-50 text-center outline-none focus:border-brand-500 transition-colors w-[180px]"
            />
            <button onClick={saveName} className="text-brand-500 hover:text-neutral-50 transition-colors cursor-pointer" aria-label="Save name">
              <CheckIcon />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <p className="text-h2 font-semibold text-neutral-50">{name}</p>
            <button
              onClick={() => { setEditing(true); setDraft(name) }}
              className="text-neutral-600 hover:text-neutral-300 transition-colors cursor-pointer"
              aria-label="Edit name"
            >
              <EditIcon />
            </button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="mx-6 mb-5 bg-neutral-900 border border-neutral-800 rounded-xl px-5 py-1">
        <StatRow label="Current Balance"    value={formatAmount(balance)} />
        <StatRow label="Total Transactions" value={String(transactions.length)} />
        <StatRow label="Expenses recorded"  value={String(totalExpenses)} />
        <StatRow label="Income recorded"    value={String(totalIncome)} />
      </div>

      {/* Currency selector */}
      <div className="mx-6 mb-5 bg-neutral-900 border border-neutral-800 rounded-xl px-5 py-4">
        <p className="text-sm font-medium text-neutral-400 mb-3">Currency</p>
        <div className="grid grid-cols-2 gap-2">
          {currencies.map((c) => (
            <button
              key={c.code}
              onClick={() => changeCurrency(c.code)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-colors cursor-pointer
                ${currency === c.code
                  ? 'bg-brand-500 border-brand-500 text-white'
                  : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-600'
                }`}
            >
              <span className="text-base">{c.symbol}</span>
              <span>{c.code}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Appearance toggle */}
      <div className="mx-6 mb-5 bg-neutral-900 border border-neutral-800 rounded-xl px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-neutral-400">
              {isDark ? <MoonIcon /> : <SunIcon />}
            </span>
            <div>
              <p className="text-body text-neutral-50 font-medium">Appearance</p>
              <p className="text-caption text-neutral-500 mt-0.5">
                {isDark ? 'Dark mode' : 'Light mode'}
              </p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none ${isDark ? 'bg-brand-500' : 'bg-neutral-300'}`}
          >
            <span className={`pointer-events-none inline-block size-5 rounded-full bg-white shadow transform transition-transform duration-300 ease-in-out ${isDark ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>

      {/* Budgets link */}
      <div className="mx-6 mb-5 bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
        <Link
          to="/budgets"
          className="flex items-center justify-between px-5 py-4 hover:bg-neutral-800/60 transition-colors"
        >
          <div>
            <p className="text-body text-neutral-50 font-medium">Monthly Budgets</p>
            <p className="text-caption text-neutral-500 mt-0.5">Set spending limits by category</p>
          </div>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 3L11 8L6 13" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>

      {/* Data Management */}
      <div className="mx-6 mb-5 bg-neutral-900 border border-neutral-800 rounded-xl px-5 py-4">
        <p className="text-sm text-neutral-400 mb-1">Data Management</p>
        <p className="text-caption text-neutral-600 leading-relaxed">
          Resets all transactions and restores the original balance. This action cannot be undone.
        </p>
        {!confirmReset ? (
          <button
            onClick={() => setConfirmReset(true)}
            className="mt-4 flex items-center gap-2 text-sm text-destructive-400 hover:text-destructive-300 transition-colors cursor-pointer"
          >
            <TrashIcon />
            Reset all data
          </button>
        ) : (
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-md text-sm font-medium bg-destructive-500 text-white hover:bg-destructive-400 transition-colors cursor-pointer"
            >
              Yes, reset
            </button>
            <button
              onClick={() => setConfirmReset(false)}
              className="px-4 py-2 rounded-md text-sm text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Logout */}
      <div className="mx-6">
        <button
          onClick={() => signOut()}
          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-6 py-4 text-body text-destructive-400 font-normal hover:bg-destructive-400/10 transition-colors cursor-pointer"
        >
          Logout
        </button>
      </div>

      {/* Version */}
      <p className="text-caption text-neutral-700 text-center mt-auto pt-6 pb-2">
        ORCA Financing · v1.0.0
      </p>

      <NavBar />
    </div>
  )
}
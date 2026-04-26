/**
 * App.jsx — Enrutador principal de ORCA Financing App.
 *
 * Rutas públicas  : /login, /signup
 * Rutas protegidas: todo lo demás — redirigen a /login si no hay sesión.
 *
 * ProtectedRoute: si loading=true muestra un spinner, si no hay user
 * redirige a /login, si hay user renderiza los children.
 *
 * AnimatePresence con mode="wait" garantiza que la animación de salida
 * termina antes de que empiece la de entrada.
 */

import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

import { useAuth } from './context/AuthContext'

import LoginPage          from './pages/Login/LoginPage'
import SignUpPage         from './pages/SignUp/SignUpPage'
import DashboardPage      from './pages/Dashboard/DashboardPage'
import TransactionsPage   from './pages/Transactions/TransactionsPage'
import AddTransactionPage from './pages/AddTransaction/AddTransactionPage'
import ProfilePage        from './pages/Profile/ProfilePage'
import BudgetsPage        from './pages/Budgets/BudgetsPage'
import ForgotPasswordPage from './pages/ForgotPassword/ForgotPasswordPage'
import ResetPasswordPage  from './pages/ResetPassword/ResetPasswordPage'

// Variantes de animación — fade + desplazamiento vertical sutil
const variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0  },
  exit:    { opacity: 0, y: -10 },
}

const transition = { duration: 0.2, ease: 'easeOut' }

// ── Spinner de carga ──────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-neutral-950">
      <div className="size-8 rounded-full border-2 border-neutral-800 border-t-brand-500 animate-spin" />
    </div>
  )
}

// ── Ruta protegida ────────────────────────────────────────────────────────────
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (!user)   return <Navigate to="/login" replace />
  return children
}

// ── Ruta pública (si ya estás logueado, redirige al Dashboard) ────────────────
function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (user)    return <Navigate to="/" replace />
  return children
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const location = useLocation()

  return (
    <div className="w-full max-w-[393px] min-h-screen bg-neutral-950 relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={transition}
          className="w-full"
        >
          <Routes location={location}>
            {/* Públicas */}
            <Route path="/login"  element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><SignUpPage /></PublicRoute>} />
            <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
            <Route path="/reset-password"  element={<ResetPasswordPage />} />

            {/* Protegidas */}
            <Route path="/"             element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/transactions" element={<ProtectedRoute><TransactionsPage /></ProtectedRoute>} />
            <Route path="/add"          element={<ProtectedRoute><AddTransactionPage /></ProtectedRoute>} />
            <Route path="/profile"      element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/budgets"      element={<ProtectedRoute><BudgetsPage /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

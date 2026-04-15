/**
 * AuthContext — Gestión global de la sesión de usuario con Supabase.
 *
 * Provee:
 *   user      : objeto del usuario autenticado (null si no hay sesión)
 *   loading   : true mientras Supabase verifica la sesión inicial
 *   signIn()  : inicia sesión con email + password
 *   signUp()  : crea cuenta con email + password
 *   signOut() : cierra sesión y borra la sesión local
 *
 * onAuthStateChange escucha en tiempo real cualquier cambio
 * (login, logout, token refresh) y actualiza el estado automáticamente.
 */

import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Verifica si ya hay una sesión activa al cargar la app
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // 2. Escucha cambios futuros (login, logout, refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  /** Inicia sesión. Retorna { error } si falla. */
  const signIn = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  /** Crea una nueva cuenta. Retorna { error } si falla. */
  const signUp = async (email, password) => {
    const { error } = await supabase.auth.signUp({ email, password })
    return { error }
  }

  /** Cierra sesión del usuario actual. */
  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}

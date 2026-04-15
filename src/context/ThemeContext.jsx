/**
 * ThemeContext — Gestión global del tema (dark / light).
 *
 * Aplica `data-theme="light"` en <html> cuando el modo claro está activo.
 * Los estilos de `[data-theme="light"]` en index.css overridean las
 * variables CSS de @theme, lo que hace que todos los componentes que usan
 * utilidades de Tailwind se adapten automáticamente.
 *
 * Persiste la preferencia del usuario en localStorage bajo 'orca_theme'.
 */

import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('orca_theme') || 'dark'
  )

  // Aplica / quita el atributo data-theme en <html> y persiste en localStorage
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light')
    } else {
      root.removeAttribute('data-theme')
    }
    try { localStorage.setItem('orca_theme', theme) } catch {}
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme debe usarse dentro de <ThemeProvider>')
  return ctx
}

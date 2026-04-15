/**
 * NavBar — Barra de navegación inferior persistente.
 *
 * Diseño del Figma: 4 iconos centrados con gap-12
 * Rutas: / (Home), /transactions, /add, /profile
 *
 * Iconos representados con SVG inline para no depender de assets externos.
 */

import { NavLink } from 'react-router-dom'

function HomeIcon({ active }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 9.5L12 3L21 9.5V20C21 20.5523 20.5523 21 20 21H15V15H9V21H4C3.44772 21 3 20.5523 3 20V9.5Z"
        fill={active ? '#6366f1' : '#94a3b8'}
      />
    </svg>
  )
}

function TransactionsIcon({ active }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={active ? '#6366f1' : '#94a3b8'} strokeWidth="2"/>
      <path d="M12 7V12L15 14" stroke={active ? '#6366f1' : '#94a3b8'} strokeWidth="2" strokeLinecap="round"/>
      <path d="M8 9H5M8 12H5M8 15H5" stroke={active ? '#6366f1' : '#94a3b8'} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function AddIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#6366f1"/>
      <path d="M12 7V17M7 12H17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

function ProfileIcon({ active }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" fill={active ? '#6366f1' : '#94a3b8'}/>
      <path d="M4 20C4 16.6863 7.58172 14 12 14C16.4183 14 20 16.6863 20 20" stroke={active ? '#6366f1' : '#94a3b8'} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

const navItems = [
  { to: '/',             label: 'Home',         Icon: HomeIcon },
  { to: '/transactions', label: 'Transactions',  Icon: TransactionsIcon },
  { to: '/add',          label: 'Add',           Icon: AddIcon },
  { to: '/profile',      label: 'Profile',       Icon: ProfileIcon },
]

export default function NavBar() {
  return (
    <nav className="
      fixed bottom-0 left-1/2 -translate-x-1/2
      w-full max-w-[393px]
      bg-neutral-950 border-t border-neutral-800
      flex items-center justify-center gap-12
      px-12 py-6
      shadow-md
      z-50
    ">
      {navItems.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className="flex flex-col items-center gap-1"
        >
          {({ isActive }) => (
            <>
              <span className="size-11 flex items-center justify-center">
                <Icon active={isActive} />
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

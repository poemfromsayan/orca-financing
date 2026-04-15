/**
 * Button — Componente base del sistema de diseño ORCA.
 *
 * Variantes del Figma:
 *   primary   → indigo-500 sólido (Login, Save Transaction, Create Account)
 *   secondary → slate-900 con borde (Income toggle inactivo)
 *   ghost     → sin fondo, solo borde slate-800 (Expense toggle activo)
 *   danger    → sin fondo, texto destructive-400 (Logout)
 */

const variants = {
  primary:
    'bg-brand-500 text-white shadow-sm hover:bg-brand-500/90',
  secondary:
    'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:bg-neutral-800',
  ghost:
    'border border-neutral-800 text-neutral-300 hover:bg-neutral-800/50',
  danger:
    'bg-neutral-900 border border-neutral-800 text-destructive-400 hover:bg-destructive-400/10',
}

const sizes = {
  sm:  'text-sm   px-4 py-2    rounded-md  h-8',
  md:  'text-body px-6 py-4   rounded-md  h-[56px]',
  full:'text-body px-6 py-4   rounded-md  h-[56px] w-full',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'sm',
  className = '',
  ...props
}) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2
        font-normal cursor-pointer transition-colors
        disabled:opacity-50 disabled:pointer-events-none
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}

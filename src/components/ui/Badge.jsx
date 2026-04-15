/**
 * Badge — Indicador visual para estados y categorías.
 *
 * Variantes: success, destructive, warning, neutral
 */

const variants = {
  success:
    'bg-success-500/15 text-success-500 dark:text-success-400',
  destructive:
    'bg-destructive-500/15 text-destructive-500 dark:text-destructive-400',
  warning:
    'bg-warning-500/15 text-warning-500',
  neutral:
    'bg-neutral-200 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400',
}

export default function Badge({
  children,
  variant = 'neutral',
  className = '',
  ...props
}) {
  return (
    <span
      className={`
        inline-flex items-center gap-1
        text-caption font-medium
        px-2 py-0.5 rounded-full
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  )
}

/**
 * Card — Contenedor base del dashboard.
 *
 * Usa la sombra "base" del sistema de elevación y bordes neutros.
 */

export default function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`
        bg-white dark:bg-neutral-900
        border border-neutral-200 dark:border-neutral-800
        rounded-lg shadow-base
        p-6
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}

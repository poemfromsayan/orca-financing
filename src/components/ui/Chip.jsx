/**
 * Chip — Filtro pill de la pantalla Transactions.
 *
 * active: true  → fondo brand-500, texto neutral-50
 * active: false → fondo neutral-950, borde neutral-800, texto neutral-500
 */

export default function Chip({ label, active = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center justify-center
        px-4 py-2 rounded-full text-sm font-normal
        whitespace-nowrap transition-colors cursor-pointer
        ${active
          ? 'bg-brand-500 text-white'
          : 'bg-neutral-950 border border-neutral-800 text-neutral-500 hover:border-neutral-600'
        }
      `}
    >
      {label}
    </button>
  )
}

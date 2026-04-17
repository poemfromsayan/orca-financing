/**
 * TransactionCard — Tarjeta de transacción individual.
 *
 * Estructura del Figma:
 *   [icono 40x40] [nombre / categoría / fecha] [monto]
 *
 * Props:
 *   id       : number  — id único (requerido para delete)
 *   name     : string  — nombre de la transacción
 *   category : string  — categoría (Subscription, Income, Service…)
 *   date     : string  — fecha (e.g. "Mar 22")
 *   amount   : number  — monto en USD (raw, sin formato)
 *   type     : "income" | "expense"
 *   onDelete : (id) => void — opcional, activa el swipe-to-delete
 */

import { motion, useMotionValue, useTransform } from 'framer-motion'
import { useCurrency } from '../../context/CurrencyContext'

const DRAG_THRESHOLD = -72
const SNAP_THRESHOLD = -36

export default function TransactionCard({
  id, name, category, date, amount, type = 'expense', onDelete,
}) {
  const initial  = name?.charAt(0).toUpperCase() ?? '?'
  const isIncome = type === 'income'

  const { formatDisplayAmount } = useCurrency()

  const x = useMotionValue(0)

  const trashOpacity = useTransform(x, [DRAG_THRESHOLD, SNAP_THRESHOLD], [1, 0])
  const trashScale   = useTransform(x, [DRAG_THRESHOLD, SNAP_THRESHOLD], [1, 0.6])

  const handleDragEnd = (_, info) => {
    if (info.offset.x > SNAP_THRESHOLD) {
      x.set(0)
    }
  }

  return (
    <div className="relative overflow-hidden rounded-xl">

      {/* ── Zona de delete (detrás, fija) ── */}
      {onDelete && (
        <motion.button
          style={{ opacity: trashOpacity, scale: trashScale }}
          onClick={() => onDelete(id)}
          className="
            absolute inset-y-0 right-0 w-[72px]
            bg-destructive-500 rounded-xl
            flex items-center justify-center
            cursor-pointer
          "
          aria-label="Delete transaction"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </motion.button>
      )}

      {/* ── Card deslizable ── */}
      <motion.div
        drag={onDelete ? 'x' : false}
        style={{ x }}
        dragConstraints={{ left: DRAG_THRESHOLD, right: 0 }}
        dragElastic={0.05}
        onDragEnd={handleDragEnd}
        className="
          bg-neutral-950 border border-neutral-800 rounded-xl
          flex items-center gap-3
          px-4 py-4
          w-full relative z-10
          cursor-grab active:cursor-grabbing
        "
      >
        {/* Icono con inicial */}
        <div className="
          bg-neutral-900 rounded-md
          size-10 shrink-0
          flex items-center justify-center
          text-body text-neutral-300 font-normal
        ">
          {initial}
        </div>

        {/* Datos */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-0 justify-center">
          <p className="text-body text-neutral-50 leading-none truncate">{name}</p>
          <p className="text-sm text-neutral-400 leading-none">{category}</p>
          <p className="text-sm text-neutral-400 leading-none">{date}</p>
        </div>

        {/* Monto */}
        <p className={`
          text-body font-bold leading-none shrink-0
          ${isIncome ? 'text-success-400' : 'text-destructive-400'}
        `}>
          {formatDisplayAmount(amount, type)}
        </p>
      </motion.div>

    </div>
  )
}
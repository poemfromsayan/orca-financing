/**
 * BudgetsPage — Gestión de presupuestos mensuales por categoría.
 *
 * Muestra cada categoría de gasto con:
 *   - Barra de progreso (gasto actual vs límite)
 *   - Input para establecer o editar el límite mensual
 *   - Colores semáforo: verde < 75%, amarillo 75-99%, rojo ≥ 100%
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { expenseCategories } from '../../data/mockData'
import { useTransactions } from '../../context/TransactionContext'
import { useCurrency } from '../../context/CurrencyContext'

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Color de la barra según el porcentaje de gasto */
const barColor = (percent) => {
  if (percent >= 100) return 'bg-destructive-400'
  if (percent >= 75)  return 'bg-warning-500'
  return 'bg-brand-500'
}

// ── BudgetCard ────────────────────────────────────────────────────────────────
function BudgetCard({ category, setBudget, getBudgetProgress }) {
  const { limit, spent, percent } = getBudgetProgress(category.name)
  const [editing, setEditing]     = useState(false)
  const [draft, setDraft]         = useState(limit > 0 ? String(limit) : '')

  const { formatAmount, currencies, currency } = useCurrency()
  const currentCurrency = currencies.find(c => c.code === currency)

  const save = () => {
    setBudget(category.name, draft)
    setEditing(false)
  }

  const hasLimit = limit > 0

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl px-5 py-4 flex flex-col gap-3">

      {/* Cabecera: nombre + botón editar/guardar */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-body text-neutral-50 font-medium">{category.name}</p>
          {hasLimit && (
            <p className="text-caption text-neutral-500 mt-0.5">
              {formatAmount(spent)} of {formatAmount(limit)}
            </p>
          )}
        </div>

        {editing ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-400">{currentCurrency?.symbol}</span>
            <input
              autoFocus
              type="number"
              min="0"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && save()}
              placeholder="0"
              className="
                w-24 bg-neutral-800 border border-neutral-700 rounded-md
                px-2 py-1 text-sm text-neutral-50 text-right
                outline-none focus:border-brand-500 transition-colors
              "
            />
            <button
              onClick={save}
              className="text-sm text-brand-500 hover:text-neutral-50 transition-colors cursor-pointer font-medium"
            >
              Save
            </button>
          </div>
        ) : (
          <button
            onClick={() => { setDraft(limit > 0 ? String(limit) : ''); setEditing(true) }}
            className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer"
          >
            {hasLimit ? 'Edit' : 'Set limit'}
          </button>
        )}
      </div>

      {/* Barra de progreso */}
      {hasLimit && (
        <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor(percent)}`}
            style={{ width: `${percent}%` }}
          />
        </div>
      )}

      {/* Porcentaje o mensaje sin límite */}
      {hasLimit ? (
        <p className={`text-caption font-medium ${
          percent >= 100 ? 'text-destructive-400' :
          percent >= 75  ? 'text-warning-500' :
                            'text-neutral-500'
        }`}>
          {percent}% used
          {percent >= 100 && ' — Over budget!'}
          {percent >= 75 && percent < 100 && ' — Almost there'}
        </p>
      ) : (
        <p className="text-caption text-neutral-700">No limit set</p>
      )}

    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function BudgetsPage() {
  const navigate = useNavigate()
  const { setBudget, getBudgetProgress } = useTransactions()

  return (
    <div className="flex flex-col w-full max-w-[393px] min-h-screen bg-neutral-950 pb-10">

      {/* Header */}
      <div className="flex items-center justify-center px-6 pt-10 pb-6 relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-6 text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
          aria-label="Go back"
        >
          <svg width="21" height="14" viewBox="0 0 21 14" fill="none">
            <path d="M20 7H1M1 7L7 1M1 7L7 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="text-h1 font-bold text-white">Budgets</h1>
      </div>

      {/* Subtitle */}
      <p className="text-sm text-neutral-500 text-center px-6 pb-6">
        Set monthly spending limits per category.
      </p>

      {/* Lista de categorías */}
      <div className="flex flex-col gap-3 px-6">
        {expenseCategories.map((cat) => (
          <BudgetCard
            key={cat.name}
            category={cat}
            setBudget={setBudget}
            getBudgetProgress={getBudgetProgress}
          />
        ))}
      </div>

    </div>
  )
}
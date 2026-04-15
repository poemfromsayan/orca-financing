/**
 * AddTransactionPage — Pantalla para agregar una transacción.
 *
 * Estructura del Figma:
 *   - Back arrow + título "Add Transaction"
 *   - Toggle Expense / Income
 *   - Inputs: Transaction Name, Amount, Category (Dropdown)
 *   - Numeric Keypad (3×4 grid)
 *   - Save Transaction button
 */

import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { InputField, Button } from '../../components/ui'
import { expenseCategories, incomeCategories } from '../../data/mockData'
import { useTransactions } from '../../context/TransactionContext'

// ── Teclado numérico ──────────────────────────────────────────────────────────
const KEYS = ['1','2','3','4','5','6','7','8','9','.','0','⌫']

function NumericKeypad({ onKey }) {
  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {KEYS.map((key) => (
        <button
          key={key}
          onClick={() => onKey(key)}
          className="
            bg-neutral-900 border border-neutral-800 rounded-2xl
            size-20 flex items-center justify-center
            text-h1 font-bold text-neutral-50
            hover:bg-neutral-800 active:scale-95
            transition-all cursor-pointer
          "
        >
          {key}
        </button>
      ))}
    </div>
  )
}

// ── Dropdown de categoría ─────────────────────────────────────────────────────
function CategoryDropdown({ value, onChange, txType }) {
  const [open, setOpen]               = useState(false)
  const [hoveredCat, setHoveredCat]   = useState(null)
  const hoverTimer                    = useRef(null)

  const options = txType === 'income' ? incomeCategories : expenseCategories

  const startHover = (cat) => {
    clearTimeout(hoverTimer.current)
    hoverTimer.current = setTimeout(() => setHoveredCat(cat), 1000)
  }

  const clearHover = () => {
    clearTimeout(hoverTimer.current)
    setHoveredCat(null)
  }

  const handleSelect = (cat) => {
    onChange(cat.name)
    setOpen(false)
    clearHover()
  }

  return (
    <div className="flex flex-col gap-2 w-full relative">
      <label className="text-sm text-neutral-400">Category</label>
      <button
        type="button"
        onClick={() => { setOpen(!open); clearHover() }}
        className="
          bg-neutral-950 border border-neutral-800 rounded-md
          px-4 py-3 flex items-center justify-between
          text-body text-neutral-500 w-full
        "
      >
        <span>{value || 'Select Category'}</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 6L8 11L13 6" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div
          className="
            absolute top-full left-0 right-0 mt-1
            bg-neutral-900 border border-neutral-800 rounded-md
            z-10 overflow-hidden
          "
          onPointerLeave={clearHover}
        >
          {/* Lista scrolleable */}
          <div className="max-h-[220px] overflow-y-auto dropdown-scroll">
            {options.map((cat) => (
              <button
                key={cat.name}
                type="button"
                onPointerEnter={() => startHover(cat)}
                onClick={() => handleSelect(cat)}
                className={`
                  w-full text-left px-4 py-3 text-sm transition-colors
                  ${hoveredCat?.name === cat.name
                    ? 'bg-neutral-800 text-neutral-50'
                    : 'text-neutral-300 hover:bg-neutral-800/60'
                  }
                `}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Zona de descripción — fuera del scroll, no afecta el layout de los botones */}
          <div className={`
            border-t border-neutral-800 px-4 overflow-hidden
            transition-all duration-200
            ${hoveredCat ? 'py-3 max-h-[80px]' : 'py-0 max-h-0'}
          `}>
            <p className="text-caption text-neutral-400 leading-snug">
              {hoveredCat?.description ?? ''}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function AddTransactionPage() {
  const navigate = useNavigate()
  const { addTransaction } = useTransactions()

  const [txType, setTxType]     = useState('expense')
  const [name, setName]         = useState('')
  const [amount, setAmount]     = useState('')
  const [category, setCategory] = useState('')
  const [error, setError]       = useState('')

  const handleKey = (key) => {
    if (key === '⌫') {
      setAmount((prev) => prev.slice(0, -1))
    } else if (key === '.' && amount.includes('.')) {
      return
    } else {
      setAmount((prev) => prev + key)
    }
    setError('')
  }

  const handleSave = () => {
    if (!name.trim()) {
      setError('Transaction name is required.')
      return
    }
    if (!amount || parseFloat(amount) <= 0) {
      setError('Enter a valid amount.')
      return
    }

    const saved = addTransaction({ name, amount, category, type: txType })
    if (saved) navigate('/')
  }

  return (
    <div className="flex flex-col w-full max-w-[393px] min-h-screen bg-neutral-950">

      {/* Header */}
      <div className="flex items-center justify-center px-6 pt-10 pb-8 relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-6 text-neutral-400 hover:text-neutral-200 transition-colors"
          aria-label="Go back"
        >
          <svg width="21" height="14" viewBox="0 0 21 14" fill="none">
            <path d="M20 7H1M1 7L7 1M1 7L7 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="text-h2 font-semibold text-neutral-300">Add Transaction</h1>
      </div>

      {/* Toggle Expense / Income */}
      <div className="flex gap-3 justify-center px-6 pb-8">
        {[
          { value: 'expense', label: 'Expense' },
          { value: 'income',  label: 'Income'  },
        ].map(({ value, label }) => (
          <button
            key={value}
            onClick={() => { setTxType(value); setCategory('') }}
            className={`
              min-w-[113px] h-8 px-4 rounded-md border text-sm
              inline-flex items-center justify-center cursor-pointer transition-colors
              ${txType === value
                ? 'bg-neutral-800 border-neutral-700 text-white'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:bg-neutral-800/60'
              }
            `}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div className="flex flex-col gap-6 px-6 pb-8">
        <InputField
          label="Transaction Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <InputField
          label="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          readOnly
        />
        <CategoryDropdown value={category} onChange={setCategory} txType={txType} />
      </div>

      {/* Numeric Keypad + Save */}
      <div className="flex flex-col items-center px-6">
        <NumericKeypad onKey={handleKey} />

        {error && (
          <p className="text-sm text-destructive-400 text-center mb-2">{error}</p>
        )}

        <div className="w-[178px] mt-2 mb-10">
          <Button
            variant="primary"
            size="sm"
            className="w-full"
            onClick={handleSave}
          >
            Save Transaction
          </Button>
        </div>
      </div>

    </div>
  )
}

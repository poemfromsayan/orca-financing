/**
 * TransactionsPage — Lista completa de transacciones con filtros.
 *
 * Estructura del Figma:
 *   - Header "Transactions"
 *   - Chips: All / Income / Expenses / Subscriptions
 *   - Date Picker (mes actual)
 *   - Gráfica de barras mensual (Recharts)
 *   - Lista scrolleable agrupada por fecha
 *   - NavBar fijo
 */

import { useState, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import NavBar from '../../components/layout/NavBar'
import SpendingBarChart from '../../components/charts/SpendingBarChart'
import { Chip, TransactionCard } from '../../components/ui'
import { expenseCategories, incomeCategories } from '../../data/mockData'
import { useTransactions } from '../../context/TransactionContext'

// Chips: base + todas las categorías de gasto + todas las de ingreso
const BASE_CHIPS     = ['All', 'Income', 'Expenses']
const EXPENSE_CHIPS  = expenseCategories.map((c) => c.name)
const INCOME_CHIPS   = incomeCategories.map((c) => c.name)
const ALL_CHIPS      = [...BASE_CHIPS, ...EXPENSE_CHIPS, ...INCOME_CHIPS]

// Grupos que siempre aparecen primero
const GROUP_ORDER = ['TODAY', 'YESTERDAY']

// Meses para el date picker
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const MONTH_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

export default function TransactionsPage() {
  const [activeFilter, setActiveFilter] = useState('All')
  const { transactions, monthlyData, monthlyTotal, monthlyActiveIndex, deleteTransaction } = useTransactions()

  // Estado del date picker — inicia en mes actual
  const today = new Date()
  const [pickerMonth, setPickerMonth] = useState(today.getMonth())  // 0-11
  const [pickerYear,  setPickerYear]  = useState(today.getFullYear())

  // Dirección del slide del date picker: -1 = hacia atrás, 1 = hacia adelante
  const direction = useRef(1)

  const prevMonth = () => {
    direction.current = -1
    if (pickerMonth === 0) { setPickerMonth(11); setPickerYear((y) => y - 1) }
    else setPickerMonth((m) => m - 1)
  }
  const nextMonth = () => {
    direction.current = 1
    if (pickerMonth === 11) { setPickerMonth(0); setPickerYear((y) => y + 1) }
    else setPickerMonth((m) => m + 1)
  }

  // Detecta si una transacción pertenece al mes/año seleccionado
  const inSelectedMonth = (tx) => {
    const d = tx.date || ''
    const full  = MONTHS[pickerMonth]       // "April"
    const short = MONTH_SHORT[pickerMonth]  // "Apr"
    return d.startsWith(full) || d.startsWith(short)
  }

  // Filtrar por mes Y por chip activo
  const filtered = transactions.filter((tx) => {
    if (!inSelectedMonth(tx)) return false
    if (activeFilter === 'All')      return true
    if (activeFilter === 'Income')   return tx.type === 'income'
    if (activeFilter === 'Expenses') return tx.type === 'expense'
    // Filtro por categoría específica
    return tx.category === activeFilter
  })

  // Agrupar por fecha y ordenar: TODAY → YESTERDAY → resto
  const grouped = filtered.reduce((acc, tx) => {
    if (!acc[tx.group]) acc[tx.group] = []
    acc[tx.group].push(tx)
    return acc
  }, {})

  const sortedGroups = Object.entries(grouped).sort(([a], [b]) => {
    const ai = GROUP_ORDER.indexOf(a)
    const bi = GROUP_ORDER.indexOf(b)
    if (ai !== -1 && bi !== -1) return ai - bi
    if (ai !== -1) return -1
    if (bi !== -1) return 1
    return 0
  })

  const chartTitle = activeFilter === 'Income' ? 'Total Income' : 'Total Spending'

  return (
    <div className="flex flex-col w-full max-w-[393px] min-h-screen bg-neutral-950 pb-[92px]">

      {/* Header */}
      <div className="flex items-center justify-center px-6 pt-10 pb-6">
        <h1 className="text-h1 font-bold text-white">Transactions</h1>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 px-6 overflow-x-auto pb-4 chips-scroll">
        {ALL_CHIPS.map((chip) => (
          <Chip
            key={chip}
            label={chip}
            active={activeFilter === chip}
            onClick={() => setActiveFilter(chip)}
          />
        ))}
      </div>

      {/* Date Picker */}
      <div className="px-6 pt-4 pb-6">
        <div className="
          bg-neutral-900 border border-neutral-800 rounded-md
          inline-flex items-center gap-3 px-3 py-2
        ">
          <button
            onClick={prevMonth}
            className="text-neutral-400 hover:text-neutral-50 transition-colors cursor-pointer"
            aria-label="Previous month"
          >
            <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
              <path d="M8 2L4 6L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Texto del mes con slide horizontal */}
          <div className="min-w-[100px] overflow-hidden flex items-center justify-center">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={`${pickerMonth}-${pickerYear}`}
                initial={{ opacity: 0, x: direction.current * 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction.current * -20 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="text-sm text-neutral-50 text-center whitespace-nowrap"
              >
                {MONTHS[pickerMonth]}, {pickerYear}
              </motion.span>
            </AnimatePresence>
          </div>

          <button
            onClick={nextMonth}
            className="text-neutral-400 hover:text-neutral-50 transition-colors cursor-pointer"
            aria-label="Next month"
          >
            <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
              <path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Gráfica mensual */}
      <div className="px-6 pb-8">
        <SpendingBarChart
          data={monthlyData}
          title={chartTitle}
          total={monthlyTotal}
          activeIndex={monthlyActiveIndex}
        />
      </div>

      {/* Lista de transacciones agrupadas */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${activeFilter}-${pickerMonth}-${pickerYear}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="flex flex-col gap-6 px-6 pb-6"
        >
          {sortedGroups.map(([group, txs]) => (
            <div key={group} className="flex flex-col gap-4">
              <p className="text-sm text-neutral-500 font-normal">{group}</p>
              <AnimatePresence initial={false}>
                {txs.map((tx) => (
                  <motion.div
                    key={tx.id}
                    layout
                    exit={{ x: -120, opacity: 0 }}
                    transition={{ duration: 0.22, ease: 'easeIn' }}
                  >
                    <TransactionCard
                      id={tx.id}
                      name={tx.name}
                      category={tx.category}
                      date={tx.date}
                      amount={tx.amount}
                      type={tx.type}
                      onDelete={deleteTransaction}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ))}

          {filtered.length === 0 && (
            <p className="text-sm text-neutral-500 text-center py-8">
              No transactions found.
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      <NavBar />
    </div>
  )
}

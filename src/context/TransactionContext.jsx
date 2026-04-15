/**
 * TransactionContext — Estado global de ORCA conectado a Supabase.
 *
 * Fuente de verdad: tabla `transactions` en Supabase (por usuario).
 * Valores derivados calculados localmente desde las transacciones:
 *   - balance         : INITIAL_BALANCE + ingresos - gastos
 *   - formattedBalance: formato europeo "$670.028,00"
 *   - weeklyData      : gastos por día de la semana actual
 *   - monthlyData     : gastos por semana del mes actual
 *   - recentTransactions: últimas 3 para el Dashboard
 *
 * CRUD:
 *   addTransaction()    → INSERT en Supabase + actualiza estado local
 *   deleteTransaction() → DELETE en Supabase + actualiza estado local
 */

import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const TransactionContext = createContext(null)

const INITIAL_BALANCE = 670028.00
const STORAGE_KEY_BUDGETS = 'orca_budgets'

// ── Helpers de fecha ──────────────────────────────────────────────────────────

/** "Apr 7" — para mostrar en las cards */
const formatDisplayDate = (isoDate) =>
  new Date(isoDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

/** 'TODAY' | 'YESTERDAY' | 'April 7' — para agrupar en la lista */
const computeGroup = (isoDate) => {
  const tx        = new Date(isoDate)
  const today     = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  if (tx.toDateString() === today.toDateString())     return 'TODAY'
  if (tx.toDateString() === yesterday.toDateString()) return 'YESTERDAY'
  return tx.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
}

/** "+$20.00" / "-$20.00" */
const formatAmount = (amount, type) =>
  `${type === 'income' ? '+' : '-'}$${parseFloat(amount).toFixed(2)}`

// ── Cómputo de gráficas ───────────────────────────────────────────────────────

const WEEK_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const computeWeeklyData = (txs) => {
  const bars = WEEK_LABELS.map((label) => ({ label, value: 0 }))

  // Inicio de la semana actual (lunes)
  const now    = new Date()
  const monday = new Date(now)
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7))
  monday.setHours(0, 0, 0, 0)

  txs
    .filter((tx) => tx.type === 'expense' && new Date(tx.created_at) >= monday)
    .forEach((tx) => {
      const day = new Date(tx.created_at).getDay()
      const idx = day === 0 ? 6 : day - 1   // Dom=0 → idx 6, Lun=1 → idx 0
      bars[idx].value = Math.round(bars[idx].value + tx.amount)
    })

  return bars
}

const MONTH_LABELS = ['1–5', '6–10', '11–15', '16–20', '21–25', '26–28', '29+']

const computeMonthlyData = (txs) => {
  const bars = MONTH_LABELS.map((label) => ({ label, value: 0 }))

  const now   = new Date()
  const month = now.getMonth()
  const year  = now.getFullYear()

  txs
    .filter((tx) => {
      const d = new Date(tx.created_at)
      return tx.type === 'expense' && d.getMonth() === month && d.getFullYear() === year
    })
    .forEach((tx) => {
      const day = new Date(tx.created_at).getDate()
      const idx =
        day <= 5  ? 0 :
        day <= 10 ? 1 :
        day <= 15 ? 2 :
        day <= 20 ? 3 :
        day <= 25 ? 4 :
        day <= 28 ? 5 : 6
      bars[idx].value = Math.round(bars[idx].value + tx.amount)
    })

  return bars
}

// ── Helpers de valores derivados ──────────────────────────────────────────────

const maxIndex = (data) =>
  data.reduce((maxI, bar, i, arr) => (bar.value > arr[maxI].value ? i : maxI), 0)

const sumData = (data) => data.reduce((s, b) => s + b.value, 0)

const formatEU = (n) =>
  '$' + n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

// ── Provider ──────────────────────────────────────────────────────────────────

export function TransactionProvider({ children }) {
  const [transactions, setTransactions] = useState([])
  const [txLoading, setTxLoading]       = useState(true)

  // Budgets persisten en localStorage (feature local, sin backend por ahora)
  const [budgets, setBudgets] = useState(
    () => {
      try { return JSON.parse(localStorage.getItem(STORAGE_KEY_BUDGETS)) || {} }
      catch { return {} }
    }
  )

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_BUDGETS, JSON.stringify(budgets))
  }, [budgets])

  // ── Cargar transacciones desde Supabase ─────────────────────────────────────
  useEffect(() => {
    const fetchTransactions = async () => {
      setTxLoading(true)

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching transactions:', error.message)
        setTxLoading(false)
        return
      }

      // Añadir campos de display derivados del created_at
      const enriched = (data || []).map((tx) => ({
        ...tx,
        date:          formatDisplayDate(tx.created_at),
        group:         computeGroup(tx.created_at),
        displayAmount: formatAmount(tx.amount, tx.type),
      }))

      setTransactions(enriched)
      setTxLoading(false)
    }

    // Suscripción en tiempo real — actualiza cuando otro dispositivo inserta/elimina
    const channel = supabase
      .channel('transactions-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'transactions' },
        () => fetchTransactions()
      )
      .subscribe()

    fetchTransactions()

    return () => supabase.removeChannel(channel)
  }, [])

  // ── addTransaction ──────────────────────────────────────────────────────────
  const addTransaction = async ({ name, amount, category, type }) => {
    const value = parseFloat(amount)
    if (!name?.trim() || !value || isNaN(value) || value <= 0) return false

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id:  user.id,
        name:     name.trim(),
        amount:   value,
        type,
        category: category || 'General',
      })
      .select()
      .single()

    if (error) {
      console.error('Error inserting transaction:', error.message)
      return false
    }

    // Actualiza el estado local inmediatamente sin esperar al listener
    const enriched = {
      ...data,
      date:          formatDisplayDate(data.created_at),
      group:         computeGroup(data.created_at),
      displayAmount: formatAmount(data.amount, data.type),
    }
    setTransactions((prev) => [enriched, ...prev])
    return true
  }

  // ── deleteTransaction ───────────────────────────────────────────────────────
  const deleteTransaction = async (id) => {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting transaction:', error.message)
      return
    }

    setTransactions((prev) => prev.filter((tx) => tx.id !== id))
  }

  // ── resetData ───────────────────────────────────────────────────────────────
  const resetData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('transactions').delete().eq('user_id', user.id)
    setTransactions([])
    setBudgets({})
  }

  // ── Budget helpers ──────────────────────────────────────────────────────────
  const setBudget = (category, limit) => {
    const value = parseFloat(limit)
    setBudgets((prev) => {
      if (!value || value <= 0) {
        const next = { ...prev }
        delete next[category]
        return next
      }
      return { ...prev, [category]: value }
    })
  }

  const getBudgetProgress = (category) => {
    const limit = budgets[category] ?? 0
    const now   = new Date()
    const month = now.getMonth()
    const year  = now.getFullYear()

    const spent = transactions
      .filter((tx) => {
        if (tx.type !== 'expense' || tx.category !== category) return false
        const d = new Date(tx.created_at)
        return d.getMonth() === month && d.getFullYear() === year
      })
      .reduce((sum, tx) => sum + tx.amount, 0)

    const percent = limit > 0 ? Math.min(100, Math.round((spent / limit) * 100)) : 0
    return { limit, spent, percent }
  }

  // ── Valores derivados ───────────────────────────────────────────────────────
  const balance = transactions.reduce(
    (acc, tx) => (tx.type === 'income' ? acc + tx.amount : acc - tx.amount),
    INITIAL_BALANCE
  )

  const recentTransactions = transactions.slice(0, 3)
  const formattedBalance   = formatEU(balance)

  const weeklyData         = computeWeeklyData(transactions)
  const weeklyActiveIndex  = maxIndex(weeklyData)
  const weeklyTotal        = formatEU(sumData(weeklyData))

  const monthlyData        = computeMonthlyData(transactions)
  const monthlyActiveIndex = maxIndex(monthlyData)
  const monthlyTotal       = formatEU(sumData(monthlyData))

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        recentTransactions,
        txLoading,
        balance,
        formattedBalance,
        addTransaction,
        deleteTransaction,
        resetData,
        budgets,
        setBudget,
        getBudgetProgress,
        weeklyData,
        weeklyTotal,
        weeklyActiveIndex,
        monthlyData,
        monthlyTotal,
        monthlyActiveIndex,
      }}
    >
      {children}
    </TransactionContext.Provider>
  )
}

export function useTransactions() {
  const ctx = useContext(TransactionContext)
  if (!ctx) throw new Error('useTransactions debe usarse dentro de <TransactionProvider>')
  return ctx
}

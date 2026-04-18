/**
 * DashboardPage — Pantalla principal del dashboard.
 *
 * Estructura del Figma:
 *   - Balance Card (arriba)
 *   - Gráfica de barras semanal (Recharts)
 *   - Sección "Recent Transactions" con 3 TransactionCards
 *   - NavBar (fijo abajo)
 */

import { useNavigate } from 'react-router-dom'
import NavBar from '../../components/layout/NavBar'
import SpendingBarChart from '../../components/charts/SpendingBarChart'
import { TransactionCard } from '../../components/ui'
import { useTransactions } from '../../context/TransactionContext'
import { useCurrency } from '../../context/CurrencyContext'

function BalanceCard({ balance }) {
  return (
    <div className="
      border border-neutral-800 rounded-2xl
      bg-neutral-950
      w-full
      shadow-[inset_0px_1px_0px_0px_rgba(0,0,0,0.1)]
    ">
      <div className="flex flex-col gap-3 px-6 pt-6 pb-8">
        <p className="text-sm text-neutral-400 font-normal">Total Balance:</p>
        <p className="text-display font-bold text-neutral-50">{balance}</p>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const {
    balance,
    recentTransactions,
    weeklyData,
    weeklyTotal,
    weeklyActiveIndex,
  } = useTransactions()

  const { formatAmount } = useCurrency()

  return (
    <div className="flex flex-col w-full max-w-[393px] min-h-screen bg-neutral-950 pb-[92px]">

      {/* Balance Card */}
      <div className="px-6 pt-10">
        <BalanceCard balance={formatAmount(balance)} />
      </div>

      {/* Gráfica de barras semanal */}
      <div className="px-6 pt-8">
        <SpendingBarChart
          data={weeklyData}
          title="Weekly Spending"
          total={weeklyTotal}
          activeIndex={weeklyActiveIndex}
        />
      </div>

      {/* Recent Transactions */}
      <div className="px-6 pt-8 pb-6 flex flex-col gap-6">
        <h2 className="text-h2 font-semibold text-neutral-400">
          Recent Transactions
        </h2>

        <div className="flex flex-col gap-4">
          {recentTransactions.map((tx) => (
            <TransactionCard
              key={tx.id}
              name={tx.name}
              category={tx.category}
              date={tx.date}
              amount={tx.amount}
              type={tx.type}
            />
          ))}
        </div>

        {/* Ver todas */}
        <button
          onClick={() => navigate('/transactions')}
          className="text-sm text-brand-500 font-medium text-center hover:text-brand-500/80 transition-colors"
        >
          View all transactions →
        </button>
      </div>

      <NavBar />
    </div>
  )
}
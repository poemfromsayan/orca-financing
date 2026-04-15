/**
 * SpendingBarChart — Gráfica de barras con Recharts.
 *
 * Estilizada para coincidir con el diseño del Figma de ORCA:
 *   - Barras redondeadas
 *   - Color activo: brand-500 (#6366f1)
 *   - Color inactivo: neutral-800 (#1e293b)
 *   - Fondo transparente, sin grid ni ejes
 *   - Labels debajo de cada barra (eje X)
 *
 * Props:
 *   data  : array de { label: string, value: number }
 *   title : string — título sobre el total (e.g. "Weekly Spending")
 *   total : string — total formateado (e.g. "$5.215,18")
 *   activeIndex : number — índice de la barra a resaltar en brand-500
 */

import { BarChart, Bar, Cell, XAxis, ResponsiveContainer, Tooltip } from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-50 shadow-md">
        <p className="font-bold">{label}</p>
        <p className="text-brand-500">${payload[0].value.toLocaleString()}</p>
      </div>
    )
  }
  return null
}

export default function SpendingBarChart({ data = [], title = 'Weekly Spending', total = '$0', activeIndex }) {
  return (
    <div className="
      bg-neutral-950 border border-neutral-800 rounded-xl
      px-6 pt-6 pb-4 flex flex-col gap-3 w-full
    ">
      <p className="text-sm text-neutral-400 font-normal">{title}</p>
      <p className="text-h2 font-semibold text-neutral-400">{total}</p>

      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} barCategoryGap="20%" margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 14, fontFamily: 'Inter' }}
          />
          <Tooltip content={<CustomTooltip />} cursor={false} />
          <Bar dataKey="value" radius={[8, 8, 8, 8]} maxBarSize={14}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={index === activeIndex ? '#6366f1' : '#1e293b'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

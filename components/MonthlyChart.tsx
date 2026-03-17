'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface MonthlyChartProps {
  data: { month: string; sales: number; target: number }[]
}

export function MonthlyChart({ data }: MonthlyChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis
          tickFormatter={(v) => `${Math.round(v / 10000)}万`}
          tick={{ fontSize: 12 }}
        />
        <Tooltip
          formatter={(value) => `¥${Number(value).toLocaleString()}`}
          labelStyle={{ fontWeight: 'bold' }}
        />
        <Legend />
        <Bar dataKey="target" name="目標" fill="#c98182" radius={[3, 3, 0, 0]} />
        <Bar dataKey="sales" name="実績" fill="rgb(103, 23, 24)" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

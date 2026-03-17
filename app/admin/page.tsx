'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MonthlyChart } from '@/components/MonthlyChart'

interface SalesRep {
  id: string
  name: string
}

interface SalesRecord {
  salesRepId: string
  year: number
  month: number
  sales: number
  target: number
}

function AchievementBadge({ rate }: { rate: number | null }) {
  if (rate === null) return <span className="text-gray-400 text-sm">―</span>
  const color =
    rate >= 100
      ? 'bg-green-100 text-green-700'
      : rate >= 80
      ? 'bg-yellow-100 text-yellow-700'
      : 'bg-red-100 text-red-700'
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>
      {rate.toFixed(1)}%
    </span>
  )
}

export default function AdminPage() {
  const currentYear = new Date().getFullYear()
  const [year, setYear] = useState(currentYear)
  const [salesReps, setSalesReps] = useState<SalesRep[]>([])
  const [records, setRecords] = useState<SalesRecord[]>([])
  const [expandedRep, setExpandedRep] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/sales-reps')
      .then((r) => r.json())
      .then(setSalesReps)
  }, [])

  useEffect(() => {
    fetch(`/api/records?year=${year}`)
      .then((r) => r.json())
      .then(setRecords)
  }, [year])

  const totalSales = records.reduce((sum, r) => sum + r.sales, 0)
  const totalTarget = records.reduce((sum, r) => sum + r.target, 0)
  const achievementRate = totalTarget > 0 ? (totalSales / totalTarget) * 100 : null

  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1
    const monthRecords = records.filter((r) => r.month === month)
    return {
      month: `${month}月`,
      sales: monthRecords.reduce((sum, r) => sum + r.sales, 0),
      target: monthRecords.reduce((sum, r) => sum + r.target, 0),
    }
  })

  const repTotals = salesReps.map((rep) => {
    const repRecords = records.filter((r) => r.salesRepId === rep.id)
    const repSales = repRecords.reduce((sum, r) => sum + r.sales, 0)
    const repTarget = repRecords.reduce((sum, r) => sum + r.target, 0)
    const rate = repTarget > 0 ? (repSales / repTarget) * 100 : null
    return { rep, repRecords, repSales, repTarget, rate }
  })

  const years = Array.from({ length: 5 }, (_, i) => currentYear - 1 + i)

  return (
    <div className="min-h-screen bg-brand-bg">
      <header className="bg-brand text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-brand-pale hover:text-white text-sm">
            ← ホーム
          </Link>
          <h1 className="text-xl font-bold">🌸 管理者ダッシュボード</h1>
        </div>
        <Link
          href="/admin/members"
          className="bg-brand-secondary hover:bg-brand-dark px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          メンバー管理
        </Link>
      </header>

      <main className="p-6 max-w-7xl mx-auto">
        {/* Year selector */}
        <div className="mb-6 flex items-center gap-3">
          <span className="font-medium text-gray-700">年度:</span>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand-border"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}年
              </option>
            ))}
          </select>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-sm text-gray-500 mb-1">年間実績合計</div>
            <div className="text-2xl font-bold text-gray-800">
              ¥{totalSales.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400 mt-1">
              {Math.round(totalSales / 10000)}万円
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-sm text-gray-500 mb-1">年間目標合計</div>
            <div className="text-2xl font-bold text-gray-800">
              ¥{totalTarget.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400 mt-1">
              {Math.round(totalTarget / 10000)}万円
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-sm text-gray-500 mb-1">全体達成率</div>
            <div
              className={`text-3xl font-bold ${
                achievementRate === null
                  ? 'text-gray-400'
                  : achievementRate >= 100
                  ? 'text-green-600'
                  : achievementRate >= 80
                  ? 'text-yellow-600'
                  : 'text-red-600'
              }`}
            >
              {achievementRate !== null ? `${achievementRate.toFixed(1)}%` : '―'}
            </div>
          </div>
        </div>

        {/* Monthly chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">月次推移（全体）</h2>
          <MonthlyChart data={monthlyData} />
        </div>

        {/* Per-rep table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-700">担当者別実績</h2>
          </div>

          {salesReps.length === 0 ? (
            <div className="p-10 text-center text-gray-400">
              メンバーがいません。{' '}
              <Link href="/admin/members" className="text-brand hover:underline">
                メンバーを追加
              </Link>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-sm text-gray-600 font-medium">
                    担当者
                  </th>
                  <th className="text-right px-6 py-3 text-sm text-gray-600 font-medium">
                    年間目標
                  </th>
                  <th className="text-right px-6 py-3 text-sm text-gray-600 font-medium">
                    年間実績
                  </th>
                  <th className="text-right px-6 py-3 text-sm text-gray-600 font-medium">
                    達成率
                  </th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {repTotals.map(({ rep, repRecords, repSales, repTarget, rate }) => (
                  <>
                    <tr key={rep.id} className="border-t hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-800">{rep.name}</td>
                      <td className="px-6 py-4 text-right text-gray-600">
                        {repTarget > 0 ? `¥${repTarget.toLocaleString()}` : '―'}
                      </td>
                      <td className="px-6 py-4 text-right text-gray-600">
                        {repSales > 0 ? `¥${repSales.toLocaleString()}` : '―'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <AchievementBadge rate={rate} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() =>
                            setExpandedRep(expandedRep === rep.id ? null : rep.id)
                          }
                          className="text-brand hover:text-brand-dark text-sm font-medium"
                        >
                          {expandedRep === rep.id ? '閉じる ▲' : '月別詳細 ▼'}
                        </button>
                      </td>
                    </tr>

                    {expandedRep === rep.id && (
                      <tr key={`${rep.id}-detail`} className="border-t bg-brand-bg">
                        <td colSpan={5} className="px-6 py-4">
                          <div className="grid grid-cols-6 gap-2">
                            {Array.from({ length: 12 }, (_, i) => {
                              const m = i + 1
                              const rec = repRecords.find((r) => r.month === m)
                              const mRate =
                                rec && rec.target > 0
                                  ? (rec.sales / rec.target) * 100
                                  : null
                              return (
                                <div
                                  key={m}
                                  className="bg-white rounded-lg p-3 text-center shadow-sm"
                                >
                                  <div className="text-xs text-gray-500 mb-1 font-medium">
                                    {m}月
                                  </div>
                                  {rec ? (
                                    <>
                                      <div className="text-sm font-bold text-gray-800">
                                        {Math.round(rec.sales / 10000)}万
                                      </div>
                                      <div className="text-xs text-gray-400">
                                        目標 {Math.round(rec.target / 10000)}万
                                      </div>
                                      {mRate !== null && (
                                        <div
                                          className={`text-xs mt-1 font-semibold ${
                                            mRate >= 100
                                              ? 'text-green-600'
                                              : mRate >= 80
                                              ? 'text-yellow-600'
                                              : 'text-red-600'
                                          }`}
                                        >
                                          {mRate.toFixed(0)}%
                                        </div>
                                      )}
                                    </>
                                  ) : (
                                    <div className="text-xs text-gray-300 mt-2">未入力</div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  )
}

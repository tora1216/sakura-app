'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface SalesRep {
  id: string
  name: string
}

export default function SalesPage() {
  const [salesReps, setSalesReps] = useState<SalesRep[]>([])

  useEffect(() => {
    fetch('/api/sales-reps')
      .then((r) => r.json())
      .then(setSalesReps)
  }, [])

  return (
    <div className="min-h-screen bg-brand-bg">
      <header className="bg-brand text-white px-6 py-4 flex items-center gap-4">
        <Link href="/" className="text-brand-pale hover:text-white text-sm">
          ← ホーム
        </Link>
        <h1 className="text-xl font-bold">🌸 担当者を選択</h1>
      </header>

      <main className="p-6 max-w-md mx-auto">
        <p className="text-gray-500 mb-6 text-center">あなたの名前を選択してください</p>

        {salesReps.length === 0 ? (
          <div className="text-center text-gray-400 p-8 bg-white rounded-xl shadow-sm">
            メンバーが登録されていません。
            <br />
            管理者に連絡してください。
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {salesReps.map((rep) => (
              <Link
                key={rep.id}
                href={`/sales/${rep.id}`}
                className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md hover:bg-brand-bg transition-all flex items-center justify-between group"
              >
                <span className="text-lg font-medium text-gray-800">{rep.name}</span>
                <span className="text-brand-border group-hover:text-brand text-xl transition-colors">
                  →
                </span>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

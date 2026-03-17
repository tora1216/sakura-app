'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface SalesRep {
  id: string
  name: string
}

export default function MembersPage() {
  const [salesReps, setSalesReps] = useState<SalesRep[]>([])
  const [newName, setNewName] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchReps = () =>
    fetch('/api/sales-reps')
      .then((r) => r.json())
      .then(setSalesReps)

  useEffect(() => {
    fetchReps()
  }, [])

  const addRep = async () => {
    if (!newName.trim()) return
    setLoading(true)
    await fetch('/api/sales-reps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName.trim() }),
    })
    setNewName('')
    await fetchReps()
    setLoading(false)
  }

  const deleteRep = async (id: string, name: string) => {
    if (!confirm(`「${name}」を削除しますか？\nこの担当者の全データも削除されます。`)) return
    await fetch(`/api/sales-reps/${id}`, { method: 'DELETE' })
    await fetchReps()
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      <header className="bg-brand text-white px-6 py-4 flex items-center gap-4">
        <Link href="/admin" className="text-brand-pale hover:text-white text-sm">
          ← ダッシュボード
        </Link>
        <h1 className="text-xl font-bold">メンバー管理</h1>
      </header>

      <main className="p-6 max-w-2xl mx-auto">
        {/* Add member */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">新しいメンバーを追加</h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addRep()}
              placeholder="名前を入力（例：田中 太郎）"
              className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-border"
            />
            <button
              onClick={addRep}
              disabled={!newName.trim() || loading}
              className="bg-brand text-white px-6 py-2 rounded-lg hover:bg-brand-dark disabled:opacity-50 font-medium transition-colors"
            >
              追加
            </button>
          </div>
        </div>

        {/* Member list */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-700">
              メンバー一覧
            </h2>
            <span className="text-sm text-gray-400">{salesReps.length}人</span>
          </div>

          {salesReps.length === 0 ? (
            <div className="p-10 text-center text-gray-400">
              メンバーがいません
            </div>
          ) : (
            <ul>
              {salesReps.map((rep, i) => (
                <li
                  key={rep.id}
                  className={`flex items-center justify-between px-6 py-4 ${
                    i > 0 ? 'border-t' : ''
                  } hover:bg-gray-50`}
                >
                  <span className="font-medium text-gray-800">{rep.name}</span>
                  <button
                    onClick={() => deleteRep(rep.id, rep.name)}
                    className="text-red-400 hover:text-red-600 text-sm px-3 py-1 rounded hover:bg-red-50 transition-colors"
                  >
                    削除
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  )
}

import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-bg flex flex-col items-center justify-center">
      <div className="text-center mb-12">
        <div className="text-6xl mb-4">🌸</div>
        <h1 className="text-4xl font-bold text-brand mb-3">さくら営業管理</h1>
        <p className="text-gray-500 text-lg">営業成績・目標管理システム</p>
      </div>

      <div className="flex gap-6">
        <Link
          href="/admin"
          className="bg-brand hover:bg-brand-dark text-white rounded-2xl px-10 py-8 text-center shadow-lg transition-all hover:scale-105"
        >
          <div className="text-3xl mb-2">👔</div>
          <div className="text-xl font-bold">管理者</div>
          <div className="text-brand-pale text-sm mt-1">全体の集計・確認</div>
        </Link>

        <Link
          href="/sales"
          className="bg-white hover:bg-brand-bg text-brand border-2 border-brand-border rounded-2xl px-10 py-8 text-center shadow-lg transition-all hover:scale-105"
        >
          <div className="text-3xl mb-2">📊</div>
          <div className="text-xl font-bold">営業担当</div>
          <div className="text-brand-secondary text-sm mt-1">実績・目標の入力</div>
        </Link>
      </div>
    </main>
  )
}

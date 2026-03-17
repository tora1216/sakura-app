import { NextRequest, NextResponse } from 'next/server'
import { readDB, writeDB } from '@/lib/db'

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const db = readDB()
  db.salesReps = db.salesReps.filter((r) => r.id !== id)
  db.records = db.records.filter((r) => r.salesRepId !== id)
  writeDB(db)
  return NextResponse.json({ success: true })
}

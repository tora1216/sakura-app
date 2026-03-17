import { NextRequest, NextResponse } from 'next/server'
import { readDB, writeDB } from '@/lib/db'
import { randomUUID } from 'crypto'

export async function GET() {
  const db = readDB()
  return NextResponse.json(db.salesReps)
}

export async function POST(request: NextRequest) {
  const { name } = await request.json()
  const db = readDB()
  const newRep = { id: randomUUID(), name }
  db.salesReps.push(newRep)
  writeDB(db)
  return NextResponse.json(newRep, { status: 201 })
}

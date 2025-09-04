import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export const runtime = 'nodejs'

export async function GET(){
  const feedPath = path.join(process.cwd(), 'data', 'feed.json')
  const raw = await fs.readFile(feedPath, 'utf8')
  const items = JSON.parse(raw)
  return NextResponse.json({ items })
}



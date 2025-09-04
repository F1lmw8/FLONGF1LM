import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { promises as fs } from 'fs'
import path from 'path'
import cloudinary from '@/lib/cloudinary'

export const runtime = 'nodejs'

export async function DELETE(req: NextRequest){
  const cookieStore = await cookies()
  const isAuthed = cookieStore.get('admin')?.value === '1'
  if (!isAuthed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await req.json() as { id:string }
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const feedPath = path.join(process.cwd(), 'data', 'feed.json')
  const raw = await fs.readFile(feedPath, 'utf8')
  const list = JSON.parse(raw)
  const idx = list.findIndex((x:any)=> x.id === id)
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const removed = list.splice(idx,1)[0]
  await fs.writeFile(feedPath, JSON.stringify(list, null, 2))

  // Try remove file from Cloudinary
  try{
    if (removed?.src && removed.src.includes('cloudinary.com')){
      const publicId = removed.src.split('/').slice(-2).join('/').replace(/\.[^/.]+$/, "")
      await cloudinary.uploader.destroy(publicId)
    }
  } catch {}

  return NextResponse.json({ success:true })
}

export async function PATCH(req: NextRequest){
  const cookieStore = await cookies()
  const isAuthed = cookieStore.get('admin')?.value === '1'
  if (!isAuthed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json() as any
  const { id, ...updates } = body || {}
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  const feedPath = path.join(process.cwd(), 'data', 'feed.json')
  const raw = await fs.readFile(feedPath, 'utf8')
  const list = JSON.parse(raw)
  const idx = list.findIndex((x:any)=> x.id === id)
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  list[idx] = { ...list[idx], ...updates }
  await fs.writeFile(feedPath, JSON.stringify(list, null, 2))
  return NextResponse.json({ success: true, item: list[idx] })
}



import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { promises as fs } from 'fs'
import path from 'path'
import imageSize from 'image-size'
import * as exifr from 'exifr'
import cloudinary from '@/lib/cloudinary'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Using Web FormData parsing provided by NextRequest in Node runtime

export async function POST(req: NextRequest){
  // Auth via HttpOnly cookie set by /api/auth
  const cookieStore = await cookies()
  const isAuthed = cookieStore.get('admin')?.value === '1'
  if (!isAuthed){
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Use Node.js Request to parse formdata instead (Web FormData)
  const formData = await req.formData()
  const files = formData.getAll('file') as unknown as File[]
  const alt = String(formData.get('alt')||'')
  const caption = String(formData.get('caption')||'')
  const tagsStr = String(formData.get('tags')||'')
  const watermark = String(formData.get('watermark')||'true') === 'true'
  const overlay = String(formData.get('overlay')||'true') === 'true'
  const cameraForm = String(formData.get('camera')||'')
  const lensForm = String(formData.get('lens')||'')
  const fNumberForm = String(formData.get('fNumber')||'')
  const isoForm = String(formData.get('iso')||'')
  const albumId = String(formData.get('albumId')||'')
  const albumTitle = String(formData.get('albumTitle')||'')

  if (!files || files.length === 0){
    return NextResponse.json({ error: 'No file' }, { status: 400 })
  }

  const date = new Date().toISOString().slice(0,10)
  const tags = tagsStr.split(',').map(s=>s.trim()).filter(Boolean)

  const entries: any[] = []
  for (const f of files){
    const arrayBuffer = await (f as any).arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const filename = (f as any).name || `upload-${Date.now()}`
    
    // Upload to Cloudinary
    const folder = albumId ? `portfolio/${albumId}` : 'portfolio'
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { 
          folder,
          public_id: filename.replace(/\.[^/.]+$/, ""), // Remove extension
          resource_type: 'auto'
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(buffer)
    }) as any

    const w = result.width || 0
    const h = result.height || 0

    // EXIF fallback per file
    let camera: string | undefined = cameraForm || undefined
    let lens: string | undefined = lensForm || undefined
    let fNumber: number | undefined = fNumberForm ? Number(fNumberForm) : undefined
    let iso: number | undefined = isoForm ? Number(isoForm) : undefined
    try {
      const parsed = await (exifr as any).parse(buffer)
      if (parsed){
        if (!camera) camera = parsed.Model || parsed.Make
        if (!lens) lens = parsed.LensModel
        if (!fNumber) fNumber = parsed.FNumber || (parsed.ApertureValue && Number(parsed.ApertureValue))
        if (!iso) iso = parsed.ISO || parsed.ISOSpeedRatings
      }
    } catch {}

    const id = `${Date.now()}-${Math.random().toString(36).slice(2,7)}`
    const src = result.secure_url
    const entry = { id, src, w, h, alt: alt || caption || filename, date, tags, watermark, overlay, camera, lens, fNumber, iso, albumId: albumId || undefined, albumTitle: albumTitle || undefined }
    entries.push(entry)
  }

  const feedPath = path.join(process.cwd(), 'data', 'feed.json')
  const raw = await fs.readFile(feedPath, 'utf8')
  const list = JSON.parse(raw)
  list.push(...entries)
  await fs.writeFile(feedPath, JSON.stringify(list, null, 2))

  return NextResponse.json({ success: true, entries })
}



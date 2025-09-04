import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import * as exifr from 'exifr'
import cloudinary from '@/lib/cloudinary'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Using Web FormData parsing provided by NextRequest in Node runtime

export async function POST(req: NextRequest) {
  try {
    console.log('=== UPLOAD API START ===')
    
    // Auth via HttpOnly cookie set by /api/auth
    const cookieStore = await cookies()
    const isAuthed = cookieStore.get('admin')?.value === '1'
    console.log('Auth check:', isAuthed)
    
    if (!isAuthed) {
      console.log('Unauthorized access')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Use Node.js Request to parse formdata instead (Web FormData)
    console.log('Parsing form data...')
    const formData = await req.formData()
    const files = formData.getAll('file') as unknown as File[]
    console.log('Files count:', files.length)
    
    const alt = String(formData.get('alt') || '')
    const caption = String(formData.get('caption') || '')
    const tagsStr = String(formData.get('tags') || '')
    const watermark = String(formData.get('watermark') || 'true') === 'true'
    const overlay = String(formData.get('overlay') || 'true') === 'true'
    const cameraForm = String(formData.get('camera') || '')
    const lensForm = String(formData.get('lens') || '')
    const fNumberForm = String(formData.get('fNumber') || '')
    const isoForm = String(formData.get('iso') || '')
    const albumId = String(formData.get('albumId') || '')
    const albumTitle = String(formData.get('albumTitle') || '')
    
    console.log('Form data parsed:', {
      filesCount: files.length,
      fNumberForm,
      cameraForm,
      lensForm,
      isoForm
    })

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No file' }, { status: 400 })
    }

    const date = new Date().toISOString().slice(0, 10)
    const tags = tagsStr.split(',').map(s => s.trim()).filter(Boolean)

    const entries: any[] = []
    const errors: any[] = []

    for (const f of files) {
      try {
        const arrayBuffer = await (f as any).arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const filename = (f as any).name || `upload-${Date.now()}`

        // Prepare Cloudinary context - ensure all values are strings
        const context: Record<string, string> = {}
        if (alt) context.alt = alt
        if (caption) context.caption = caption
        if (cameraForm) context.camera = cameraForm
        if (lensForm) context.lens = lensForm
        if (fNumberForm) context.fNumber = fNumberForm
        if (isoForm) context.iso = isoForm
        if (albumId) context.albumId = albumId
        if (albumTitle) context.albumTitle = albumTitle
        if (tags.length > 0) context.tags = tags.join(',')
        
        // Add boolean values as strings
        context.watermark = String(watermark)
        context.overlay = String(overlay)

        // Upload to Cloudinary
        const folder = albumId ? `portfolio/${albumId}` : 'portfolio'
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              folder,
              public_id: filename.replace(/\.[^/.]+$/, ""), // Remove extension
              resource_type: 'auto',
              context: context
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
          if (parsed) {
            if (!camera) camera = parsed.Model || parsed.Make
            if (!lens) lens = parsed.LensModel
            if (!fNumber) fNumber = parsed.FNumber || (parsed.ApertureValue && Number(parsed.ApertureValue))
            if (!iso) iso = parsed.ISO || parsed.ISOSpeedRatings
          }
        } catch {
          // Ignore EXIF errors
        }

        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
        const src = result.secure_url
        const entry = {
          id,
          src,
          w,
          h,
          alt: alt || caption || filename,
          date,
          tags,
          watermark,
          overlay,
          camera,
          lens,
          fNumber: fNumber && !isNaN(fNumber) ? Math.round(fNumber * 10) : null, // Convert to integer (e.g., 4.5 -> 45)
          iso,
          albumId: albumId || undefined,
          albumTitle: albumTitle || undefined
        }
        entries.push(entry)

      } catch (fileError) {
        console.error(`Error processing file ${(f as any).name}:`, fileError)
        errors.push({
          filename: (f as any).name || 'unknown',
          error: fileError instanceof Error ? fileError.message : 'Unknown error'
        })
      }
    }

    // Save successful uploads to database
    const { addPhoto, initDatabase } = await import('@/lib/database')
    
    // Initialize database if needed
    try {
      console.log('Initializing database...')
      await initDatabase()
      console.log('Database initialized successfully')
    } catch (initError) {
      console.error('Database initialization failed:', initError)
      return NextResponse.json({
        ok: false,
        error: 'Database initialization failed',
        errors: entries.map(entry => ({
          filename: entry.alt || 'unknown',
          error: 'Database initialization failed'
        }))
      }, { status: 500 })
    }
    
    console.log(`Saving ${entries.length} entries to database...`)
    for (const entry of entries) {
      try {
        console.log(`Saving entry: ${entry.id} - ${entry.alt}`)
        await addPhoto(entry)
        console.log(`Successfully saved: ${entry.id}`)
      } catch (dbError) {
        console.error(`Error saving to database:`, dbError)
        // Remove from entries if database save failed
        const index = entries.indexOf(entry)
        if (index > -1) {
          entries.splice(index, 1)
          errors.push({
            filename: entry.alt || 'unknown',
            error: 'Database save failed'
          })
        }
      }
    }
    console.log(`Database save completed. ${entries.length} entries saved successfully.`)

    // Return response based on success/failure
    if (entries.length === 0) {
      // All files failed
      return NextResponse.json({
        ok: false,
        error: 'All uploads failed',
        errors
      }, { status: 500 })
    } else {
      // At least one file succeeded
      return NextResponse.json({
        ok: true,
        entries,
        errors: errors.length > 0 ? errors : undefined
      })
    }

  } catch (error) {
    console.error('Upload API error:', error)
    return NextResponse.json({
      ok: false,
      error: error instanceof Error ? error.message : 'Internal server error',
      errors: []
    }, { status: 500 })
  }
}



import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { promises as fs } from 'fs'
import path from 'path'
import { addPhoto, initDatabase } from '@/lib/database'

export const runtime = 'nodejs'

export async function POST(){
  const cookieStore = await cookies()
  const isAuthed = cookieStore.get('admin')?.value === '1'
  if (!isAuthed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    // Initialize database
    await initDatabase()

    // Read existing data from feed.json
    const feedPath = path.join(process.cwd(), 'data', 'feed.json')
    const raw = await fs.readFile(feedPath, 'utf8')
    const photos = JSON.parse(raw)

    // Migrate each photo to database
    let migrated = 0
    for (const photo of photos) {
      try {
        await addPhoto(photo)
        migrated++
      } catch (error) {
        console.error('Error migrating photo:', photo.id, error)
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Migrated ${migrated} photos to database` 
    })
  } catch (error) {
    console.error('Migration error:', error)
    return NextResponse.json({ error: 'Failed to migrate data' }, { status: 500 })
  }
}
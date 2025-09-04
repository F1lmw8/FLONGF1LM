import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getAllPhotos, initDatabase } from '@/lib/database'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    // Auth check
    const cookieStore = await cookies()
    const isAuthed = cookieStore.get('admin')?.value === '1'
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check database connection
    let dbStatus = 'unknown'
    let photoCount = 0
    let dbError = null
    
    try {
      await initDatabase()
      const photos = await getAllPhotos()
      photoCount = photos.length
      dbStatus = 'connected'
    } catch (error) {
      dbStatus = 'error'
      dbError = error instanceof Error ? error.message : 'Unknown error'
    }

    // Check environment variables
    const envCheck = {
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      hasCloudinaryCloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
      hasCloudinaryApiKey: !!process.env.CLOUDINARY_API_KEY,
      hasCloudinaryApiSecret: !!process.env.CLOUDINARY_API_SECRET,
      nodeEnv: process.env.NODE_ENV
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      database: {
        status: dbStatus,
        photoCount,
        error: dbError
      },
      environment: envCheck
    })
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

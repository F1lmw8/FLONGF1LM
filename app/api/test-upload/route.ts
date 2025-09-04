import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    console.log('=== TEST UPLOAD ROUTE START ===')
    
    // Auth check
    const cookieStore = await cookies()
    const isAuthed = cookieStore.get('admin')?.value === '1'
    console.log('Auth check:', isAuthed)
    
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Test form data parsing
    console.log('Parsing form data...')
    const formData = await req.formData()
    const files = formData.getAll('file') as unknown as File[]
    console.log('Files count:', files.length)
    
    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files' }, { status: 400 })
    }

    // Test fNumber conversion
    const fNumberForm = formData.get('fNumber') as string
    console.log('fNumberForm:', fNumberForm)
    
    let fNumber: number | undefined = fNumberForm ? Number(fNumberForm) : undefined
    console.log('fNumber after Number():', fNumber)
    
    const convertedFNumber = fNumber && !isNaN(fNumber) ? Math.round(fNumber * 10) : null
    console.log('convertedFNumber:', convertedFNumber)

    // Test database connection
    console.log('Testing database connection...')
    const { initDatabase, getAllPhotos } = await import('@/lib/database')
    
    try {
      await initDatabase()
      console.log('Database init successful')
      
      const photos = await getAllPhotos()
      console.log('Photos count:', photos.length)
      
    } catch (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json({
        error: 'Database error',
        details: dbError instanceof Error ? dbError.message : 'Unknown error'
      }, { status: 500 })
    }

    // Test Cloudinary
    console.log('Testing Cloudinary...')
    try {
      const cloudinary = await import('@/lib/cloudinary')
      console.log('Cloudinary import successful')
    } catch (cloudinaryError) {
      console.error('Cloudinary error:', cloudinaryError)
      return NextResponse.json({
        error: 'Cloudinary error',
        details: cloudinaryError instanceof Error ? cloudinaryError.message : 'Unknown error'
      }, { status: 500 })
    }

    console.log('=== TEST UPLOAD ROUTE SUCCESS ===')
    return NextResponse.json({
      success: true,
      message: 'All tests passed',
      data: {
        filesCount: files.length,
        fNumberForm,
        fNumber,
        convertedFNumber,
        photosCount: photos.length
      }
    })

  } catch (error) {
    console.error('=== TEST UPLOAD ROUTE ERROR ===', error)
    return NextResponse.json({
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}

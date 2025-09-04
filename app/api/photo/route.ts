import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { deletePhoto, updatePhoto } from '@/lib/database'
import cloudinary from '@/lib/cloudinary'

export const runtime = 'nodejs'

export async function DELETE(req: NextRequest){
  const cookieStore = await cookies()
  const isAuthed = cookieStore.get('admin')?.value === '1'
  if (!isAuthed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await req.json() as { id:string }
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  try {
    // Get photo from database before deleting
    const { getAllPhotos } = await import('@/lib/database')
    const photos = await getAllPhotos()
    const photo = photos.find(p => p.id === id)
    
    if (!photo) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    // Delete from database
    await deletePhoto(id)

    // Try remove file from Cloudinary
    try{
      if (photo?.src && photo.src.includes('cloudinary.com')){
        const publicId = photo.src.split('/').slice(-2).join('/').replace(/\.[^/.]+$/, "")
        await cloudinary.uploader.destroy(publicId)
      }
    } catch {
      // Ignore Cloudinary deletion errors
    }

    return NextResponse.json({ success:true })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest){
  const cookieStore = await cookies()
  const isAuthed = cookieStore.get('admin')?.value === '1'
  if (!isAuthed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json() as any
  const { id, ...updates } = body || {}
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  try {
    const updatedItem = await updatePhoto(id, updates)
    if (!updatedItem) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true, item: updatedItem })
  } catch (error) {
    console.error('Update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}



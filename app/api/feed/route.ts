import { NextResponse } from 'next/server'
import { getAllPhotos, initDatabase } from '@/lib/database'

export const runtime = 'nodejs'

export async function GET(){
  try {
    // Initialize database if needed
    await initDatabase()
    
    // Get all photos from database
    const items = await getAllPhotos()
    return NextResponse.json({ items })
  } catch (error) {
    console.error('Error getting feed:', error)
    return NextResponse.json({ items: [] })
  }
}



import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import pool from '@/lib/database'

export const runtime = 'nodejs'

export async function POST(){
  const cookieStore = await cookies()
  const isAuthed = cookieStore.get('admin')?.value === '1'
  if (!isAuthed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    // Clear all photos from database
    await pool.query('DELETE FROM photos')
    
    return NextResponse.json({ 
      success: true, 
      message: 'All photos cleared from database' 
    })
  } catch (error) {
    console.error('Clear database error:', error)
    return NextResponse.json({ error: 'Failed to clear database' }, { status: 500 })
  }
}

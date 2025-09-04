import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    const hasAdminSecret = !!process.env.ADMIN_SECRET
    const adminLen = process.env.ADMIN_SECRET?.length || 0
    
    return NextResponse.json({
      hasAdminSecret,
      adminLen,
      cloudinary: {
        hasCloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
        hasApiKey: !!process.env.CLOUDINARY_API_KEY,
        hasApiSecret: !!process.env.CLOUDINARY_API_SECRET
      },
      database: {
        hasDatabaseUrl: !!process.env.DATABASE_URL
      }
    })
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(req: NextRequest){
  const { password } = await req.json()
  const secret = process.env.ADMIN_SECRET
  if (!secret || password !== secret){
    return NextResponse.json({ ok: false, error: 'Invalid password' }, { status: 401 })
  }
  const res = NextResponse.json({ ok: true })
  res.cookies.set('admin', '1', {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 12,
  })
  return res
}



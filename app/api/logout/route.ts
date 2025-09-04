import { NextResponse } from 'next/server'

export async function POST(){
  const res = NextResponse.redirect(new URL('/', 'http://localhost:3000'))
  res.cookies.set('admin', '', { httpOnly: true, path: '/', maxAge: 0 })
  return res
}

export async function GET(){
  const res = NextResponse.redirect(new URL('/admin/login', 'http://localhost:3000'))
  res.cookies.set('admin', '', { httpOnly: true, path: '/', maxAge: 0 })
  return res
}



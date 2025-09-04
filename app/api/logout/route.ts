import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

function clearAdminCookie(res: NextResponse) {
  res.cookies.set('admin', '', { httpOnly: true, path: '/', maxAge: 0 });
}

export async function POST(req: NextRequest) {
  const res = NextResponse.redirect(new URL('/', req.url), { status: 302 });
  clearAdminCookie(res);
  return res;
}

export async function GET(req: NextRequest) {
  const res = NextResponse.redirect(new URL('/', req.url), { status: 302 });
  clearAdminCookie(res);
  return res;
}



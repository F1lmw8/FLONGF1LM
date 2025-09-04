import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

// This test route is disabled in production to avoid build/lint errors.
export async function GET() {
  return NextResponse.json({ ok: false, message: 'test-upload route disabled' }, { status: 410 });
}

export async function POST() {
  return NextResponse.json({ ok: false, message: 'test-upload route disabled' }, { status: 410 });
}

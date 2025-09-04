// app/layout.tsx
import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'
import AdminNavServer from '@/components/AdminNavServer'
export const metadata: Metadata = {
  title: 'FILM — Photo Portfolio',
  description: 'Street • Portrait • Travel — by F1lmW8',
  openGraph: {
    title: 'f1lm_w8 — Photo Portfolio',
    description: 'Street • Portrait • Travel — by F1lmW8',
    type: 'website',
    url: 'https://your-domain.example', // ใส่โดเมนจริงเมื่อพร้อม
    siteName: 'f1lm_w8 Photofolio',
  },
  twitter: {
    card: 'summary_large_image'
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className="bg-neutral-50 text-neutral-900">
        <header className="sticky top-0 z-30 border-b border-neutral-200/60 bg-white/70 backdrop-blur">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <nav className="flex items-center justify-between">
              <Link href="/" className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold tracking-wide bg-neutral-900 text-white hover:bg-neutral-800 transition">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> FLONGF1LM
              </Link>
              <div className="flex items-center gap-1 text-sm">
                <Link className="rounded-full px-3 py-2 hover:bg-neutral-100 transition" href="/gallery">Gallery</Link>
                <Link className="rounded-full px-3 py-2 hover:bg-neutral-100 transition" href="/about">About</Link>
                {/* Admin menu shows only when cookie is set (SSR, no flicker) */}
                <AdminNavServer />
              </div>
            </nav>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4">{children}</main>
        <footer className="text-sm text-neutral-500 py-10 text-center">© f1lm_w8</footer>
      </body>
    </html>
  )
}
'use client'
import React, { useState } from 'react'

export default function AdminLoginPage(){
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent){
    e.preventDefault()
    if (!password) { setError('กรุณากรอกรหัสผ่าน'); return }
    const res = await fetch('/api/auth', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    })
    if (!res.ok){ setError('รหัสผ่านไม่ถูกต้อง'); return }
    // Full navigation so SSR reads HttpOnly cookie and navbar shows instantly
    window.location.assign('/admin/upload')
  }

  return (
    <section className="py-10 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password" value={password}
          onChange={e=>setPassword(e.target.value)}
          placeholder="รหัสผ่าน"
          className="w-full px-4 py-3 rounded-xl border border-neutral-300"
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="w-full rounded-xl bg-neutral-900 text-white py-3 font-semibold hover:bg-neutral-800">เข้าสู่ระบบ</button>
      </form>
      
    </section>
  )
}




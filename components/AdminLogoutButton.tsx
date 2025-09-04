'use client'
import { useState } from 'react'

export default function AdminLogoutButton(){
  const [loading, setLoading] = useState(false)
  async function logout(){
    try{
      setLoading(true)
      await fetch('/api/logout', { method: 'POST' })
      location.href = '/admin/login'
    } finally {
      setLoading(false)
    }
  }
  return (
    <button onClick={logout} className="rounded-full px-3 py-2 text-sm hover:bg-neutral-100 transition" disabled={loading}>
      {loading ? 'กำลังออก...' : 'Logout'}
    </button>
  )
}



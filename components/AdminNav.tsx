'use client'
import { useEffect, useState } from 'react'

export default function AdminNav(){
  const [authed, setAuthed] = useState(false)
  useEffect(()=>{
    if (typeof window === 'undefined') return
    const update = ()=> setAuthed(document.cookie.split(';').some(c=>c.trim().startsWith('admin=1')))
    update()
    const onStorage = ()=> update()
    const onCustom = ()=> update()
    const onVisibility = ()=> update()
    window.addEventListener('storage', onStorage)
    window.addEventListener('admin-auth-changed', onCustom)
    document.addEventListener('visibilitychange', onVisibility)
    return ()=> {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('admin-auth-changed', onCustom)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  if (!authed) return null
  return (
    <div className="hidden sm:flex items-center gap-1 text-sm">
      <a className="rounded-full px-3 py-2 hover:bg-neutral-100 transition" href="/admin/upload">Upload</a>
      <a className="rounded-full px-3 py-2 hover:bg-neutral-100 transition" href="/admin/manage">Manage</a>
      
    </div>
  )
}



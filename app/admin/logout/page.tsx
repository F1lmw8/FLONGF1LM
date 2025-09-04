'use client'
import { useEffect } from 'react'

export default function AdminLogout(){
  useEffect(()=>{
    try{
      localStorage.removeItem('admin')
      document.cookie = 'admin=; Max-Age=0; path=/'
    } finally {
      location.replace('/admin/login')
    }
  }, [])
  return null
}



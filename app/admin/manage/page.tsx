'use client'
import { useEffect, useState } from 'react'

type Item = {
  id:string; src:string; w:number; h:number; alt?:string;
  date?:string; tags?:string[]; watermark?:boolean; overlay?:boolean;
  camera?:string; lens?:string; fNumber?:number; iso?:number;
  albumId?:string; albumTitle?:string;
}

export default function AdminManagePage(){
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [editing, setEditing] = useState<Item|null>(null)

  useEffect(()=>{
    async function load(){
      try{
        const res = await fetch('/api/feed')
        const json = await res.json()
        setItems(json.items||[])
      } finally { setLoading(false) }
    }
    load()
  }, [])

  async function remove(id:string){
    const ok = window.confirm('ยืนยันการลบรูปนี้? การลบไม่สามารถย้อนกลับได้')
    if (!ok) return
    setStatus('กำลังลบ...')
    const res = await fetch('/api/photo', {
      method: 'DELETE',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    if (res.ok){
      setItems(prev => prev.filter(i=>i.id!==id))
      setStatus('ลบสำเร็จ')
    } else {
      setStatus('ลบไม่สำเร็จ')
    }
  }

  async function saveEdit(){
    if (!editing) return
    setStatus('กำลังบันทึก...')
    const res = await fetch('/api/photo', {
      method: 'PATCH',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing)
    })
    if (res.ok){
      const json = await res.json()
      setItems(prev => prev.map(i=> i.id===json.item.id ? json.item : i))
      setEditing(null)
      setStatus('บันทึกสำเร็จ')
    } else {
      setStatus('บันทึกไม่สำเร็จ')
    }
  }

  if (loading) return <p className="py-10">Loading...</p>

  return (
    <section className="py-6">
      <h1 className="text-2xl font-bold mb-4">Manage Photos</h1>
      {status && <p className="text-sm mb-3">{status}</p>}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map(i=> (
          <div key={i.id} className="border rounded-lg overflow-hidden">
            <img src={i.src} alt={i.alt||''} className="w-full h-32 object-cover" />
            <div className="p-2 text-xs">
              <p className="truncate">{i.alt}</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button onClick={()=>setEditing(i)} className="rounded bg-neutral-800 text-white py-1 hover:bg-neutral-700">แก้ไข</button>
                <button onClick={()=>remove(i.id)} className="rounded bg-red-600 text-white py-1 hover:bg-red-500">ลบ</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {editing && (
        <div className="fixed inset-0 bg-black/40 grid place-items-center p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-4 space-y-3">
            <h2 className="font-semibold">แก้ไขข้อมูลรูป</h2>
            <input className="w-full px-3 py-2 rounded border" placeholder="alt" value={editing.alt||''} onChange={e=>setEditing({ ...editing, alt: e.target.value })} />
            <input className="w-full px-3 py-2 rounded border" placeholder="tags (คั่นด้วย ,)" value={(editing.tags||[]).join(', ')} onChange={e=>setEditing({ ...editing, tags: e.target.value.split(',').map(s=>s.trim()).filter(Boolean) })} />
            <div className="grid grid-cols-4 gap-2">
              <input className="px-3 py-2 rounded border" placeholder="camera" value={editing.camera||''} onChange={e=>setEditing({ ...editing, camera: e.target.value })} />
              <input className="px-3 py-2 rounded border" placeholder="lens" value={editing.lens||''} onChange={e=>setEditing({ ...editing, lens: e.target.value })} />
              <input className="px-3 py-2 rounded border" placeholder="f-number" value={editing.fNumber?.toString()||''} onChange={e=>setEditing({ ...editing, fNumber: Number(e.target.value)||undefined })} />
              <input className="px-3 py-2 rounded border" placeholder="ISO" value={editing.iso?.toString()||''} onChange={e=>setEditing({ ...editing, iso: Number(e.target.value)||undefined })} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input className="px-3 py-2 rounded border" placeholder="albumId" value={editing.albumId||''} onChange={e=>setEditing({ ...editing, albumId: e.target.value })} />
              <input className="px-3 py-2 rounded border" placeholder="albumTitle" value={editing.albumTitle||''} onChange={e=>setEditing({ ...editing, albumTitle: e.target.value })} />
            </div>
            <div className="flex items-center gap-4 text-sm">
              <label className="inline-flex items-center gap-2"><input type="checkbox" checked={editing.watermark??true} onChange={e=>setEditing({ ...editing, watermark: e.target.checked })} /> Watermark</label>
              <label className="inline-flex items-center gap-2"><input type="checkbox" checked={editing.overlay??true} onChange={e=>setEditing({ ...editing, overlay: e.target.checked })} /> Overlay</label>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={()=>setEditing(null)} className="rounded px-3 py-2 hover:bg-neutral-100">ยกเลิก</button>
              <button onClick={saveEdit} className="rounded bg-neutral-900 text-white px-4 py-2 hover:bg-neutral-800">บันทึก</button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}



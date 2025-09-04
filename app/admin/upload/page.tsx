'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminUploadPage(){
  const router = useRouter()
  const [files, setFiles] = useState<File[]>([])
  const [alt, setAlt] = useState('')
  const [caption, setCaption] = useState('')
  const [tags, setTags] = useState('')
  const [watermark, setWatermark] = useState(true)
  const [overlay, setOverlay] = useState(true)
  const [camera, setCamera] = useState('')
  const [lens, setLens] = useState('')
  const [fNumber, setFNumber] = useState('')
  const [iso, setIso] = useState('')
  const [albumId, setAlbumId] = useState('')
  const [albumTitle, setAlbumTitle] = useState('')
  const [status, setStatus] = useState('')

  // Auth is enforced by middleware via HttpOnly cookie; no client redirect here

  async function handleSubmit(e: React.FormEvent){
    e.preventDefault()
    if (!files.length) { setStatus('กรุณาเลือกไฟล์'); return }
    setStatus('กำลังอัปโหลด...')

    const form = new FormData()
    files.forEach(f => form.append('file', f))
    form.append('alt', alt)
    form.append('caption', caption)
    form.append('tags', tags)
    form.append('watermark', String(watermark))
    form.append('overlay', String(overlay))
    form.append('camera', camera)
    form.append('lens', lens)
    form.append('fNumber', fNumber)
    form.append('iso', iso)
    form.append('albumId', albumId)
    form.append('albumTitle', albumTitle)

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: form
    })
    if (!res.ok){ setStatus('อัปโหลดล้มเหลว'); return }
    const json = await res.json()
    if (json.success){
      setStatus(`อัปโหลดสำเร็จ! (+${files.length} รูป)`) 
      setFiles([]); setAlt(''); setCaption(''); setTags(''); setWatermark(true); setOverlay(true); setCamera(''); setLens(''); setFNumber(''); setIso(''); setAlbumId(''); setAlbumTitle('')
    } else {
      setStatus('อัปโหลดล้มเหลว')
    }
  }

  useEffect(()=>{
    async function run(){
      if (!files.length) return
      try{
        const exifr = await import('exifr')
        const arrayBuf = await files[0].arrayBuffer()
        const parsed = await (exifr as any).parse(arrayBuf, true)
        if (parsed) {
          setCamera(parsed.Model || parsed.Make || camera)
          setLens(parsed.LensModel || lens)
          const f = parsed.FNumber || (parsed.ApertureValue && Number((parsed.ApertureValue)))
          if (f) setFNumber(String(Number(f)))
        }
      } catch(err){ /* ignore */ }
    }
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files])

  return (
    <section className="py-10 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Upload Photo</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="file" accept="image/*" multiple onChange={e=>setFiles(Array.from(e.target.files||[]))} />
        {files.length > 0 && <p className="text-sm text-neutral-600">เลือก {files.length} ไฟล์</p>}
        <input className="w-full px-4 py-2 rounded-xl border" placeholder="alt (บรรยายภาพ)" value={alt} onChange={e=>setAlt(e.target.value)} />
        <input className="w-full px-4 py-2 rounded-xl border" placeholder="caption (แคปชัน)" value={caption} onChange={e=>setCaption(e.target.value)} />
        <input className="w-full px-4 py-2 rounded-xl border" placeholder="tags (เช่น: Street, ChiangMai)" value={tags} onChange={e=>setTags(e.target.value)} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className="px-4 py-2 rounded-xl border" placeholder="albumId (เช่น tawan-2025-001)" value={albumId} onChange={e=>setAlbumId(e.target.value)} />
          <input className="px-4 py-2 rounded-xl border" placeholder="albumTitle (ชื่ออัลบั้ม)" value={albumTitle} onChange={e=>setAlbumTitle(e.target.value)} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input className="px-4 py-2 rounded-xl border" placeholder="camera" value={camera} onChange={e=>setCamera(e.target.value)} />
          <input className="px-4 py-2 rounded-xl border" placeholder="lens" value={lens} onChange={e=>setLens(e.target.value)} />
          <input className="px-4 py-2 rounded-xl border" placeholder="f-number (เช่น 1.8)" value={fNumber} onChange={e=>setFNumber(e.target.value)} />
        </div>
        <input className="w-full px-4 py-2 rounded-xl border" placeholder="ISO (เช่น 100, 400)" value={iso} onChange={e=>setIso(e.target.value)} />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={watermark} onChange={e=>setWatermark(e.target.checked)} /> Watermark</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={overlay} onChange={e=>setOverlay(e.target.checked)} /> Overlay</label>
        <button className="w-full rounded-xl bg-neutral-900 text-white py-3 font-semibold hover:bg-neutral-800">อัปโหลด</button>
      </form>
      {status && <p className="mt-4 text-sm">{status}</p>}
    </section>
  )
}



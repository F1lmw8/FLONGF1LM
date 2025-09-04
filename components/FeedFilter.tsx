'use client'
import { useState, useMemo } from 'react'

export type FeedItem = {
  id:string; src:string; w:number; h:number; alt?:string;
  date?:string; tags?:string[]; watermark?:boolean; overlay?:boolean;
  camera?: string; lens?: string; fNumber?: number; iso?: number
  albumId?: string; albumTitle?: string
}
export type FilterState = { q:string; tag:string|'' }

export default function FeedFilter({
  allItems, onChange,
}:{
  allItems: FeedItem[];
  onChange: (filtered: FeedItem[], state: FilterState)=>void
}) {
  const [q,setQ] = useState('')
  const [tag,setTag] = useState('')

  const tags = useMemo(()=> {
    const s = new Set<string>()
    allItems.forEach(i => (i.tags||[]).forEach(t=>s.add(t)))
    return Array.from(s).sort()
  }, [allItems])

  function apply(nextQ = q, nextTag = tag){
    const filtered = allItems.filter(i=>{
      const matchQ = nextQ
        ? (i.alt||'').toLowerCase().includes(nextQ.toLowerCase())
           || (i.tags||[]).join(' ').toLowerCase().includes(nextQ.toLowerCase())
        : true
      const matchTag = nextTag ? (i.tags||[]).includes(nextTag) : true
      return matchQ && matchTag
    })
    onChange(filtered, { q: nextQ, tag: nextTag })
  }

  const previewCount = useMemo(()=>{
    const filtered = allItems.filter(i=>{
      const matchQ = q
        ? (i.alt||'').toLowerCase().includes(q.toLowerCase())
           || (i.tags||[]).join(' ').toLowerCase().includes(q.toLowerCase())
        : true
      const matchTag = tag ? (i.tags||[]).includes(tag) : true
      return matchQ && matchTag
    })
    return filtered.length
  }, [allItems, q, tag])

  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-neutral-200 bg-white/70 backdrop-blur px-3 py-3 shadow-sm">
        <div className="relative flex-1 min-w-[220px]">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </span>
          <input
            value={q}
            onChange={e=>{ setQ(e.target.value); apply(e.target.value, tag) }}
            placeholder="ค้นหา (เช่น chiang mai, portrait)"
            className="w-full rounded-xl border border-neutral-200 bg-white pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
          />
        </div>
        <select
          value={tag}
          onChange={e=>{ setTag(e.target.value); apply(q, e.target.value) }}
          className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm"
        >
          <option value="">ทั้งหมด</option>
          {tags.map(t=> <option key={t} value={t}>{t}</option>)}
        </select>
        <button
          type="button"
          onClick={()=>{ setQ(''); setTag(''); apply('', '') }}
          className="rounded-xl px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100 transition"
        >ล้างค่า</button>
        <span className="ml-auto text-xs text-neutral-500">{previewCount} รูป</span>
      </div>
    </div>
  )
}
'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import ImageCard from '@/components/ImageCard'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import type { FeedItem } from './FeedFilter'

export default function FeedGrid({ items }: { items: FeedItem[] }) {
  const sorted = useMemo(() =>
    [...items].sort((a,b)=> (b.date||'').localeCompare(a.date||'')), [items])

  const BATCH = 24
  const [limit, setLimit] = useState(BATCH)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const endRef = useRef<HTMLDivElement|null>(null)

  useEffect(()=>{
    const io = new IntersectionObserver(([e])=>{
      if (e.isIntersecting) setLimit(l => Math.min(l + BATCH, sorted.length))
    }, { rootMargin: '200px' })
    if (endRef.current) io.observe(endRef.current)
    return ()=> io.disconnect()
  }, [sorted.length])

  const visible = sorted.slice(0, limit)

  // Group visible items by albumId; show albumTitle header when available
  const groups = useMemo(()=>{
    const map = new Map<string, { title?:string; items: FeedItem[] }>()
    for (const it of visible){
      const key = it.albumId || it.id
      const g = map.get(key) || { title: it.albumTitle, items: [] as FeedItem[] }
      g.items.push(it)
      map.set(key, g)
    }
    // preserve input order
    const ordered: Array<{ title?:string; items: FeedItem[] }> = []
    const seen = new Set<string>()
    for (const it of visible){
      const key = it.albumId || it.id
      if (seen.has(key)) continue
      seen.add(key)
      const g = map.get(key)!
      ordered.push(g)
    }
    return ordered
  }, [visible])

  // Flat slides for lightbox index mapping
  const flatSlides = useMemo(()=> groups.flatMap(g=> g.items), [groups])

  return (
    <>
      {groups.map((g, gi)=> (
        <section key={gi} className="mb-8 last:mb-0">
          {g.title && <h2 className="text-lg font-semibold mb-3">{g.title}</h2>}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {g.items.map((p) => {
              const idx = flatSlides.findIndex(s=> s.id===p.id)
              return (
                <button key={p.id} className="group w-full text-left" onClick={()=>setOpenIndex(idx)}>
                  <div className="aspect-[2/3] overflow-hidden rounded-lg">
                    <ImageCard
                      src={p.src} w={p.w} h={p.h} alt={p.alt}
                      info={(() => {
                        const camera = p.camera
                        const lensAndF = [p.lens, p.fNumber && `f/${p.fNumber}`, p.iso && `ISO ${p.iso}`].filter(Boolean).map(item => `• ${item}`).join(' ')
                        
                        return [
                          p.alt + (camera ? ` • ${camera}` : ''),
                          lensAndF
                        ].filter(Boolean).join('\n')
                      })()}
                      overlay={p.overlay ?? true}
                      watermark={p.watermark ?? true}
                    />
                  </div>
                </button>
              )
            })}
          </div>
        </section>
      ))}
      <div ref={endRef} className="h-10" />
      {openIndex !== null && (
        <Lightbox
          open
          close={()=>setOpenIndex(null)}
          index={openIndex}
          slides={flatSlides.map(v=>({ src: v.src }))}
        />
      )}
    </>
  )
}
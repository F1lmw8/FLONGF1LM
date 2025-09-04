'use client'
import { useState, useEffect } from 'react'
import FeedFilter, { type FeedItem } from '@/components/FeedFilter'
import FeedGrid from '@/components/FeedGrid'

export default function AllPhotosClient({ initial }:{ initial: FeedItem[] }){
  const [allItems, setAllItems] = useState<FeedItem[]>(initial || [])
  const [items, setItems] = useState<FeedItem[]>(initial || [])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPhotos() {
      try {
        const res = await fetch('/api/feed')
        const json = await res.json()
        const photos = json.items || []
        setAllItems(photos)
        setItems(photos)
      } catch (error) {
        console.error('Error loading photos:', error)
      } finally {
        setLoading(false)
      }
    }
    
    if (initial.length === 0) {
      loadPhotos()
    } else {
      setLoading(false)
    }
  }, [initial])

  if (loading) {
    return (
      <section className="py-8">
        <h1 className="text-2xl font-bold mb-2">All Photos</h1>
        <p className="text-neutral-600 mb-4">กำลังโหลด...</p>
      </section>
    )
  }

  return (
    <section className="py-8">
      <h1 className="text-2xl font-bold mb-2">All Photos</h1>
      <p className="text-neutral-600 mb-4">เลื่อนเพื่อโหลดเพิ่ม • คลิกเพื่อดูเต็มจอ</p>
      <FeedFilter allItems={allItems} onChange={(filtered)=> setItems(filtered)} />
      <FeedGrid items={items} />
    </section>
  )
}





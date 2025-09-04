'use client'
import { useState } from 'react'
import FeedFilter, { type FeedItem } from '@/components/FeedFilter'
import FeedGrid from '@/components/FeedGrid'

export default function AllPhotosClient({ initial }:{ initial: FeedItem[] }){
  const [items, setItems] = useState<FeedItem[]>(initial)
  return (
    <section className="py-8">
      <h1 className="text-2xl font-bold mb-2">All Photos</h1>
      <p className="text-neutral-600 mb-4">เลื่อนเพื่อโหลดเพิ่ม • คลิกเพื่อดูเต็มจอ</p>
      <FeedFilter allItems={initial} onChange={(filtered)=> setItems(filtered)} />
      <FeedGrid items={items} />
    </section>
  )
}





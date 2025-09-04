import AllPhotosClient from '@/components/AllPhotosClient'
import type { FeedItem } from '@/components/FeedFilter'
import { promises as fs } from 'fs'
import path from 'path'

export const metadata = { title: 'All Photos — FILM', description: 'รวมภาพทั้งหมด' }

export default async function AllPhotosPage(){
  const feedPath = path.join(process.cwd(), 'data', 'feed.json')
  const raw = await fs.readFile(feedPath, 'utf8')
  const all = JSON.parse(raw) as FeedItem[]
  return <AllPhotosClient initial={all} />
}
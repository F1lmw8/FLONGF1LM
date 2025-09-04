import AllPhotosClient from '@/components/AllPhotosClient'
import type { FeedItem } from '@/components/FeedFilter'
import { getAllPhotos, initDatabase } from '@/lib/database'

export const metadata = { title: 'All Photos — FILM', description: 'รวมภาพทั้งหมด' }

export default async function AllPhotosPage(){
  try {
    // Initialize database if needed
    await initDatabase()
    
    // Get all photos from database
    const all = await getAllPhotos() as FeedItem[]
    return <AllPhotosClient initial={all} />
  } catch (error) {
    console.error('Error loading photos:', error)
    return <AllPhotosClient initial={[]} />
  }
}
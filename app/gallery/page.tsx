import AllPhotosClient from '@/components/AllPhotosClient'

export const metadata = { title: 'All Photos — FILM', description: 'รวมภาพทั้งหมด' }

export default function AllPhotosPage(){
  return <AllPhotosClient initial={[]} />
}
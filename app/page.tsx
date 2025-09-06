'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

const heroImages = [
  'https://res.cloudinary.com/dsmbionbb/image/upload/v1757027333/portfolio/Tawan-03-09-68/MEITU_20250903_215055571.jpg',
  'https://res.cloudinary.com/dsmbionbb/image/upload/v1757027333/portfolio/Tawan-03-09-68/MEITU_20250903_215141922.jpg',
  // 👉 เพิ่ม Cloudinary URL ได้เรื่อย ๆ
]

export default function Home() {
  const [current, setCurrent] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % heroImages.length)
    }, 5000) // เปลี่ยนรูปทุก 5 วิ

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <section className="py-8">
      <div className="relative rounded-2xl overflow-hidden">
        <div className="relative w-full h-[500px]">
          {heroImages.map((src, i) => (
            <Image
              key={i}
              src={src}
              alt=""
              width={2000}
              height={1200}
              priority={i === 0}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                i === current ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <h1 className="text-3xl md:text-5xl font-bold">FLONGF1LM</h1>
            <p className="mt-2 opacity-90">street • portrait • travel</p>
          </div>
        </div>
      </div>
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        <Card title="Gallery" href="/gallery" desc="รวมรูปภาพทั้งหมด" />
        <Card title="Projects" href="/projects" desc="วางแผนไว้ในอนาคต" />
        <Card title="About" href="/about" desc="ติดต่อร่วมงาน / โพรไฟล์" />
      </div>
    </section>
  )
}

function Card({ title, desc, href }: { title: string; desc: string; href: string }) {
  return (
    <a
      href={href}
      className="block rounded-2xl p-6 bg-white shadow hover:shadow-md transition"
    >
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-neutral-600 mt-2">{desc}</p>
    </a>
  )
}
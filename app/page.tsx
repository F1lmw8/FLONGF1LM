'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

const heroImages = [
  '/uploads/03-09-68/MEITU_20250903_215055571.JPEG',
  '/uploads/03-09-68/MEITU_20250903_215141922.JPEG',
  '/uploads/03-09-68/MEITU_20250903_215321570.JPEG',
]

export default function Home() {
  const [current, setCurrent] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % heroImages.length)
    }, 5000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  return (
    <section className="py-8">
      <div className="relative rounded-2xl overflow-hidden">
        {/* กำหนดความสูงที่นี่ ภาพข้างในจะ fill */}
        <div className="relative w-full h-[500px]">
          {heroImages.map((src, i) => (
            <Image
              key={i}
              src={src}
              alt=""
              fill                  // ✅ ใช้ fill ให้ครอบเต็ม
              priority={i === 0}
              className={`object-cover transition-opacity duration-1000 ${
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
    <a href={href} className="block rounded-2xl p-6 bg-white shadow hover:shadow-md transition">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-neutral-600 mt-2">{desc}</p>
    </a>
  )
}
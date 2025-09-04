'use client'
import Image from 'next/image'
import { useState } from 'react'

type Props = {
  src: string
  w: number
  h: number
  alt?: string
  caption?: string
  info?: string
  overlay?: boolean
  watermark?: boolean
}

export default function ImageCard({ src, w, h, alt='', caption, info, overlay=true, watermark=true }: Props){
  const [loaded, setLoaded] = useState(false)
  return (
    <figure className="relative block w-full h-full rounded-xl bg-neutral-200">
      <div className={`${watermark ? 'relative watermark' : 'relative'} w-full h-full`}>
        <img
          src={src} alt={alt}
          className={`w-full h-full object-cover transition duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={()=>setLoaded(true)}
          loading="lazy"
        />
        {overlay && <span className="overlay absolute inset-0" />}
        {info && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[4] p-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="rounded-lg bg-black/55 text-white text-xs leading-snug px-3 py-2 shadow">
              <div className="whitespace-pre-line">
                {info}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* caption removed to avoid extra grid blocks; using hover info overlay instead */}
    </figure>
  )
}

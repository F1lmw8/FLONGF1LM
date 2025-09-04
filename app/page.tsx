import Image from 'next/image'

export default function Home() {
  return (
    <section className="py-8">
      <div className="relative rounded-2xl overflow-hidden">
        <Image
          src="/images/hero.jpg"
          alt="Hero"
          width={2000} height={1200} priority
          className="w-full h-auto object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 text-white">
          <h1 className="text-3xl md:text-5xl font-bold">FLONGF1LM</h1>
          <p className="mt-2 opacity-90">street • portrait • travel</p>
        </div>
      </div>
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        <Card title="Gallery" href="/gallery" desc="ภาพคัดพิเศษ 12–24 ใบ โทนคุมเดียวกัน" />
        <Card title="Projects" href="/projects" desc="โปรเจกต์เล่าเรื่องเป็นชุด ๆ" />
        <Card title="About" href="/about" desc="ติดต่อร่วมงาน / โพรไฟล์" />
      </div>
    </section>
  )
}

function Card({title, desc, href}:{title:string, desc:string, href:string}){
  return (
    <a href={href} className="block rounded-2xl p-6 bg-white shadow hover:shadow-md transition">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-neutral-600 mt-2">{desc}</p>
    </a>
  )
}

export const metadata = {
  title: 'About — FILM',
  description: 'About & Contact'
}

export default function AboutPage(){
  return (
    <section className="py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">About</h1>
      <p className="text-neutral-700">
        Apichai “Film” Chomthong — Thailand-based photographer. ชอบสตรีท โทนอบอุ่น เล่าเรื่องจากแสงและเงา.
      </p>
      <p className="mt-3">
        Instagram: <a className="underline" href="https://instagram.com/f1lm_w8" target="_blank">f1lm_w8</a>
      </p>
      <p className="mt-1">
        Email: <a className="underline" href="mailto:you@example.com">you@example.com</a>
      </p>
      <p className="mt-6 text-sm text-neutral-500">
        * รูปบนเว็บนี้ถูกปกป้องด้วยลายน้ำ/overlay เบื้องต้น และมีข้อกำหนดการใช้งาน ห้ามรีอัปโหลดหรือใช้เชิงพาณิชย์โดยไม่ได้รับอนุญาต
      </p>
    </section>
  )
}

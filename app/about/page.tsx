export const metadata = {
  title: 'About — FILM',
  description: 'About & Contact'
}

export default function AboutPage(){
  return (
    <section className="py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">About</h1>
      <div className="text-neutral-700 space-y-4">
        <p className="text-lg">
          ฮะฮัยยสวัสดีครับ ผมฟิล์ม ยินดีต้องรับเข้าสู่ &quot;ฟลงฟิล์ม&quot; 📸
        </p>
        <p>
          ผมเป็นคนชอบถ่ายรูปคนหนึ่ง แต่ไม่ชอบโดนถ่ายรูป แฮะ ๆ 😅 ผมยังเป็นมือใหม่ในวงการนี้และยังแต่งสีไม่เป็นเลยยย ฮื่อออ 😭 ยังไงก็ขอฝากเนื้อฝากตัวในวงการนี้ด้วยนะครับบบบ 🙏
        </p>
        <div className="mt-6 space-y-2">
          <p>
            📷 Instagram: <a className="underline hover:text-neutral-900" href="https://instagram.com/f1lm_w8" target="_blank">f1lm_w8</a>
          </p>
          <p>
            📧 Email: <a className="underline hover:text-neutral-900" href="mailto:manmanwer3344656@gmail.com">manmanwer3344656@gmail.com</a>
          </p>
        </div>
        <div className="mt-8 p-4 bg-neutral-50 rounded-lg border-l-4 border-neutral-300">
  <p className="text-sm text-neutral-600">
    ⚠️ <strong>ข้อกำหนดการใช้งาน</strong><br />
    ภาพถ่ายทั้งหมดบนเว็บไซต์นี้จัดทำขึ้นเพื่อการนำเสนอผลงานเท่านั้น
    และได้รับการปกป้องด้วยลายน้ำ 🔒 <br />
    ห้ามทำการดาวน์โหลด รีอัปโหลด ดัดแปลง
    หรือใช้ในเชิงพาณิชย์โดยไม่ได้รับอนุญาตอย่างเป็นลายลักษณ์อักษรจากเจ้าของผลงาน 🚫
  </p>
</div>
      </div>
    </section>
  )
}

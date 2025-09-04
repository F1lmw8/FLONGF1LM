import { cookies } from 'next/headers'

export default async function AdminNavServer(){
  const cookieStore = await cookies()
  const isAuthed = cookieStore.get('admin')?.value === '1'
  if (!isAuthed) return null
  return (
    <div className="hidden sm:flex items-center gap-1 text-sm">
      <a className="rounded-full px-3 py-2 hover:bg-neutral-100 transition" href="/admin/upload">Upload</a>
      <a className="rounded-full px-3 py-2 hover:bg-neutral-100 transition" href="/admin/manage">Manage</a>
      <form action="/api/logout" method="post">
        <button type="submit" className="rounded-full px-3 py-2 hover:bg-neutral-100 transition">Logout</button>
      </form>
    </div>
  )
}



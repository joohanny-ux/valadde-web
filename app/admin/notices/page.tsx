import { supabase } from '@/lib/supabase'
import NoticeList from './NoticeList'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminNoticesPage() {
  const { data: notices, error } = await supabase
    .from('notices')
    .select('*')
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    return <p className="text-red-600">오류: {error.message}</p>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">공지사항 관리</h1>
        <Link
          href="/admin/notices/new"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          공지 추가
        </Link>
      </div>
      <NoticeList notices={notices ?? []} />
    </div>
  )
}

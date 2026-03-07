import { supabase } from '@/lib/supabase'
import NoticeForm from '../NoticeForm'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function NoticeEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { data: notice, error } = await supabase
    .from('notices')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !notice) notFound()

  return (
    <div>
      <Link href="/admin/notices" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
        ← 목록으로
      </Link>
      <h1 className="text-2xl font-bold mb-6">공지 수정</h1>
      <NoticeForm notice={notice} />
    </div>
  )
}

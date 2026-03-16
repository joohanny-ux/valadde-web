import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'

export default async function NoticeDetailPage({
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
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Link href="/notice" className="mb-6 inline-block text-sm text-neutral-500 hover:text-neutral-900">
        ← 목록으로
      </Link>
      <h1 className="mb-4 text-4xl font-semibold tracking-tight text-neutral-900">{notice.title}</h1>
      <p className="mb-8 text-sm text-neutral-500">
        {new Date(notice.created_at).toLocaleDateString('ko-KR')}
      </p>
      <div className="prose max-w-none whitespace-pre-wrap text-neutral-700">
        {notice.content || ''}
      </div>
    </div>
  )
}

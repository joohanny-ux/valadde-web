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
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/notice" className="text-sm text-abu-pink hover:underline mb-6 inline-block">
        ← 목록으로
      </Link>
      <h1 className="font-serif text-2xl md:text-3xl font-bold mb-4">{notice.title}</h1>
      <p className="text-sm text-white/60 mb-8">
        {new Date(notice.created_at).toLocaleDateString('ko-KR')}
      </p>
      <div className="prose prose-invert max-w-none whitespace-pre-wrap text-white/80">
        {notice.content || ''}
      </div>
    </div>
  )
}

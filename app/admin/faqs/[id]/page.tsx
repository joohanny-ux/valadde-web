import { supabase } from '@/lib/supabase'
import FaqForm from '../FaqForm'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function FaqEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { data: faq, error } = await supabase
    .from('faqs')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !faq) notFound()

  return (
    <div>
      <Link href="/admin/faqs" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
        ← 목록으로
      </Link>
      <h1 className="text-2xl font-bold mb-6">FAQ 수정</h1>
      <FaqForm faq={faq} />
    </div>
  )
}

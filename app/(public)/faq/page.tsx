import FaqClient from './FaqClient'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function FaqPage() {
  const { data: faqs, error } = await supabase
    .from('faqs')
    .select('id, question, answer, display_order')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: true })

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="mb-6 text-3xl font-semibold tracking-tight text-neutral-900">자주 묻는 질문</h1>
        <p className="text-red-600">FAQ를 불러올 수 없습니다. ({error.message})</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-10 text-4xl font-semibold tracking-tight text-neutral-900">자주 묻는 질문</h1>
      <FaqClient initialFaqs={faqs ?? []} />
    </div>
  )
}

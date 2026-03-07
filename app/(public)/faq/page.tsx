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
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="font-serif text-2xl font-bold mb-6">자주 묻는 질문</h1>
        <p className="text-abu-pink">FAQ를 불러올 수 없습니다. ({error.message})</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-serif text-2xl md:text-3xl font-bold mb-10">자주 묻는 질문</h1>
      <FaqClient initialFaqs={faqs ?? []} />
    </div>
  )
}

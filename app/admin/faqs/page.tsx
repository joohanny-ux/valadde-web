import { supabase } from '@/lib/supabase'
import FaqList from './FaqList'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminFaqsPage() {
  const { data: faqs, error } = await supabase
    .from('faqs')
    .select('*')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: true })

  if (error) {
    return <p className="text-red-600">오류: {error.message}</p>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">FAQ 관리</h1>
        <Link
          href="/admin/faqs/new"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          FAQ 추가
        </Link>
      </div>
      <FaqList faqs={faqs ?? []} />
    </div>
  )
}

import { supabase } from '@/lib/supabase'
import OrderDetailClient from './OrderDetailClient'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { data: order, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !order) notFound()

  return (
    <div>
      <Link href="/admin/orders" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
        ← 목록으로
      </Link>
      <h1 className="text-2xl font-bold mb-6">주문 상세</h1>
      <OrderDetailClient order={order} />
    </div>
  )
}

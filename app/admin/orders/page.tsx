import { supabase } from '@/lib/supabase'
import OrderList from './OrderList'
import Link from 'next/link'

export default async function AdminOrdersPage() {
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) {
    return <p className="text-red-600">오류: {error.message}</p>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">주문 관리</h1>
      </div>
      <OrderList orders={orders ?? []} />
    </div>
  )
}

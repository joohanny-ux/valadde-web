import { supabase } from '@/lib/supabase'
import SaleRequestList from './SaleRequestList'

export default async function AdminSaleRequestsPage() {
  const { data: requests, error } = await supabase
    .from('sale_requests')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return <p className="text-red-600">오류: {error.message}</p>
  }

  const productIds = Array.from(new Set((requests ?? []).map((r) => r.product_id).filter(Boolean)))
  const { data: products } = productIds.length > 0
    ? await supabase.from('products').select('id, name').in('id', productIds)
    : { data: [] }
  const productMap = Object.fromEntries((products ?? []).map((p) => [p.id, p.name]))

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">판매 의사 신청</h1>
      <SaleRequestList requests={requests ?? []} productMap={productMap} />
    </div>
  )
}

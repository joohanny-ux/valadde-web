import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default async function AdminDashboard() {
  const [{ count: productCount }, { count: brandCount }, { count: categoryCount }] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('brands').select('*', { count: 'exact', head: true }),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
  ])

  let orderCount = 0
  const orderRes = await supabase.from('orders').select('*', { count: 'exact', head: true })
  if (!orderRes.error) orderCount = orderRes.count ?? 0

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">대시보드</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">브랜드 수</p>
          <p className="text-2xl font-bold">{brandCount ?? 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">카테고리 수</p>
          <p className="text-2xl font-bold">{categoryCount ?? 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">상품 수</p>
          <p className="text-2xl font-bold">{productCount ?? 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">주문 수</p>
          <p className="text-2xl font-bold">{orderCount}</p>
        </div>
      </div>
      <div className="flex gap-3">
        <Link
          href="/admin/orders"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          주문 목록 →
        </Link>
        <Link
          href="/admin/products"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          상품 목록 보기 →
        </Link>
      </div>
    </div>
  )
}

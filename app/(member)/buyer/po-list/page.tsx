'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createSupabaseClient } from '@/lib/supabase-client'

type Order = {
  id: string
  order_type: string
  status: string
  total_amount: number | null
  created_at: string
}

const STATUS_LABEL: Record<string, string> = {
  submitted: '제출됨',
  confirmed: '확인됨',
  invoiced: '인보이스',
  shipped: '배송중',
  cancelled: '취소',
}

export default function BuyerPOListPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createSupabaseClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      const res = await fetch('/api/orders/my', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setOrders((Array.isArray(data) ? data : []).filter((o: Order) => o.order_type === 'po'))
      }
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-10">로딩 중...</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">PO 목록</h1>
      <p className="text-gray-600 mb-8">제출한 구매 주문서(PO) 목록입니다.</p>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 border text-center text-gray-500">
          <p>제출한 PO가 없습니다.</p>
          <Link href="/buyer/po" className="mt-4 inline-block text-blue-600 hover:underline">
            PO 작성하기 →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden border">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium">PO 번호</th>
                <th className="px-4 py-2 text-center text-sm font-medium">상태</th>
                <th className="px-4 py-2 text-right text-sm font-medium">금액</th>
                <th className="px-4 py-2 text-left text-sm font-medium">등록일</th>
                <th className="px-4 py-2 text-left text-sm font-medium">작업</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 font-mono text-sm">{o.id.slice(0, 8)}…</td>
                  <td className="px-4 py-2 text-center">
                    <span className="text-sm px-2 py-0.5 rounded bg-gray-100">
                      {STATUS_LABEL[o.status] ?? o.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right">
                    {o.total_amount != null ? `${o.total_amount.toLocaleString()}원` : '-'}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-500">
                    {new Date(o.created_at).toLocaleDateString('ko-KR')}
                  </td>
                  <td className="px-4 py-2">
                    <Link href={`/buyer/orders/${o.id}`} className="text-blue-600 hover:underline text-sm">
                      상세
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

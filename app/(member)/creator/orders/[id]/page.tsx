'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createSupabaseClient } from '@/lib/supabase-client'

type Order = {
  id: string
  status: string
  total_amount: number | null
  created_at: string
  items: { name?: string; qty?: number; unit_price?: number }[]
}

const STATUS_LABEL: Record<string, string> = {
  submitted: '제출됨',
  confirmed: '확인됨',
  invoiced: '인보이스',
  shipped: '배송중',
  cancelled: '취소',
}

export default function CreatorOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const { id } = await params
      const supabase = createSupabaseClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      const res = await fetch(`/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      if (cancelled) return
      if (res.ok) {
        const data = await res.json()
        setOrder(data)
      }
      setLoading(false)
    })()
    return () => { cancelled = true }
  }, [params])

  if (loading || !order) return <div className="max-w-4xl mx-auto px-4 py-10">로딩 중...</div>

  const items = (order.items ?? []) as { name?: string; qty?: number; unit_price?: number }[]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link href="/creator/orders" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
        ← 목록으로
      </Link>
      <h1 className="text-2xl font-bold mb-6">주문 상세</h1>

      <div className="bg-white rounded-lg shadow p-6 border space-y-4">
        <p className="text-sm text-gray-500">주문 ID</p>
        <p className="font-mono">{order.id}</p>
        <p className="text-sm text-gray-500">상태</p>
        <p className="font-medium">{STATUS_LABEL[order.status] ?? order.status}</p>
        <p className="text-sm text-gray-500">주문 상품</p>
        <table className="w-full text-sm border">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-3 py-2 text-left">상품</th>
              <th className="px-3 py-2 text-right">수량</th>
              <th className="px-3 py-2 text-right">단가</th>
              <th className="px-3 py-2 text-right">금액</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={i} className="border-t">
                <td className="px-3 py-2">{it.name ?? '-'}</td>
                <td className="px-3 py-2 text-right">{it.qty ?? 0}</td>
                <td className="px-3 py-2 text-right">
                  {it.unit_price != null ? it.unit_price.toLocaleString() : '-'}
                </td>
                <td className="px-3 py-2 text-right">
                  {((it.qty ?? 0) * (it.unit_price ?? 0)).toLocaleString()}원
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-right font-semibold">
          합계: {order.total_amount != null ? `${order.total_amount.toLocaleString()}원` : '-'}
        </p>
        <p className="text-sm text-gray-500">
          등록일: {new Date(order.created_at).toLocaleString('ko-KR')}
        </p>
      </div>
    </div>
  )
}

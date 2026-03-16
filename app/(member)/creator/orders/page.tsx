'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createSupabaseClient } from '@/lib/supabase-client'
import MemberPageIntro from '@/components/member/MemberPageIntro'
import MemberStatusBadge from '@/components/member/MemberStatusBadge'

type Order = {
  id: string
  status: string
  total_amount: number | null
  created_at: string
}

export default function CreatorOrdersPage() {
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
        setOrders(Array.isArray(data) ? data : [])
      }
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="mx-auto max-w-6xl px-4 py-10">로딩 중...</div>

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <MemberPageIntro
        title="Deals"
        description="협상 이후 생성된 주문, 인보이스, 후속 상태를 Deals 보드 형식으로 확인할 수 있습니다."
      />

      {orders.length === 0 ? (
        <div className="rounded-[28px] border border-neutral-200 bg-white p-8 text-center text-neutral-500 shadow-sm">
          <p>아직 진행 중인 딜이 없습니다.</p>
          <Link href="/products" className="mt-4 inline-block text-neutral-900 hover:underline">
            상품 둘러보기 →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <article
              key={order.id}
              className="grid gap-4 rounded-[28px] border border-neutral-200 bg-white p-6 shadow-sm md:grid-cols-[1.2fr_0.8fr_180px]"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">Order</p>
                <h2 className="mt-2 text-lg font-semibold text-neutral-900">{order.id.slice(0, 8)}...</h2>
                <p className="mt-2 text-sm text-neutral-500">
                  생성일 {new Date(order.created_at).toLocaleDateString('ko-KR')}
                </p>
              </div>

              <div className="space-y-3">
                <MemberStatusBadge status={order.status} />
                <p className="text-sm text-neutral-600">
                  {order.total_amount != null ? `${order.total_amount.toLocaleString()}원` : '금액 미정'}
                </p>
              </div>

              <div className="flex items-center md:justify-end">
                <Link
                  href={`/creator/orders/${order.id}`}
                  className="inline-flex rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-50"
                >
                  상세 보기
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

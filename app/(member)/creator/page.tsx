'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import MemberPageIntro from '@/components/member/MemberPageIntro'

export default function CreatorDashboardPage() {
  const [saleRequestCount, setSaleRequestCount] = useState(0)
  const [orderCount, setOrderCount] = useState(0)

  useEffect(() => {
    import('@/lib/supabase-client').then((m) => {
      const supabase = m.createSupabaseClient()
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) return
        Promise.all([
          fetch('/api/sale-requests/my', { headers: { Authorization: `Bearer ${session.access_token}` } }),
          fetch('/api/orders/my', { headers: { Authorization: `Bearer ${session.access_token}` } }),
        ]).then(([srRes, ordRes]) => {
          if (srRes.ok) srRes.json().then((d) => setSaleRequestCount(Array.isArray(d) ? d.length : 0))
          if (ordRes.ok) ordRes.json().then((d) => setOrderCount(Array.isArray(d) ? d.length : 0))
        })
      })
    })
  }, [])

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <MemberPageIntro
        title="Deals"
        description="진행 중인 딜, 판매 의사 신청, 후속 문서 흐름을 한곳에서 관리할 수 있도록 크리에이터 워크스페이스를 정리했습니다."
      />

      <div className="mb-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Selected Products</h2>
          <p className="mt-3 text-3xl font-semibold text-neutral-900">{saleRequestCount}</p>
          <p className="mt-2 text-sm text-neutral-500">판매 의사 신청 또는 검토 중인 상품 수</p>
          <Link href="/creator/sale-request" className="mt-5 inline-block text-sm font-medium text-neutral-900 hover:underline">
            Selected Products 열기
          </Link>
        </div>

        <div className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Active Workflow</h2>
          <p className="mt-3 text-3xl font-semibold text-neutral-900">{orderCount}</p>
          <p className="mt-2 text-sm text-neutral-500">주문, 인보이스, 결제 추적 대상 건수</p>
          <Link href="/creator/orders" className="mt-5 inline-block text-sm font-medium text-neutral-900 hover:underline">
            Deals 보드 열기
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-900">현재 우선 작업</h2>
          <div className="mt-5 grid gap-4">
            <div className="rounded-2xl bg-neutral-50 p-4">
              <p className="text-sm font-medium text-neutral-900">1. Selected Products 정리</p>
              <p className="mt-2 text-sm leading-6 text-neutral-600">
                상품별 요청사항과 수량 계획을 정리한 뒤 딜 요청을 제출하세요.
              </p>
            </div>
            <div className="rounded-2xl bg-neutral-50 p-4">
              <p className="text-sm font-medium text-neutral-900">2. Deals 후속 조치</p>
              <p className="mt-2 text-sm leading-6 text-neutral-600">
                제출 이후에는 주문, 견적, 인보이스 흐름을 `Deals` 화면에서 추적합니다.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-900">빠른 링크</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/creator/sale-request"
              className="rounded-full bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-700"
            >
              판매 의사 신청
            </Link>
            <Link
              href="/creator/orders"
              className="rounded-full border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50"
            >
              주문 목록
            </Link>
            <Link
              href="/products"
              className="rounded-full border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50"
            >
              상품 둘러보기
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

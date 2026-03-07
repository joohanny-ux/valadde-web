'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

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
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">크리에이터 대시보드</h1>
      <p className="text-gray-600 mb-8">내 협상·주문 요약을 한눈에 확인하세요.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        <div className="bg-white rounded-lg shadow p-6 border">
          <h2 className="font-semibold text-gray-800 mb-2">판매 의사 신청</h2>
          <p className="text-2xl font-bold text-blue-600">{saleRequestCount}</p>
          <p className="text-sm text-gray-500 mt-1">건 (pending 등)</p>
          <Link href="/creator/sale-request" className="mt-3 inline-block text-sm text-blue-600 hover:underline">
            판매 의사 신청 →
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border">
          <h2 className="font-semibold text-gray-800 mb-2">내 주문</h2>
          <p className="text-2xl font-bold text-blue-600">{orderCount}</p>
          <p className="text-sm text-gray-500 mt-1">건</p>
          <Link href="/creator/orders" className="mt-3 inline-block text-sm text-blue-600 hover:underline">
            주문 목록 →
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 border">
        <h2 className="font-semibold text-gray-800 mb-3">빠른 링크</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/creator/sale-request"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            판매 의사 신청
          </Link>
          <Link
            href="/creator/orders"
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            주문 목록
          </Link>
          <Link
            href="/products"
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            상품 둘러보기
          </Link>
        </div>
      </div>
    </div>
  )
}

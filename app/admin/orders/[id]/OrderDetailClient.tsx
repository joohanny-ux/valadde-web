'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Order = {
  id: string
  user_id: string
  user_type: string
  order_type: string
  status: string
  total_amount: number | null
  memo: string | null
  created_at: string
  items: { product_id?: string; name?: string; qty?: number; unit_price?: number }[]
}

const STATUS_OPTIONS = [
  { value: 'submitted', label: '제출됨' },
  { value: 'confirmed', label: '확인됨' },
  { value: 'invoiced', label: '인보이스' },
  { value: 'shipped', label: '배송중' },
  { value: 'cancelled', label: '취소' },
]

export default function OrderDetailClient({ order }: { order: Order }) {
  const router = useRouter()
  const [status, setStatus] = useState(order.status)
  const [memo, setMemo] = useState(order.memo ?? '')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  async function handleSave() {
    setSaving(true)
    setMsg('')
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, memo }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || '저장 실패')
      }
      setMsg('저장되었습니다.')
      router.refresh()
    } catch (err) {
      setMsg(err instanceof Error ? err.message : '오류')
    } finally {
      setSaving(false)
    }
  }

  const items = (order.items ?? []) as { product_id?: string; name?: string; qty?: number; unit_price?: number }[]

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-2xl space-y-6">
      <div>
        <p className="text-sm text-gray-500">주문 ID</p>
        <p className="font-mono text-sm">{order.id}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">유형</p>
        <p>
          {order.order_type === 'po' ? 'PO' : '주문'} · {order.user_type === 'creator' ? '크리에이터' : '바이어'}
        </p>
      </div>
      <div>
        <p className="text-sm text-gray-500 mb-2">주문 상품</p>
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
                <td className="px-3 py-2">{it.name ?? it.product_id ?? '-'}</td>
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
        <p className="mt-2 text-right font-semibold">
          합계: {order.total_amount != null ? `${order.total_amount.toLocaleString()}원` : '-'}
        </p>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">상태</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">메모</label>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          className="w-full px-3 py-2 border rounded h-20"
        />
      </div>
      {msg && <p className={`text-sm ${msg.includes('오류') ? 'text-red-600' : 'text-green-600'}`}>{msg}</p>}
      <button
        onClick={handleSave}
        disabled={saving}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? '저장 중...' : '저장'}
      </button>
    </div>
  )
}

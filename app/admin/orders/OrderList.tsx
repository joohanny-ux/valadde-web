'use client'

import Link from 'next/link'

type Order = {
  id: string
  user_id: string
  user_type: string
  order_type: string
  status: string
  total_amount: number | null
  created_at: string
  items: { product_id?: string; name?: string; qty?: number; unit_price?: number }[]
}

const STATUS_LABEL: Record<string, string> = {
  draft: '임시저장',
  submitted: '제출됨',
  confirmed: '확인됨',
  invoiced: '인보이스',
  shipped: '배송중',
  cancelled: '취소',
}

export default function OrderList({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
        <p>등록된 주문이 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium">주문번호</th>
            <th className="px-4 py-2 text-left text-sm font-medium">유형</th>
            <th className="px-4 py-2 text-center text-sm font-medium">상태</th>
            <th className="px-4 py-2 text-right text-sm font-medium">금액</th>
            <th className="px-4 py-2 text-left text-sm font-medium">등록일</th>
            <th className="px-4 py-2 text-left text-sm font-medium">작업</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2 text-sm font-mono">{o.id.slice(0, 8)}…</td>
              <td className="px-4 py-2 text-sm">
                {o.order_type === 'po' ? 'PO' : '주문'} / {o.user_type === 'creator' ? '크리에이터' : '바이어'}
              </td>
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
                <Link href={`/admin/orders/${o.id}`} className="text-blue-600 hover:underline text-sm">
                  상세
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

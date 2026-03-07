'use client'

import { useState } from 'react'

type SaleRequest = {
  id: string
  user_id: string
  product_id: string
  message: string | null
  status: string
  created_at: string
}

const STATUS_LABEL: Record<string, string> = {
  pending: '대기',
  approved: '승인',
  rejected: '거절',
}

export default function SaleRequestList({
  requests,
  productMap,
}: {
  requests: SaleRequest[]
  productMap: Record<string, string>
}) {
  const [msg, setMsg] = useState('')

  if (requests.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
        <p>판매 의사 신청이 없습니다.</p>
      </div>
    )
  }

  return (
    <div>
      {msg && <p className="text-sm text-green-600 mb-4">{msg}</p>}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium">등록일</th>
              <th className="px-4 py-2 text-left text-sm font-medium">상품</th>
              <th className="px-4 py-2 text-left text-sm font-medium">메시지</th>
              <th className="px-4 py-2 text-center text-sm font-medium">상태</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-500">
                  {new Date(r.created_at).toLocaleString('ko-KR')}
                </td>
                <td className="px-4 py-2">
                  <span className="font-medium">{productMap[r.product_id] ?? r.product_id}</span>
                </td>
                <td className="px-4 py-2 text-sm max-w-xs truncate">{r.message || '-'}</td>
                <td className="px-4 py-2 text-center">
                  <span className="text-sm px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                    {STATUS_LABEL[r.status] ?? r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'

type Brand = {
  id: string
  name: string
  name_kr: string | null
  slug: string
  logo_url: string | null
  is_active: boolean | null
  product_count: number | null
  display_order: number | null
}

export default function BrandList({ brands: initial }: { brands: Brand[] }) {
  const [brands, setBrands] = useState(initial)
  const [msg, setMsg] = useState('')

  async function toggleActive(id: string, isActive: boolean) {
    const res = await fetch(`/api/brands/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !isActive }),
    })
    if (!res.ok) {
      setMsg('변경 실패')
      return
    }
    setBrands((prev) => prev.map((b) => (b.id === id ? { ...b, is_active: !isActive } : b)))
    setMsg('저장됨')
    setTimeout(() => setMsg(''), 2000)
  }

  return (
    <div>
      {msg && <p className="text-sm text-green-600 mb-4">{msg}</p>}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium">ID</th>
              <th className="px-4 py-2 text-left text-sm font-medium">이름</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Slug</th>
              <th className="px-4 py-2 text-center text-sm font-medium">상품 수</th>
              <th className="px-4 py-2 text-center text-sm font-medium">노출</th>
              <th className="px-4 py-2 text-left text-sm font-medium">작업</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((b) => (
              <tr key={b.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-500">{b.id}</td>
                <td className="px-4 py-2 font-medium">{b.name}</td>
                <td className="px-4 py-2 text-sm">{b.slug}</td>
                <td className="px-4 py-2 text-center">{b.product_count ?? 0}</td>
                <td className="px-4 py-2 text-center">
                  <button
                    type="button"
                    onClick={() => toggleActive(b.id, b.is_active ?? true)}
                    className={`text-sm px-2 py-1 rounded ${b.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}
                  >
                    {b.is_active ? 'O' : 'X'}
                  </button>
                </td>
                <td className="px-4 py-2">
                  <Link href={`/admin/brands/${b.id}`} className="text-blue-600 hover:underline text-sm">
                    수정
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <Link href="/admin/brands/new" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          새 브랜드 추가
        </Link>
      </div>
    </div>
  )
}

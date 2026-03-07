'use client'

import { useState } from 'react'
import Link from 'next/link'

type Faq = {
  id: string
  question: string
  answer: string
  display_order: number | null
}

export default function FaqList({ faqs: initial }: { faqs: Faq[] }) {
  const [faqs, setFaqs] = useState(initial)
  const [msg, setMsg] = useState('')

  async function handleDelete(id: string) {
    if (!confirm('삭제하시겠습니까?')) return
    const res = await fetch(`/api/faqs/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      setMsg('삭제 실패')
      return
    }
    setFaqs((prev) => prev.filter((f) => f.id !== id))
    setMsg('삭제됨')
    setTimeout(() => setMsg(''), 2000)
  }

  if (faqs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
        <p>등록된 FAQ가 없습니다.</p>
        <Link href="/admin/faqs/new" className="mt-4 inline-block text-blue-600 hover:underline">
          FAQ 추가하기
        </Link>
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
              <th className="px-4 py-2 text-center text-sm font-medium w-16">순서</th>
              <th className="px-4 py-2 text-left text-sm font-medium">질문</th>
              <th className="px-4 py-2 text-left text-sm font-medium">작업</th>
            </tr>
          </thead>
          <tbody>
            {faqs.map((f) => (
              <tr key={f.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2 text-center text-sm">{f.display_order ?? 0}</td>
                <td className="px-4 py-2 font-medium line-clamp-1">{f.question}</td>
                <td className="px-4 py-2 space-x-2">
                  <Link href={`/admin/faqs/${f.id}`} className="text-blue-600 hover:underline text-sm">
                    수정
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(f.id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Notice = {
  id: string
  title: string
  is_pinned: boolean | null
  created_at: string
}

export default function NoticeList({ notices: initial }: { notices: Notice[] }) {
  const router = useRouter()
  const [notices, setNotices] = useState(initial)
  const [msg, setMsg] = useState('')

  async function handleDelete(id: string) {
    if (!confirm('삭제하시겠습니까?')) return
    const res = await fetch(`/api/notices/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      setMsg('삭제 실패')
      return
    }
    setNotices((prev) => prev.filter((n) => n.id !== id))
    setMsg('삭제됨')
    setTimeout(() => setMsg(''), 2000)
  }

  if (notices.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
        <p>등록된 공지가 없습니다.</p>
        <Link href="/admin/notices/new" className="mt-4 inline-block text-blue-600 hover:underline">
          공지 추가하기
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
              <th className="px-4 py-2 text-left text-sm font-medium">제목</th>
              <th className="px-4 py-2 text-center text-sm font-medium">고정</th>
              <th className="px-4 py-2 text-left text-sm font-medium">등록일</th>
              <th className="px-4 py-2 text-left text-sm font-medium">작업</th>
            </tr>
          </thead>
          <tbody>
            {notices.map((n) => (
              <tr key={n.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2 font-medium">{n.title}</td>
                <td className="px-4 py-2 text-center">{n.is_pinned ? '✓' : '-'}</td>
                <td className="px-4 py-2 text-sm text-gray-500">
                  {new Date(n.created_at).toLocaleDateString('ko-KR')}
                </td>
                <td className="px-4 py-2 space-x-2">
                  <Link href={`/admin/notices/${n.id}`} className="text-blue-600 hover:underline text-sm">
                    수정
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(n.id)}
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

'use client'

import { useState } from 'react'

type Faq = { id: string; question: string; answer: string }

export default function FaqClient({ initialFaqs }: { initialFaqs: Faq[] }) {
  const [q, setQ] = useState('')
  const [faqs, setFaqs] = useState(initialFaqs)
  const [searching, setSearching] = useState(false)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!q.trim()) {
      setFaqs(initialFaqs)
      return
    }
    setSearching(true)
    try {
      const res = await fetch(`/api/faqs?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setFaqs(Array.isArray(data) ? data : [])
    } finally {
      setSearching(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSearch} className="mb-10">
        <div className="flex gap-2">
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="검색어 입력"
            className="flex-1 rounded-2xl border border-neutral-300 px-4 py-3 text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={searching}
            className="rounded-full bg-neutral-900 px-4 py-2 text-white hover:bg-neutral-700 disabled:opacity-50"
          >
            검색
          </button>
          {q && (
            <button
              type="button"
              onClick={() => {
                setQ('')
                setFaqs(initialFaqs)
              }}
              className="rounded-full border border-neutral-300 px-4 py-2 text-neutral-700 hover:bg-neutral-50"
            >
              초기화
            </button>
          )}
        </div>
      </form>

      <ul className="overflow-hidden rounded-[28px] border border-neutral-200 divide-y divide-neutral-200 bg-white shadow-sm">
        {faqs.length === 0 ? (
          <li className="p-8 text-center text-neutral-500">
            {q ? '검색 결과가 없습니다.' : '등록된 FAQ가 없습니다.'}
          </li>
        ) : (
          faqs.map((faq) => (
            <li key={faq.id} className="p-5">
              <p className="font-medium text-neutral-900">{faq.question}</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-neutral-600">{faq.answer}</p>
            </li>
          ))
        )}
      </ul>
    </>
  )
}

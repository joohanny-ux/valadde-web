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
            className="flex-1 px-3 py-2 bg-abu-charcoal border border-abu-gray rounded text-white placeholder-white/40 focus:outline-none focus:border-abu-pink/50"
          />
          <button
            type="submit"
            disabled={searching}
            className="px-4 py-2 bg-abu-pink text-abu-dark rounded hover:bg-abu-pink-dark font-medium disabled:opacity-50"
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
              className="px-4 py-2 border border-abu-gray rounded hover:bg-abu-gray/30 text-white/90"
            >
              초기화
            </button>
          )}
        </div>
      </form>

      <ul className="divide-y divide-abu-gray border border-abu-gray rounded-lg overflow-hidden">
        {faqs.length === 0 ? (
          <li className="p-8 text-center text-white/60">
            {q ? '검색 결과가 없습니다.' : '등록된 FAQ가 없습니다.'}
          </li>
        ) : (
          faqs.map((faq) => (
            <li key={faq.id} className="p-4">
              <p className="font-medium">{faq.question}</p>
              <p className="mt-2 text-white/70 text-sm whitespace-pre-wrap">{faq.answer}</p>
            </li>
          ))
        )}
      </ul>
    </>
  )
}

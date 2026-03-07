'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase-client'

type Product = { id: string; name: string }

export default function SaleRequestPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const productId = searchParams.get('productId')
  const [products, setProducts] = useState<Product[]>([])
  const [selectedId, setSelectedId] = useState(productId ?? '')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    async function load() {
      const supabase = createSupabaseClient()
      const { data } = await supabase
        .from('products')
        .select('id, name')
        .eq('is_active', true)
        .order('name')
      setProducts(data ?? [])
      if (productId) setSelectedId(productId)
    }
    load()
  }, [productId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedId) {
      setMsg('상품을 선택해 주세요.')
      return
    }
    setSending(true)
    setMsg('')
    try {
      const supabase = createSupabaseClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login?next=/creator/sale-request')
        return
      }
      const res = await fetch('/api/sale-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ product_id: selectedId, message }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || '신청 실패')
      setMsg('판매 의사 신청이 접수되었습니다.')
      setSelectedId('')
      setMessage('')
      router.refresh()
    } catch (err) {
      setMsg(err instanceof Error ? err.message : '오류')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">판매 의사 신청</h1>
      <p className="text-gray-600 mb-8">
        관심 상품을 선택한 후 판매 의사·재고 문의를 보내세요.
      </p>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 border max-w-xl">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">상품 선택 *</label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="">상품 선택...</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">메시지</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 border rounded h-24"
              placeholder="재고 문의, 협상 요청 등"
            />
          </div>
          {msg && (
            <p className={`text-sm ${msg.includes('오류') ? 'text-red-600' : 'text-green-600'}`}>
              {msg}
            </p>
          )}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={sending}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {sending ? '신청 중...' : '신청하기'}
            </button>
            <Link href="/products" className="px-4 py-2 border rounded hover:bg-gray-50">
              상품 둘러보기
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}

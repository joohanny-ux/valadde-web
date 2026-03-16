'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase-client'
import MemberPageIntro from '@/components/member/MemberPageIntro'

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
    <div className="mx-auto max-w-6xl px-4 py-10">
      <MemberPageIntro
        title="Selected Products"
        description="선택한 상품을 검토하고, 요청 메시지를 정리한 뒤 크리에이터 관점의 딜 요청을 제출하세요."
      />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between border-b border-neutral-200 pb-4">
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">Review Items</h2>
              <p className="mt-1 text-sm text-neutral-500">현재 선택한 상품과 요청 메시지를 정리합니다.</p>
            </div>
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
              {selectedId ? '1 item selected' : 'No item'}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-900">상품 선택 *</label>
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="w-full rounded-2xl border border-neutral-300 px-4 py-3 text-sm"
                required
              >
                <option value="">상품 선택...</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-900">공통 요청사항</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="h-32 w-full rounded-2xl border border-neutral-300 px-4 py-3 text-sm"
                placeholder="재고 문의, 샘플 요청, 협상 포인트 등을 적어 주세요."
              />
            </div>

            {msg && (
              <p className={`text-sm ${msg.includes('오류') ? 'text-red-600' : 'text-emerald-600'}`}>
                {msg}
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={sending}
                className="rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50"
              >
                {sending ? '신청 중...' : '딜 요청 제출'}
              </button>
              <Link href="/products" className="rounded-full border border-neutral-300 px-5 py-3 text-sm hover:bg-neutral-50">
                상품 더 보기
              </Link>
            </div>
          </form>
        </div>

        <div className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-900">Deal Planning</h2>
          <div className="mt-5 space-y-4 text-sm text-neutral-600">
            <div className="rounded-2xl bg-neutral-50 p-4">
              <p className="font-medium text-neutral-900">캠페인 시점</p>
              <p className="mt-2 leading-6">언제 판매를 시작할지, 필요한 수량과 리드타임을 함께 정리하면 응답 속도가 빨라집니다.</p>
            </div>
            <div className="rounded-2xl bg-neutral-50 p-4">
              <p className="font-medium text-neutral-900">콘텐츠 운영 채널</p>
              <p className="mt-2 leading-6">라이브, 숏폼, 커뮤니티 공동구매 등 운영 채널에 맞는 요청사항을 메시지에 포함하세요.</p>
            </div>
            <div className="rounded-2xl bg-neutral-50 p-4">
              <p className="font-medium text-neutral-900">다음 단계</p>
              <p className="mt-2 leading-6">제출 후에는 `Deals` 화면에서 협상, 주문, 인보이스 흐름을 이어서 관리합니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

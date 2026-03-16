'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase-client'
import MemberPageIntro from '@/components/member/MemberPageIntro'

type Product = { id: string; name: string; wholesale_price: number | null; price: number | null }
type CartItem = { product_id: string; name: string; qty: number; unit_price: number }

export default function BuyerPOFormPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const productId = searchParams.get('productId')
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [memo, setMemo] = useState('')
  const [sending, setSending] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    async function load() {
      const supabase = createSupabaseClient()
      const { data } = await supabase
        .from('products')
        .select('id, name, wholesale_price, price')
        .eq('is_active', true)
        .order('name')
      setProducts(data ?? [])
      if (productId) {
        const p = (data ?? []).find((d) => d.id === productId)
        if (p) {
          setCart([{
            product_id: p.id,
            name: p.name,
            qty: 1,
            unit_price: p.wholesale_price ?? p.price ?? 0,
          }])
        }
      }
    }
    load()
  }, [productId])

  function addItem(p: Product) {
    const existing = cart.find((c) => c.product_id === p.id)
    if (existing) {
      setCart(cart.map((c) => c.product_id === p.id ? { ...c, qty: c.qty + 1 } : c))
    } else {
      setCart([...cart, {
        product_id: p.id,
        name: p.name,
        qty: 1,
        unit_price: p.wholesale_price ?? p.price ?? 0,
      }])
    }
  }

  function updateQty(productId: string, qty: number) {
    if (qty < 1) {
      setCart(cart.filter((c) => c.product_id !== productId))
    } else {
      setCart(cart.map((c) => c.product_id === productId ? { ...c, qty } : c))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (cart.length === 0) {
      setMsg('상품을 추가해 주세요.')
      return
    }
    setSending(true)
    setMsg('')
    try {
      const supabase = createSupabaseClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login?next=/buyer/po')
        return
      }
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          user_type: 'buyer',
          order_type: 'po',
          items: cart.map((c) => ({
            product_id: c.product_id,
            name: c.name,
            qty: c.qty,
            unit_price: c.unit_price,
          })),
          memo,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || '제출 실패')
      setMsg('PO가 제출되었습니다.')
      setCart([])
      setMemo('')
      router.push('/buyer/po-list')
      router.refresh()
    } catch (err) {
      setMsg(err instanceof Error ? err.message : '오류')
    } finally {
      setSending(false)
    }
  }

  const total = cart.reduce((s, c) => s + c.qty * c.unit_price, 0)

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <MemberPageIntro
        title="Purchase Orders"
        description="선택한 상품으로 구매 의사서를 정리하고, 수량과 요청사항을 함께 제출하세요."
      />

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-900">Review Items</h2>
          <p className="mt-2 text-sm text-neutral-500">구매 대상 상품을 추가하고 수량을 조정하세요.</p>
          <select
            onChange={(e) => {
              const p = products.find((x) => x.id === e.target.value)
              if (p) addItem(p)
            }}
            className="mt-4 w-full rounded-2xl border border-neutral-300 px-4 py-3 text-sm"
          >
            <option value="">상품 선택...</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({(p.wholesale_price ?? p.price ?? 0).toLocaleString()}원)
              </option>
            ))}
          </select>

          {cart.length > 0 && (
            <div className="mt-4 overflow-hidden rounded-[24px] border border-neutral-200">
              <table className="w-full text-sm">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-3 py-2 text-left">상품</th>
                    <th className="px-3 py-2 text-right w-24">수량</th>
                    <th className="px-3 py-2 text-right">단가</th>
                    <th className="px-3 py-2 text-right">금액</th>
                    <th className="w-10" />
                  </tr>
                </thead>
                <tbody>
                  {cart.map((c) => (
                    <tr key={c.product_id} className="border-t border-neutral-200">
                      <td className="px-3 py-2">{c.name}</td>
                      <td className="px-3 py-2 text-right">
                        <input
                          type="number"
                          min={1}
                          value={c.qty}
                          onChange={(e) => updateQty(c.product_id, Number(e.target.value))}
                          className="w-16 rounded-xl border border-neutral-300 px-2 py-1 text-right"
                        />
                      </td>
                      <td className="px-3 py-2 text-right">{c.unit_price.toLocaleString()}원</td>
                      <td className="px-3 py-2 text-right">{(c.qty * c.unit_price).toLocaleString()}원</td>
                      <td>
                        <button
                          type="button"
                          onClick={() => updateQty(c.product_id, 0)}
                          className="text-xs text-red-600"
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="border-t border-neutral-200 p-3 text-right font-semibold">합계: {total.toLocaleString()}원</p>
            </div>
          )}
        </div>

        <div className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-900">PO Details</h2>
          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-neutral-900">메모</label>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="h-32 w-full rounded-2xl border border-neutral-300 px-4 py-3 text-sm"
              placeholder="배송지, 요청사항, 인보이스 관련 메모 등을 입력하세요."
            />
          </div>

          {msg && <p className={`mt-4 text-sm ${msg.includes('오류') ? 'text-red-600' : 'text-emerald-600'}`}>{msg}</p>}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={sending || cart.length === 0}
              className="rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50"
            >
              {sending ? '제출 중...' : 'PO 제출'}
            </button>
            <Link href="/products" className="rounded-full border border-neutral-300 px-5 py-3 text-sm hover:bg-neutral-50">
              상품 더 보기
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}

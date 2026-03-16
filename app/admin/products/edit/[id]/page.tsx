'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import ProductForm from '@/components/admin/ProductForm'

type FormData = Record<string, string | number | boolean | undefined>

export default function ProductEditPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [product, setProduct] = useState<FormData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/admin/products/registered?id=${encodeURIComponent(id)}`)
      .then((res) => res.json())
      .then((data) => {
        const p = data.product
        if (!p) return setProduct(null)
        const cleaned = { ...p }
        delete cleaned._sourceFile
        delete cleaned._rowIndex
        setProduct(cleaned)
      })
      .finally(() => setLoading(false))
  }, [id])

  async function handleSubmit(formData: FormData) {
    const payload: Record<string, unknown> = { id, ...formData }
    delete payload._sourceFile
    delete payload._rowIndex
    const res = await fetch('/api/admin/products/registered', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.message ?? '수정 실패')
    }
    router.push('/admin/products/manage')
  }

  if (loading) return <p className="text-gray-500">로딩 중...</p>
  if (!product) return <p className="text-red-600">상품을 찾을 수 없습니다.</p>

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/products/manage" className="text-gray-500 hover:text-gray-700">
          ← 상품 관리
        </Link>
        <h1 className="text-2xl font-bold">상품 수정</h1>
      </div>

      <ProductForm
        initialData={product}
        mode="edit"
        onSubmit={handleSubmit}
        submitLabel="수정"
        submitLoadingLabel="수정 중..."
      />
    </div>
  )
}

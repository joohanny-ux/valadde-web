'use client'

import { useState } from 'react'
import ProductForm from '@/components/admin/ProductForm'

type FormData = Record<string, string | number | boolean | undefined>

function getEmptyForm(): FormData {
  return {
    brand: '', image: '', category_1: '', category_2: '', category_3: '',
    name_kr: '', name_en: '', name_cn_s: '', name_cn_f: '', name_jp: '',
    volume: '', quantity_per_carton: 0, shelf_life_month: 0, msrp: 0,
    'buying_price_-vat': 0, 'buying_price_+vat': 0, buying_price_rate: 0,
    product_barcode: '', carton_barcode: '', country_of_origin: '',
    is_display: true,
  }
}

export default function ProductRegisterForm() {
  const [success, setSuccess] = useState(false)
  const [formKey, setFormKey] = useState(0)

  async function handleSubmit(formData: FormData) {
    const payload: Record<string, unknown> = {}
    const skipKeys = ['_sourceFile', '_rowIndex', 'id']
    for (const [k, v] of Object.entries(formData)) {
      if (skipKeys.includes(k)) continue
      if (v === '' || v === undefined) continue
      payload[k] = v
    }
    payload.is_display = true

    const res = await fetch('/api/admin/products/registered', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message ?? '등록 실패')
    setSuccess(true)
    setFormKey((k) => k + 1)
  }

  return (
    <div className="space-y-4">
      {success && (
        <p className="text-green-600 text-sm p-3 bg-green-50 rounded">등록되었습니다.</p>
      )}
      <ProductForm
        key={formKey}
        initialData={success ? getEmptyForm() : undefined}
        mode="register"
        onSubmit={handleSubmit}
        submitLabel="등록"
        submitLoadingLabel="등록 중..."
      />
    </div>
  )
}

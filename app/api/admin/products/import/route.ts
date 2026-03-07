import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import { supabase } from '@/lib/supabase'

function genProductId(): string {
  return `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    if (!file) {
      return NextResponse.json({ message: '파일이 없습니다.' }, { status: 400 })
    }

    const buf = Buffer.from(await file.arrayBuffer())
    const workbook = XLSX.read(buf, { type: 'buffer' })
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet)

    if (rows.length === 0) {
      return NextResponse.json({ message: '데이터가 없습니다.', count: 0, productIds: [] }, { status: 400 })
    }

    const { data: brands } = await supabase.from('brands').select('id, name')
    const { data: categories } = await supabase.from('categories').select('id, name')
    const brandMap = new Map((brands ?? []).map((b) => [String(b.name).toLowerCase().trim(), b.id]))
    const categoryMap = new Map((categories ?? []).map((c) => [String(c.name).toLowerCase().trim(), c.id]))

    const productIds: string[] = []
    const errors: string[] = []
    const firstRow = rows[0]
    const cols = Object.keys(firstRow).map((k) => k.toLowerCase().trim())

    const getVal = (row: Record<string, unknown>, keys: string[]): string | null => {
      for (const k of keys) {
        const val = row[k] ?? row[cols.find((c) => c.includes(k.split('_')[0])) ?? '']
        if (val != null && String(val).trim()) return String(val).trim()
      }
      return null
    }

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      const name = getVal(row, ['name', '상품명', 'product_name']) ?? getVal(row, ['name']) ?? ''
      if (!name) {
        errors.push(`행 ${i + 2}: 상품명 없음`)
        continue
      }

      const brandName = getVal(row, ['brand_name', 'brand', '브랜드'])
      const categoryName = getVal(row, ['category_name', 'category', '카테고리'])
      const brandId = brandName ? brandMap.get(brandName.toLowerCase()) : null
      const categoryId = categoryName ? categoryMap.get(categoryName.toLowerCase()) : null

      if (!brandId) {
        errors.push(`행 ${i + 2}: 브랜드 "${brandName ?? '-'}"를 찾을 수 없음`)
        continue
      }
      if (!categoryId) {
        errors.push(`행 ${i + 2}: 카테고리 "${categoryName ?? '-'}"를 찾을 수 없음`)
        continue
      }

      const priceVal = getVal(row, ['price', '가격', '소비자가'])
      const price = priceVal ? parseFloat(String(priceVal).replace(/[^0-9.-]/g, '')) || null : null

      const nameEn = getVal(row, ['name_en', 'name_en', '영문명']) ?? null
      const sku = getVal(row, ['sku', 'SKU']) ?? null
      const shortDesc = getVal(row, ['short_description', '요약']) ?? null

      const id = genProductId()
      const { error } = await supabase.from('products').insert({
        id,
        name,
        name_en: nameEn,
        sku,
        brand_id: brandId,
        category_id: categoryId,
        price,
        short_description: shortDesc,
        is_active: true,
        display_order: 0,
      })

      if (error) {
        errors.push(`행 ${i + 2}: ${error.message}`)
      } else {
        productIds.push(id)
      }
    }

    return NextResponse.json({
      count: productIds.length,
      productIds,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : '가져오기 실패' },
      { status: 500 }
    )
  }
}

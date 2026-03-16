import { NextResponse } from 'next/server'
import { updateProductsDb } from '@/lib/products-file'
import { supabase } from '@/lib/supabase'

export async function POST() {
  try {
    const result = updateProductsDb()

    if (!result.written || result.count === 0) {
      return NextResponse.json({
        success: false,
        count: result.count,
        message: result.message ?? '업데이트할 상품이 없습니다.',
      })
    }

    // products 폴더의 엑셀 → Supabase brands / categories / products 테이블 동기화

    // 1) 기존 브랜드 / 카테고리 로드
    const { data: brands } = await supabase.from('brands').select('id, name, slug')
    const { data: categories } = await supabase.from('categories').select('id, name')

    const brandMap = new Map<string, string>(
      (brands ?? []).map((b) => [String(b.name).toLowerCase().trim(), b.id])
    )
    const categoryMap = new Map<string, string>(
      (categories ?? []).map((c) => [String(c.name).toLowerCase().trim(), c.id])
    )

    // 2) 엑셀에서 사용된 브랜드 / 카테고리 이름 수집
    const neededBrandNames = new Set<string>()
    const neededCategoryNames = new Set<string>()

    for (const p of result.products) {
      if (p.brand) {
        neededBrandNames.add(p.brand.trim())
      }
      const catName = (p.category_3 || p.category_2 || p.category_1 || '').trim()
      if (catName) {
        neededCategoryNames.add(catName)
      }
    }

    // 3) Supabase에 없는 브랜드 / 카테고리 자동 생성
    const missingBrands = Array.from(neededBrandNames).filter(
      (name) => !brandMap.has(name.toLowerCase())
    )

    if (missingBrands.length > 0) {
      const brandRows = missingBrands.map((name, index) => {
        const baseSlug = name
          .toLowerCase()
          .replace(/[^a-z0-9가-힣]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '')
        const slug = baseSlug || `brand-${Date.now().toString(36)}-${index}`
        return {
          id: `brand_${slug}`,
          name,
          slug,
          display_order: (brands?.length ?? 0) + index + 1,
        }
      })
      const { data: insertedBrands, error: brandInsertError } = await supabase
        .from('brands')
        .insert(brandRows)
        .select('id, name')

      if (brandInsertError) {
        return NextResponse.json(
          {
            success: false,
            count: 0,
            message: `Supabase brands 업데이트 실패: ${brandInsertError.message}`,
          },
          { status: 500 }
        )
      }

      for (const b of insertedBrands ?? []) {
        brandMap.set(String(b.name).toLowerCase().trim(), b.id)
      }
    }

    const missingCategories = Array.from(neededCategoryNames).filter(
      (name) => !categoryMap.has(name.toLowerCase())
    )

    if (missingCategories.length > 0) {
      const categoryRows = missingCategories.map((name, index) => {
        const baseSlug = name
          .toLowerCase()
          .replace(/[^a-z0-9가-힣]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '')
        const slug = baseSlug || `category-${Date.now().toString(36)}-${index}`
        return {
          id: `category_${slug}`,
          name,
          slug,
          display_order: (categories?.length ?? 0) + index + 1,
        }
      })

      const { data: insertedCategories, error: categoryInsertError } = await supabase
        .from('categories')
        .insert(categoryRows)
        .select('id, name')

      if (categoryInsertError) {
        return NextResponse.json(
          {
            success: false,
            count: 0,
            message: `Supabase categories 업데이트 실패: ${categoryInsertError.message}`,
          },
          { status: 500 }
        )
      }

      for (const c of insertedCategories ?? []) {
        categoryMap.set(String(c.name).toLowerCase().trim(), c.id)
      }
    }

    // 4) 이번 엑셀에 사용되지 않은 브랜드는 정리 (브랜드 테이블을 엑셀 기준으로 맞춤)
    const keepBrandIds = new Set<string>()
    for (const name of neededBrandNames) {
      const id = brandMap.get(name.toLowerCase())
      if (id) keepBrandIds.add(id)
    }
    if (keepBrandIds.size > 0) {
      await supabase.from('brands').delete().not('id', 'in', Array.from(keepBrandIds))
    }

    const rowsToInsert: {
      id: string
      name: string
      name_en: string | null
      brand_id: string
      category_id: string
      price: number | null
      promotion_price: number | null
      images: string[] | null
      short_description: string | null
      moq: number | null
      country_of_origin: string | null
      is_active: boolean
    }[] = []

    // 기존 products 테이블은 엑셀 기준으로 전체 재구성하므로, 먼저 모두 삭제
    await supabase.from('products').delete().neq('id', '')

    let productIndex = 0
    for (const p of result.products) {
      const brandId = brandMap.get(p.brand.toLowerCase().trim())
      const categoryName = p.category_3 || p.category_2 || p.category_1
      const categoryId = categoryName
        ? categoryMap.get(categoryName.toLowerCase().trim())
        : undefined

      if (!brandId || !categoryId) {
        // 매칭 안 되는 브랜드/카테고리는 건너뜀
        // (향후 필요하면 에러 리스트로 반환 가능)
        continue
      }

      // products.id는 NOT NULL이므로, 엑셀 기반 고유 ID를 생성
      const safeBrand = p.brand
        .toLowerCase()
        .replace(/[^a-z0-9가-힣]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '') || 'product'
      const safeCat = (categoryName || 'all')
        .toLowerCase()
        .replace(/[^a-z0-9가-힣]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '') || 'cat'
      const id = `prod_${safeBrand}_${safeCat}_${String(productIndex++).padStart(3, '0')}`

      rowsToInsert.push({
        id,
        name: p.name_kr,
        name_en: p.name_en || null,
        brand_id: brandId,
        category_id: categoryId,
        price: p.msrp ?? null,
        promotion_price: null,
        images: p.image ? [p.image] : null,
        short_description: null,
        moq: p.quantity_per_carton ?? null,
        country_of_origin: p.country_of_origin ?? null,
        is_active: true,
      })
    }

    if (rowsToInsert.length > 0) {
      const { error } = await supabase.from('products').insert(rowsToInsert)
      if (error) {
        return NextResponse.json(
          {
            success: false,
            count: 0,
            message: `Supabase products 업데이트 실패: ${error.message}`,
          },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({
      success: true,
      count: rowsToInsert.length,
      message:
        result.message ??
        (rowsToInsert.length > 0
          ? `${rowsToInsert.length}건 Supabase products에 등록되었습니다.`
          : '매칭되는 브랜드/카테고리가 없어 등록된 상품이 없습니다.'),
    })
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err instanceof Error ? err.message : '업데이트 실패' },
      { status: 500 }
    )
  }
}

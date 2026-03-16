import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAdminRequest } from '@/lib/request-auth'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminError = requireAdminRequest(request)
  if (adminError) {
    return adminError
  }

  try {
    const { id } = await params
    const body = await request.json()

    const { error } = await supabase
      .from('products')
      .update({
        name: body.name,
        name_en: body.name_en,
        sku: body.sku,
        category_id: body.category_id,
        brand_id: body.brand_id,
        short_description: body.short_description,
        description: body.description,
        images: body.images,
        price: body.price,
        promotion_price: body.promotion_price,
        wholesale_price: body.wholesale_price,
        stock: body.stock,
        is_active: body.is_active,
        is_featured: body.is_featured,
        manufacturer: body.manufacturer,
        country_of_origin: body.country_of_origin,
        moq: body.moq,
      })
      .eq('id', id)

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : '오류' },
      { status: 500 }
    )
  }
}

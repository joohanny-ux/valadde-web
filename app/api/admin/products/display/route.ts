import { NextRequest, NextResponse } from 'next/server'
import { setProductDisplay } from '@/lib/products-file'

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, is_display } = body
    if (!id || typeof is_display !== 'boolean') {
      return NextResponse.json({ success: false, message: 'id, is_display 필요' }, { status: 400 })
    }
    const product = setProductDisplay(id, is_display)
    if (!product) return NextResponse.json({ success: false, message: '상품 없음' }, { status: 404 })
    return NextResponse.json({ success: true, product })
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err instanceof Error ? err.message : '수정 실패' },
      { status: 500 }
    )
  }
}

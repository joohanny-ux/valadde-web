import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params
    const body = await request.json()
    const { images = {}, specs = {} } = body

    const imagesArray = [
      images.image_02,
      images.image_01,
      images.image_03,
    ].filter(Boolean)

    const { error } = await supabase
      .from('products')
      .update({
        images: imagesArray.length > 0 ? imagesArray : undefined,
        specs: Object.keys(specs).length > 0 ? specs : undefined,
      })
      .eq('id', productId)

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : '게시 실패' },
      { status: 500 }
    )
  }
}

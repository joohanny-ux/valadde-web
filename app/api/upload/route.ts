import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const productId = formData.get('productId') as string | null

    if (!file) {
      return NextResponse.json({ message: '파일 없음' }, { status: 400 })
    }

    const ext = file.name.split('.').pop() || 'jpg'
    const fileName = productId
      ? `products/${productId}/${Date.now()}.${ext}`
      : `products/${Date.now()}.${ext}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      })

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }

    const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(data.path)
    return NextResponse.json({ url: urlData.publicUrl, path: data.path })
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : '오류' },
      { status: 500 }
    )
  }
}

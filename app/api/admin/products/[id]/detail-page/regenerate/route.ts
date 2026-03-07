import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { generateImage } from '@/lib/agents/image-generator'

const SIZES = {
  image_01: { w: 280, h: 280 },
  image_02: { w: 600, h: 600 },
  image_03: { w: 860, h: 1200 },
} as const

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params
    const body = await request.json()
    const imageKey = body.imageKey as 'image_01' | 'image_02' | 'image_03'
    const promptOverride = body.promptOverride as string | undefined

    if (!imageKey || !['image_01', 'image_02', 'image_03'].includes(imageKey)) {
      return NextResponse.json({ message: 'imageKey 필요 (image_01, 02, 03)' }, { status: 400 })
    }

    const { data: job } = await supabase
      .from('product_detail_jobs')
      .select('design_suggestion')
      .eq('product_id', productId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    const suggestion = (job?.design_suggestion as Record<string, { prompt: string }>) ?? {}
    const size = SIZES[imageKey]
    const prompt = promptOverride ?? suggestion[imageKey]?.prompt ?? `K-beauty product, ${size.w}x${size.h}`
    const buf = await generateImage(prompt, size.w, size.h)

    const path = `products/${productId}/detail/${imageKey}_${Date.now()}.png`
    const { error } = await supabase.storage
      .from('product-images')
      .upload(path, buf, { contentType: 'image/png', upsert: true })

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 })
    }

    const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(path)
    return NextResponse.json({ imageUrl: urlData.publicUrl })
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : '재생성 실패' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { runDetailPageAgent } from '@/lib/agents'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params
    const formData = await request.formData()
    const image = formData.get('image') as File
    if (!image || !image.size) {
      return NextResponse.json({ message: '상품 이미지를 업로드해주세요.' }, { status: 400 })
    }

    const { data: product } = await supabase
      .from('products')
      .select('id, name')
      .eq('id', productId)
      .single()

    if (!product) {
      return NextResponse.json({ message: '상품을 찾을 수 없습니다.' }, { status: 404 })
    }

    const { data: job, error: jobError } = await supabase
      .from('product_detail_jobs')
      .insert({
        product_id: productId,
        status: 'pending',
      })
      .select('id')
      .single()

    if (jobError || !job) {
      return NextResponse.json(
        { message: jobError?.message ?? '작업 생성 실패' },
        { status: 500 }
      )
    }

    const buf = Buffer.from(await image.arrayBuffer())

    const updateJob = async (updates: Record<string, unknown>) => {
      await supabase
        .from('product_detail_jobs')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', job.id)
    }

    runDetailPageAgent(product.id, product.name, buf, async (status) => {
      await updateJob({ status })
    })
      .then(async (result) => {
        if (result.status === 'done') {
          await updateJob({
            status: 'done',
            specs: result.specs ?? {},
            design_suggestion: result.designSuggestion ?? {},
            generated_images: result.generatedImages ?? {},
          })
        } else {
          await updateJob({
            status: 'error',
            error_message: result.errorMessage,
          })
        }
      })
      .catch(async (err) => {
        await updateJob({
          status: 'error',
          error_message: err instanceof Error ? err.message : '알 수 없는 오류',
        })
      })

    return NextResponse.json({ jobId: job.id, status: 'pending' })
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : '실행 실패' },
      { status: 500 }
    )
  }
}

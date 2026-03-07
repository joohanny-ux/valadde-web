import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params
    const jobId = request.nextUrl.searchParams.get('jobId')
    if (!jobId) {
      return NextResponse.json({ message: 'jobId 필요' }, { status: 400 })
    }

    const { data: job, error } = await supabase
      .from('product_detail_jobs')
      .select('id, status, specs, design_suggestion, generated_images, error_message')
      .eq('id', jobId)
      .eq('product_id', productId)
      .single()

    if (error || !job) {
      return NextResponse.json({ message: '작업을 찾을 수 없습니다.' }, { status: 404 })
    }

    return NextResponse.json({
      status: job.status,
      specs: job.specs ?? {},
      designSuggestion: job.design_suggestion ?? {},
      generatedImages: job.generated_images ?? {},
      errorMessage: job.error_message,
    })
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : '조회 실패' },
      { status: 500 }
    )
  }
}

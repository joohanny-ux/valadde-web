import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import BrandEditForm from './BrandEditForm'

export default async function BrandEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const { data: brand, error } = await supabase
    .from('brands')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !brand) {
    notFound()
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/brands" className="text-gray-500 hover:text-gray-700">← 목록</Link>
        <h1 className="text-2xl font-bold">브랜드 수정: {brand.name}</h1>
      </div>
      <BrandEditForm brand={brand} />
    </div>
  )
}

import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import CategoryEditForm from './CategoryEditForm'

export default async function CategoryEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const { data: category, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !category) {
    notFound()
  }

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .neq('id', id)
    .order('name')

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/categories" className="text-gray-500 hover:text-gray-700">← 목록</Link>
        <h1 className="text-2xl font-bold">카테고리 수정: {category.name}</h1>
      </div>
      <CategoryEditForm category={category} parentOptions={categories ?? []} />
    </div>
  )
}

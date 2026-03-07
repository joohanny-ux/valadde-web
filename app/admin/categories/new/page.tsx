import Link from 'next/link'
import CategoryNewForm from './CategoryNewForm'

export default async function CategoryNewPage() {
  const { supabase } = await import('@/lib/supabase')
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .order('name')

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/categories" className="text-gray-500 hover:text-gray-700">← 목록</Link>
        <h1 className="text-2xl font-bold">새 카테고리 추가</h1>
      </div>
      <CategoryNewForm parentOptions={categories ?? []} />
    </div>
  )
}

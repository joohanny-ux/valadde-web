import { supabase } from '@/lib/supabase'
import CategoryList from './CategoryList'

export default async function AdminCategoriesPage() {
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .order('display_order')
    .order('name')

  if (error) {
    return <p className="text-red-600">오류: {error.message}</p>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">카테고리 관리</h1>
      <CategoryList categories={categories ?? []} />
    </div>
  )
}

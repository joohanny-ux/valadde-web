import { supabase } from '@/lib/supabase'
import BrandList from './BrandList'

export default async function AdminBrandsPage() {
  const { data: brands, error } = await supabase
    .from('brands')
    .select('*')
    .order('display_order')
    .order('name')

  if (error) {
    return <p className="text-red-600">오류: {error.message}</p>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">브랜드 관리</h1>
      <BrandList brands={brands ?? []} />
    </div>
  )
}

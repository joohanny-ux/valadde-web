import Link from 'next/link'
import BrandNewForm from './BrandNewForm'

export default function BrandNewPage() {
  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/brands" className="text-gray-500 hover:text-gray-700">← 목록</Link>
        <h1 className="text-2xl font-bold">새 브랜드 추가</h1>
      </div>
      <BrandNewForm />
    </div>
  )
}

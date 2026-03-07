import Link from 'next/link'

export default function BrandNewProductPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">신상품 요청</h1>
      <p className="text-gray-600 mb-8">
        신상품 게시를 요청하세요. 관리자 검토 후 반영됩니다.
      </p>
      <div className="bg-white rounded-lg shadow p-8 border text-center text-gray-500">
        <p>신상품 요청 기능은 준비 중입니다.</p>
        <Link href="/brand" className="mt-4 inline-block text-blue-600 hover:underline">
          대시보드로 돌아가기 →
        </Link>
      </div>
    </div>
  )
}

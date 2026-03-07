import Link from 'next/link'

export default function BrandReviewRequestPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">검수 요청</h1>
      <p className="text-gray-600 mb-8">
        기존 상품의 가격·상세페이지 검수를 요청하세요.
      </p>
      <div className="bg-white rounded-lg shadow p-8 border text-center text-gray-500">
        <p>검수 요청 기능은 준비 중입니다.</p>
        <Link href="/products" className="mt-4 inline-block text-blue-600 hover:underline">
          상품 목록에서 선택하기 →
        </Link>
      </div>
    </div>
  )
}

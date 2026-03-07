import Link from 'next/link'

export default function BrandDashboardPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">브랜드 대시보드</h1>
      <p className="text-gray-600 mb-8">검수·신상 요청 현황을 한눈에 확인하세요.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        <div className="bg-white rounded-lg shadow p-6 border">
          <h2 className="font-semibold text-gray-800 mb-2">검수 요청</h2>
          <p className="text-2xl font-bold text-blue-600">0</p>
          <p className="text-sm text-gray-500 mt-1">건</p>
          <Link href="/brand/review-request" className="mt-3 inline-block text-sm text-blue-600 hover:underline">
            검수 요청하기 →
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border">
          <h2 className="font-semibold text-gray-800 mb-2">신상품 요청</h2>
          <p className="text-2xl font-bold text-blue-600">0</p>
          <p className="text-sm text-gray-500 mt-1">건</p>
          <Link href="/brand/new-product" className="mt-3 inline-block text-sm text-blue-600 hover:underline">
            신상품 요청하기 →
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 border">
        <h2 className="font-semibold text-gray-800 mb-3">빠른 링크</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/brand/review-request"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            검수 요청
          </Link>
          <Link
            href="/brand/new-product"
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            신상품 요청
          </Link>
          <Link
            href="/brand/requests"
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            요청 내역
          </Link>
          <Link
            href="/products"
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            상품 둘러보기
          </Link>
        </div>
      </div>
    </div>
  )
}

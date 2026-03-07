import Link from 'next/link'

export default function BuyerDashboardPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">바이어 대시보드</h1>
      <p className="text-gray-600 mb-8">내 PO·주문 요약을 한눈에 확인하세요.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        <div className="bg-white rounded-lg shadow p-6 border">
          <h2 className="font-semibold text-gray-800 mb-2">제출한 PO</h2>
          <p className="text-2xl font-bold text-blue-600">0</p>
          <p className="text-sm text-gray-500 mt-1">건</p>
          <Link href="/buyer/po-list" className="mt-3 inline-block text-sm text-blue-600 hover:underline">
            PO 목록 →
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border">
          <h2 className="font-semibold text-gray-800 mb-2">내 주문</h2>
          <p className="text-2xl font-bold text-blue-600">0</p>
          <p className="text-sm text-gray-500 mt-1">건</p>
          <Link href="/buyer/orders" className="mt-3 inline-block text-sm text-blue-600 hover:underline">
            주문 목록 →
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 border">
        <h2 className="font-semibold text-gray-800 mb-3">빠른 링크</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/buyer/po"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            PO 작성
          </Link>
          <Link
            href="/buyer/po-list"
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            PO 목록
          </Link>
          <Link
            href="/buyer/orders"
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            주문 목록
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

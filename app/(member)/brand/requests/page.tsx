import Link from 'next/link'

export default function BrandRequestsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">요청 내역</h1>
      <p className="text-gray-600 mb-8">
        검수·신상 요청 목록과 상태를 확인하세요.
      </p>
      <div className="bg-white rounded-lg shadow p-8 border text-center text-gray-500">
        <p>요청 내역이 없습니다.</p>
        <Link href="/brand" className="mt-4 inline-block text-blue-600 hover:underline">
          대시보드로 돌아가기 →
        </Link>
      </div>
    </div>
  )
}

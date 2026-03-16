import Link from 'next/link'
import MemberPageIntro from '@/components/member/MemberPageIntro'

export default function BuyerDashboardPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <MemberPageIntro
        title="Buyer Workspace"
        description="구매 의사서 작성부터 주문, 인보이스, 후속 운영까지 바이어 흐름을 같은 워크스페이스 안에서 정리합니다."
      />

      <div className="mb-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Purchase Orders</h2>
          <p className="mt-3 text-3xl font-semibold text-neutral-900">PO</p>
          <p className="mt-2 text-sm text-neutral-500">상품 선택 후 수량과 메모를 정리해 구매 흐름을 시작하세요.</p>
          <Link href="/buyer/po-list" className="mt-4 inline-block text-sm font-medium text-neutral-900 hover:underline">
            PO 목록 →
          </Link>
        </div>
        <div className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Orders</h2>
          <p className="mt-3 text-3xl font-semibold text-neutral-900">Track</p>
          <p className="mt-2 text-sm text-neutral-500">제출 이후에는 주문, 인보이스, 배송 상태를 순차적으로 확인합니다.</p>
          <Link href="/buyer/orders" className="mt-4 inline-block text-sm font-medium text-neutral-900 hover:underline">
            주문 목록 →
          </Link>
        </div>
      </div>

      <div className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-neutral-900">빠른 링크</h2>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/buyer/po"
            className="rounded-full bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-700"
          >
            PO 작성
          </Link>
          <Link
            href="/buyer/po-list"
            className="rounded-full border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50"
          >
            PO 목록
          </Link>
          <Link
            href="/buyer/orders"
            className="rounded-full border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50"
          >
            주문 목록
          </Link>
          <Link
            href="/products"
            className="rounded-full border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50"
          >
            상품 둘러보기
          </Link>
        </div>
      </div>
    </div>
  )
}

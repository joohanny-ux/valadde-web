import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default async function AdminDashboard() {
  const [{ count: productCount }, { count: brandCount }, { count: categoryCount }, { count: noticeCount }, { count: faqCount }] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('brands').select('*', { count: 'exact', head: true }),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('notices').select('*', { count: 'exact', head: true }),
    supabase.from('faqs').select('*', { count: 'exact', head: true }),
  ])

  let orderCount = 0
  const orderRes = await supabase.from('orders').select('*', { count: 'exact', head: true })
  if (!orderRes.error) orderCount = orderRes.count ?? 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">운영 대시보드</h1>
        <p className="mt-2 text-sm text-neutral-500">
          상품, 거래, 콘텐츠 운영 상태를 빠르게 확인하고 각 관리 화면으로 이동합니다.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-[28px] border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">Brands</p>
          <p className="mt-3 text-3xl font-semibold text-neutral-900">{brandCount ?? 0}</p>
        </div>
        <div className="rounded-[28px] border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">Categories</p>
          <p className="mt-3 text-3xl font-semibold text-neutral-900">{categoryCount ?? 0}</p>
        </div>
        <div className="rounded-[28px] border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">Products</p>
          <p className="mt-3 text-3xl font-semibold text-neutral-900">{productCount ?? 0}</p>
        </div>
        <div className="rounded-[28px] border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">Orders</p>
          <p className="mt-3 text-3xl font-semibold text-neutral-900">{orderCount}</p>
        </div>
        <div className="rounded-[28px] border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">Content</p>
          <p className="mt-3 text-3xl font-semibold text-neutral-900">{(noticeCount ?? 0) + (faqCount ?? 0)}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-900">운영 바로가기</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/admin/orders" className="rounded-full bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-700">
              주문 관리
            </Link>
            <Link href="/admin/products" className="rounded-full border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50">
              상품 목록
            </Link>
            <Link href="/admin/notices" className="rounded-full border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50">
              공지사항
            </Link>
            <Link href="/admin/faqs" className="rounded-full border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50">
              FAQ
            </Link>
          </div>
        </div>

        <div className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-900">보안 상태</h2>
          <ul className="mt-5 space-y-3 text-sm text-neutral-600">
            <li>`/admin` 및 `/api/admin/*`는 관리자 세션 검증을 통과해야 접근할 수 있습니다.</li>
            <li>브랜드, 카테고리, 공지, FAQ, 상품 수정, 업로드 write API는 관리자 검증을 거칩니다.</li>
            <li>Buyer 주문 생성과 Creator 판매 의사 신청은 역할 검증을 통과해야 제출됩니다.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

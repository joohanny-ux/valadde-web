'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLogin = pathname === '/admin/login'

  if (isLogin) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-slate-800 text-white shrink-0">
        <div className="p-4 border-b border-slate-700">
          <Link href="/admin" className="font-bold text-lg">ABU Admin</Link>
        </div>
        <nav className="p-2">
          <Link
            href="/admin/products"
            className="block px-3 py-2 rounded hover:bg-slate-700"
          >
            상품 관리
          </Link>
          <Link
            href="/admin/categories"
            className="block px-3 py-2 rounded hover:bg-slate-700"
          >
            카테고리
          </Link>
          <Link
            href="/admin/brands"
            className="block px-3 py-2 rounded hover:bg-slate-700"
          >
            브랜드
          </Link>
          <Link
            href="/admin/notices"
            className="block px-3 py-2 rounded hover:bg-slate-700"
          >
            공지사항
          </Link>
          <Link
            href="/admin/faqs"
            className="block px-3 py-2 rounded hover:bg-slate-700"
          >
            FAQ
          </Link>
          <Link
            href="/admin/orders"
            className="block px-3 py-2 rounded hover:bg-slate-700"
          >
            주문 관리
          </Link>
          <Link
            href="/admin/sale-requests"
            className="block px-3 py-2 rounded hover:bg-slate-700"
          >
            판매 의사 신청
          </Link>
          <form action="/api/admin/logout" method="POST" className="mt-4">
            <button type="submit" className="block w-full text-left px-3 py-2 rounded hover:bg-slate-700 text-sm text-gray-300">
              로그아웃
            </button>
          </form>
        </nav>
      </aside>
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  )
}

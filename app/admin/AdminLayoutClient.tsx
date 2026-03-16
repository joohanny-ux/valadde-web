'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLogin = pathname === '/admin/login'

  const [productsOpen, setProductsOpen] = useState(pathname.startsWith('/admin/products'))
  const [usersOpen, setUsersOpen] = useState(false)

  if (isLogin) {
    return <>{children}</>
  }

  const navItem = (href: string, label: string, indent = false, isActiveFn?: () => boolean) => {
    const isActive = isActiveFn ? isActiveFn() : pathname === href || pathname.startsWith(href + '/')
    return (
      <Link
        href={href}
        className={`block rounded-2xl px-3 py-2 hover:bg-neutral-100 ${
          indent ? 'pl-6 text-sm text-neutral-600' : 'text-neutral-700'
        } ${isActive ? 'bg-neutral-900 text-white hover:bg-neutral-900' : ''}`}
      >
        {label}
      </Link>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 lg:flex">
      <aside className="w-72 shrink-0 overflow-y-auto border-r border-neutral-200 bg-white">
        <div className="border-b border-neutral-200 px-5 py-5">
          <Link href="/admin" className="text-lg font-semibold tracking-tight text-neutral-900">
            Valadde Admin
          </Link>
          <p className="mt-1 text-xs text-neutral-500">운영 데이터, 상품, 콘텐츠를 관리합니다.</p>
        </div>
        <nav className="space-y-2 p-3">
          <div className="mb-1">
            <button
              type="button"
              onClick={() => setProductsOpen(!productsOpen)}
              className="flex w-full items-center justify-between rounded-2xl px-3 py-2 hover:bg-neutral-100"
            >
              <span className="text-sm font-medium text-neutral-700">PRODUCTS</span>
              <span className="text-neutral-400">{productsOpen ? '▼' : '▶'}</span>
            </button>
            {productsOpen && (
              <div className="mt-1 space-y-1">
                {navItem('/admin/products', '상품 목록', true, () =>
                  pathname === '/admin/products' || (pathname.startsWith('/admin/products/') && !pathname.includes('/new') && !pathname.includes('/manage'))
                )}
                {navItem('/admin/products/new', '상품 등록', true)}
                {navItem('/admin/products/manage', '상품 관리', true)}
                {navItem('/admin/products/catalog', '상품 페이지', true)}
              </div>
            )}
          </div>

          {navItem('/admin/categories', 'CATEGORY')}
          {navItem('/admin/brands', 'BRANDS')}
          {navItem('/admin/notices', '공지사항')}
          {navItem('/admin/faqs', 'FAQ')}
          {navItem('/admin/qa', 'Q&A')}

          {/* USERS */}
          <div className="mb-1 mt-2">
            <button
              type="button"
              onClick={() => setUsersOpen(!usersOpen)}
              className="flex w-full items-center justify-between rounded-2xl px-3 py-2 hover:bg-neutral-100"
            >
              <span className="text-sm font-medium text-neutral-700">USERS</span>
              <span className="text-neutral-400">{usersOpen ? '▼' : '▶'}</span>
            </button>
            {usersOpen && (
              <div className="mt-1 space-y-1">
                {navItem('/admin/users/creators', 'CREATORS', true)}
                {navItem('/admin/users/buyers', 'B2B BUYERS', true)}
                {navItem('/admin/users/brands', 'BRANDS', true)}
                {navItem('/admin/users/admin', 'ADMIN', true)}
              </div>
            )}
          </div>

          <form action="/api/admin/logout" method="POST" className="mt-4">
            <button
              type="submit"
              className="block w-full rounded-2xl px-3 py-2 text-left text-sm text-neutral-500 hover:bg-neutral-100"
            >
              로그아웃
            </button>
          </form>
        </nav>
      </aside>
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  )
}

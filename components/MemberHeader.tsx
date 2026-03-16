'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase-client'

type UserType = 'creator' | 'buyer' | 'brand'

const DASHBOARD_LINKS: Record<UserType, { href: string; label: string }> = {
  creator: { href: '/creator', label: '크리에이터 대시보드' },
  buyer: { href: '/buyer', label: '바이어 대시보드' },
  brand: { href: '/brand', label: '브랜드 대시보드' },
}

export default function MemberHeader({ userType }: { userType: UserType }) {
  const pathname = usePathname()
  const router = useRouter()
  const dash = DASHBOARD_LINKS[userType]

  async function handleLogout() {
    await createSupabaseClient().auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-neutral-900">
          Valadde
        </Link>
        <nav className="flex items-center gap-6 text-sm text-neutral-600">
          <Link href="/products" className="hover:text-neutral-900">상품</Link>
          <Link
            href={dash.href}
            className={pathname.startsWith(dash.href) ? 'font-medium text-neutral-900' : 'hover:text-neutral-900'}
          >
            {dash.label}
          </Link>
          <button onClick={handleLogout} className="text-sm text-neutral-500 hover:text-neutral-900">
            로그아웃
          </button>
        </nav>
      </div>
    </header>
  )
}

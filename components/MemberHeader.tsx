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
    <header className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          VALADDE
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/products" className="hover:text-blue-600">상품</Link>
          <Link
            href={dash.href}
            className={pathname.startsWith(dash.href) ? 'text-blue-600 font-medium' : 'hover:text-blue-600'}
          >
            {dash.label}
          </Link>
          <button onClick={handleLogout} className="text-gray-500 hover:text-gray-700 text-sm">
            로그아웃
          </button>
        </nav>
      </div>
    </header>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase-client'
import MemberHeader from './MemberHeader'
import PublicFooter from './PublicFooter'
import MemberSubnav from './member/MemberSubnav'

type UserType = 'creator' | 'buyer' | 'brand'

const PATH_BY_TYPE: Record<UserType, string> = {
  creator: '/creator',
  buyer: '/buyer',
  brand: '/brand',
}

export function MemberGuard({
  children,
  allowedType,
}: {
  children: React.ReactNode
  allowedType: UserType
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [ready, setReady] = useState(false)
  const [userType, setUserType] = useState<UserType | null>(null)

  useEffect(() => {
    let cancelled = false

    async function check() {
      const supabase = createSupabaseClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (cancelled) return

      if (!session) {
        router.replace(`/login?next=${encodeURIComponent(pathname)}`)
        return
      }

      const res = await fetch('/api/me', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      if (cancelled || !res.ok) {
        if (!res.ok) router.replace('/login')
        return
      }

      const { profile } = await res.json()
      const type = profile?.user_type as UserType

      if (type !== allowedType) {
        router.replace(PATH_BY_TYPE[type] || '/')
        return
      }

      setUserType(type)
      setReady(true)
    }

    check()
    return () => { cancelled = true }
  }, [allowedType, pathname, router])

  if (!ready || !userType) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <MemberHeader userType={userType} />
      <MemberSubnav memberType={userType} />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  )
}

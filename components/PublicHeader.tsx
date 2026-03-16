'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createSupabaseClient } from '@/lib/supabase-client'
import AbuLogo from './AbuLogo'

export default function PublicHeader() {
  const [userType, setUserType] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createSupabaseClient()

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setUserType(null)
        return
      }

      fetch('/api/me', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) =>
          data?.profile?.user_type ? setUserType(data.profile.user_type) : setUserType(null)
        )
        .catch(() => setUserType(null))
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) {
          setUserType(null)
        } else {
          fetch('/api/me', {
            headers: { Authorization: `Bearer ${session.access_token}` },
          })
            .then((res) => (res.ok ? res.json() : null))
            .then((data) =>
              data?.profile?.user_type ? setUserType(data.profile.user_type) : setUserType(null)
            )
            .catch(() => setUserType(null))
        }
      })
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    await createSupabaseClient().auth.signOut()
    setUserType(null)
    window.location.href = '/'
  }

  const dashHref =
    userType === 'creator'
      ? '/creator'
      : userType === 'buyer'
      ? '/buyer'
      : userType === 'brand'
      ? '/brand'
      : '/'

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <div className="shrink-0">
          <AbuLogo href="/" src="/images/Logo.png" className="h-12 w-28" invert={false} />
        </div>

        <div className="ml-auto flex items-center gap-10">
          <nav className="hidden items-center gap-10 lg:flex">
            <Link
              href="/products"
              className="text-[16px] font-medium text-neutral-500 transition-colors hover:text-neutral-900"
            >
              Products
            </Link>
            <Link
              href="/creator"
              className="text-[16px] font-medium text-neutral-900 transition-colors hover:text-neutral-700"
            >
              For Creators
            </Link>
            <Link
              href="/buyer"
              className="text-[16px] font-medium text-neutral-500 transition-colors hover:text-neutral-900"
            >
              For Buyers
            </Link>
          </nav>

          <div className="hidden items-center gap-6 lg:flex">
            {userType ? (
              <>
                <Link
                  href={dashHref}
                  className="text-[16px] font-medium text-neutral-900 transition-colors hover:text-neutral-700"
                >
                  My Page
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-[16px] font-medium text-neutral-900 transition-colors hover:text-neutral-700"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-[16px] font-medium text-neutral-900 transition-colors hover:text-neutral-700"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="rounded-full bg-gradient-to-r from-violet-500 to-pink-500 px-7 py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-90"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
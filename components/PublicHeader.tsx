'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase-client'
import AbuLogo from './AbuLogo'

const LANGUAGES = [
  { code: 'ko', label: '한국어' },
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' },
] as const

export default function PublicHeader() {
  const router = useRouter()
  const [userType, setUserType] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [langOpen, setLangOpen] = useState(false)
  const [lang, setLang] = useState<(typeof LANGUAGES)[number]>(LANGUAGES[0])

  useEffect(() => {
    const supabase = createSupabaseClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setUserType(null)
        return
      }
      fetch('/api/me', { headers: { Authorization: `Bearer ${session.access_token}` } })
        .then((res) => res.ok ? res.json() : null)
        .then((data) => data?.profile?.user_type ? setUserType(data.profile.user_type) : setUserType(null))
        .catch(() => setUserType(null))
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) setUserType(null)
        else {
          fetch('/api/me', { headers: { Authorization: `Bearer ${session.access_token}` } })
            .then((res) => res.ok ? res.json() : null)
            .then((data) => data?.profile?.user_type ? setUserType(data.profile.user_type) : setUserType(null))
        }
      })
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('[data-lang-dropdown]')) setLangOpen(false)
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  async function handleLogout() {
    await createSupabaseClient().auth.signOut()
    setUserType(null)
    window.location.href = '/'
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      router.push('/products')
    }
  }

  const dashHref = userType === 'creator' ? '/creator' : userType === 'buyer' ? '/buyer' : userType === 'brand' ? '/brand' : '/'

  return (
    <header className="sticky top-0 z-50 bg-[#2E2E2E] border-b border-white/5 font-sans">
      <div className="max-w-7xl mx-auto px-10 py-2.5 flex items-center justify-between gap-10">
        {/* Logo */}
        <AbuLogo href="/" className="shrink-0 h-8" />

        {/* Nav Links */}
        <nav className="flex items-center gap-6 text-[11px] font-light text-[#E5E5E5] tracking-wide">
          <Link href="/about" className="hover:text-white transition-colors uppercase">
            About Us
          </Link>
          <Link href="/products" className="hover:text-white transition-colors uppercase">
            Products
          </Link>
          <Link href="/brands" className="hover:text-white transition-colors uppercase">
            Brands
          </Link>
        </nav>

        {/* Right: Search + Auth + Language */}
        <div className="flex items-center gap-5 shrink-0 ml-auto">
          {/* Search Bar - Gradient */}
          <form onSubmit={handleSearch} className="shrink-0 w-[210px]">
            <div className="relative flex items-center rounded-full overflow-hidden bg-gradient-to-r from-[#FF007F] to-[#FF8C00] p-[1.5px]">
              <input
                type="search"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-3 pr-9 py-1.5 bg-[#2E2E2E]/90 text-white placeholder-white/50 text-[11px] font-light rounded-full focus:outline-none focus:ring-0"
              />
              <button
                type="submit"
                className="absolute right-1.5 w-6 h-6 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                aria-label="Search"
              >
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>
          {/* Log In | Sign Up / My Page | Log Out */}
          <div className="flex items-center gap-2 text-[11px] font-light text-[#E5E5E5]">
            {userType ? (
              <>
                <Link href={dashHref} className="hover:text-white transition-colors uppercase">
                  My Page
                </Link>
                <span className="text-white/40">|</span>
                <button
                  onClick={handleLogout}
                  className="hover:text-white transition-colors uppercase"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-white transition-colors uppercase">
                  Log In
                </Link>
                <span className="text-white/40">|</span>
                <Link href="/signup" className="hover:text-white transition-colors uppercase">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Language Dropdown */}
          <div className="relative" data-lang-dropdown>
            <button
              type="button"
              onClick={() => setLangOpen((o) => !o)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white text-black text-[11px] font-medium hover:bg-gray-50 transition-colors"
            >
              {lang.label}
              <svg
                className={`w-4 h-4 transition-transform ${langOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-1 py-1 rounded-lg bg-white shadow-lg border border-gray-100 min-w-[120px] z-50">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => {
                      setLang(l)
                      setLangOpen(false)
                    }}
                    className={`w-full px-3 py-1.5 text-left text-[11px] hover:bg-gray-50 transition-colors ${
                      lang.code === l.code ? 'font-medium text-black' : 'text-gray-600'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

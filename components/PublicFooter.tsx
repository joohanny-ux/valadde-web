import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

export default async function PublicFooter() {
  const { data: notices } = await supabase
    .from('notices')
    .select('id, title, created_at')
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(4)

  return (
    <footer className="mt-auto bg-white font-sans text-gray-900 leading-none">
      {/* Top Section: Contact, Notice, SNS - equal horizontal spacing */}
      <div className="max-w-6xl mx-auto px-10 py-2.5">
        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-x-12 gap-y-4">
          {/* Contact Us */}
          <div className="flex flex-col">
            <h3 className="font-bold text-xs mb-1.5 text-gray-900">Contact Us</h3>
            <div className="space-y-0 text-[11px] text-gray-600 leading-none">
              <p className="font-medium text-gray-500 text-[10px]">Email</p>
              <a href="mailto:contact@answerbybeauty.com" className="block hover:underline">
                contact@answerbybeauty.com
              </a>
              <a href="mailto:answerbybeauty@gmail.com" className="block hover:underline">
                answerbybeauty@gmail.com
              </a>
            </div>
            <div className="flex gap-2 mt-1.5">
              <Link
                href="/faq"
                className="inline-flex items-center justify-center min-w-[72px] px-3 py-1.5 text-[11px] font-medium border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                FAQ
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center min-w-[72px] px-3 py-1.5 text-[11px] font-medium border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                CONTACT
              </Link>
            </div>
          </div>

          {/* 공지사항 */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between border-b border-gray-200 pb-1 mb-2">
              <h3 className="font-bold text-xs text-gray-900">공지사항</h3>
              <Link href="/notice" className="text-gray-400 hover:text-gray-600" aria-label="공지사항 전체보기">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </Link>
            </div>
            <ul className="space-y-0 text-[11px] text-gray-600 leading-none">
              {(notices ?? []).length === 0 ? (
                <li className="text-gray-400">등록된 공지가 없습니다.</li>
              ) : (
                (notices ?? []).map((n) => (
                  <li key={n.id}>
                    <Link href={`/notice/${n.id}`} className="hover:underline block">
                      {n.title}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* SNS */}
          <div>
            <h3 className="font-bold text-xs mb-2 text-gray-900">SNS</h3>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 text-gray-500 hover:bg-gray-50 transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" strokeWidth={1.5} />
                  <circle cx="12" cy="12" r="4" strokeWidth={1.5} />
                  <circle cx="18" cy="6" r="1.5" fill="currentColor" />
                </svg>
              </a>
              <a
                href="#"
                className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 text-gray-500 hover:bg-gray-50 transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeWidth={1.5} d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Navigation (light grey strip) */}
      <div className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-10 py-2">
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-gray-600">
            <Link href="/about" className="text-gray-700 hover:text-gray-900 transition-colors">
              About Us
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/products" className="text-gray-700 hover:text-gray-900 transition-colors">
              Products
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/brands" className="text-gray-700 hover:text-gray-900 transition-colors">
              Brands
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/terms" className="text-gray-700 hover:text-gray-900 transition-colors">
              이용약관
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/privacy" className="text-red-500 hover:text-red-600 transition-colors font-medium">
              개인정보처리방침
            </Link>
          </nav>
        </div>
      </div>

      {/* Bottom Section: Company Info + Logo */}
      <div className="max-w-6xl mx-auto px-10 py-2.5">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="text-[11px] text-gray-600 space-y-0 leading-none">
            <p className="font-semibold text-gray-900">ABU Co., Ltd. (주)에이뷰</p>
            <p>서울시 중구 퇴계로 235, A-401</p>
            <p>대표자: 민대식 | 개인정보보호책임자: 김주한</p>
            <p className="pt-1.5 text-gray-500">© ABU ALL RIGHTS RESERVED</p>
          </div>
          <div className="shrink-0">
            <Link href="/" className="inline-block">
              <Image
                src="/images/Logo_bk.png"
                alt="ABU BUSINESS HUB"
                width={140}
                height={42}
                className="object-contain"
              />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

import Link from 'next/link'
import AbuLogo from './AbuLogo'

export default function PublicFooter() {
  const text = {
    contactTitle: 'Contact Us',
    emailLabel: 'Email',
    emails: ['contact@answerbybeauty.com', 'answerbybeauty@gmail.com'],
    faq: 'FAQ',
    qa: 'Q&A',

    noticesTitle: 'Notices',
    noticesMore: '+',
    notices: [
      {
        title: '[공지] 영상정보처리기기 운영·관리 방침 변경 안내',
        date: '2026.03.09',
      },
      {
        title: '[공지] LGU+ 휴대폰본인확인 서비스 일시중단 안내',
        date: '2026.03.09',
      },
      {
        title: '[공지] 3/9(월) 신세계 포인트 시스템 점검 안내',
        date: '2026.03.09',
      },
      {
        title: '[공지] 시코르닷컴 3/2(월) 대체공휴일 휴무 안내',
        date: '2026.03.09',
      },
    ],

    snsTitle: 'SNS',
    instagram: 'Instagram',

    footerLinks: [
      { label: 'About Us', href: '/about' },
      { label: 'Products', href: '/products' },
      { label: 'Brands', href: '/brands' },
      { label: '이용약관', href: '/terms' },
      { label: '개인정보처리방침', href: '/privacy' },
    ],

    companyNameEn: 'ABU Co., Ltd.',
    companyNameKo: '(주)에이뷰',
    ceoLabel: 'CEO',
    ceoName: 'Min Dae Sik',
    licenseLabel: 'Business License No.',
    licenseValue: '',
    address: 'A-401, 235, Toegye-ro, Jung-gu, Seoul, Republic of Korea 04558',
    copyright: '© ABU ALL RIGHTS RESERVED',
  }

  return (
    <footer className="border-t border-neutral-200 bg-white text-neutral-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Top Row */}
        <div className="grid gap-8 py-9 lg:grid-cols-[1fr_1.6fr_0.65fr]">
          {/* Contact */}
          <section>
            <div className="border-b border-neutral-300 pb-2.5">
              <h3 className="text-[19px] font-semibold tracking-tight text-neutral-800">
                {text.contactTitle}
              </h3>
            </div>

            <div className="mt-4 flex gap-3">
              <div className="min-w-[48px] text-[14px] font-semibold text-neutral-800">
                {text.emailLabel}
              </div>

              <div className="space-y-0.5 text-[14px] font-medium leading-6 text-neutral-700">
                {text.emails.map((email) => (
                  <p key={email}>{email}</p>
                ))}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/faq"
                className="inline-flex min-w-[88px] items-center justify-center rounded-full border border-neutral-300 bg-white px-4 py-2 text-[14px] font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
              >
                {text.faq}
              </Link>

              <Link
                href="/contact"
                className="inline-flex min-w-[88px] items-center justify-center rounded-full border border-neutral-300 bg-white px-4 py-2 text-[14px] font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
              >
                {text.qa}
              </Link>
            </div>
          </section>

          {/* Notices */}
          <section>
            <div className="flex items-center justify-between border-b border-neutral-300 pb-2.5">
              <h3 className="text-[19px] font-semibold tracking-tight text-neutral-800">
                {text.noticesTitle}
              </h3>

              <Link
                href="/notice"
                className="text-[28px] font-semibold leading-none text-neutral-800 transition-opacity hover:opacity-60"
                aria-label="View more notices"
              >
                {text.noticesMore}
              </Link>
            </div>

            <div className="mt-4 space-y-1">
              {text.notices.map((notice) => (
                <div
                  key={`${notice.title}-${notice.date}`}
                  className="grid grid-cols-[1fr_auto] items-start gap-3 text-[14px] leading-6"
                >
                  <Link
                    href="/notice"
                    className="truncate text-neutral-700 transition-colors hover:text-neutral-900"
                    title={notice.title}
                  >
                    {notice.title}
                  </Link>
                  <span className="shrink-0 text-neutral-600">{notice.date}</span>
                </div>
              ))}
            </div>
          </section>

          {/* SNS */}
          <section>
            <div className="border-b border-neutral-300 pb-2.5">
              <h3 className="text-[19px] font-semibold tracking-tight text-neutral-800">
                {text.snsTitle}
              </h3>
            </div>

            <div className="mt-6">
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-w-[96px] items-center justify-center rounded-[18px] border border-neutral-300 bg-white px-5 py-4 text-[14px] font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
              >
                {text.instagram}
              </a>
            </div>
          </section>
        </div>

        {/* Middle Link Row */}
        <div className="border-t border-b border-neutral-300 py-5">
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px] font-medium text-neutral-700">
            {text.footerLinks.map((item, index) => (
              <div key={item.label} className="flex items-center gap-5">
                <Link href={item.href} className="transition-colors hover:text-neutral-900">
                  {item.label}
                </Link>
                {index < text.footerLinks.length - 1 && (
                  <span className="text-neutral-300">|</span>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom Company Row */}
        <div className="grid gap-6 py-6 lg:grid-cols-[1fr_auto] lg:items-end">
          {/* Company Info — 3줄, 좁은 줄간격 */}
          <section className="space-y-0.5 text-[13px] font-medium text-neutral-700">
            <p className="leading-tight">
              {text.companyNameEn} / {text.companyNameKo}
            </p>
            <p className="leading-tight">
              {text.ceoLabel} {text.ceoName} / {text.licenseLabel}
              {text.licenseValue ? ` ${text.licenseValue}` : ''}
            </p>
            <p className="leading-tight text-neutral-600">
              {text.address} / {text.copyright}
            </p>
          </section>

          {/* 회사 로고 — 오른쪽 아래, 샘플과 비슷한 크기 */}
          <div className="flex justify-start lg:justify-end">
            <AbuLogo href="/" src="/images/Logo.png" className="h-8 w-24" invert={false} />
          </div>
        </div>
      </div>
    </footer>
  )
}
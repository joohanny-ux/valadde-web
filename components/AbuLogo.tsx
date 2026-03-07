'use client'

import Link from 'next/link'
import Image from 'next/image'

/**
 * ABU 로고 이미지
 * invert: 다크 배경용 흰색 로고 (검은 로고에 filter 적용)
 */
export default function AbuLogo({
  href = '/',
  className = '',
  invert = true,
}: {
  href?: string
  className?: string
  invert?: boolean
}) {
  const logo = (
    <Image
      src="/images/Logo.png"
      alt="ABU - ANSWER BY BEAUTY"
      width={160}
      height={64}
      sizes="(max-width: 768px) 120px, 160px"
      className={`object-contain ${invert ? 'brightness-0 invert' : ''} ${className}`}
      priority
      quality={90}
    />
  )

  return href ? (
    <Link href={href} className="inline-block hover:opacity-90 transition-opacity">
      {logo}
    </Link>
  ) : (
    logo
  )
}

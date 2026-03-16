'use client'

import Link from 'next/link'
import Image from 'next/image'

/** 헤더용 로고. 새 로고는 public/images/logo-abu-commercial-hub.png에 넣고 src로 지정 가능 */
const LOGO_SRC = '/images/Logo.png'

/**
 * ABU 로고 이미지
 * invert: 다크 배경용 흰색 로고 (검은 로고에 filter 적용)
 */
export default function AbuLogo({
  href = '/',
  className = '',
  invert = false,
  src,
}: {
  href?: string
  className?: string
  invert?: boolean
  /** 로고 이미지 경로. 미지정 시 Logo.png 사용 */
  src?: string
}) {
  const imgSrc = src ?? LOGO_SRC

  const logo = (
    <span className={`relative inline-block h-10 w-24 ${className}`}>
      <Image
        src={imgSrc}
        alt="ABU Commercial Hub"
        fill
        sizes="(max-width: 768px) 96px, 96px"
        className={`object-contain object-left ${invert ? 'brightness-0 invert' : ''}`}
        priority
        quality={90}
      />
    </span>
  )

  return href ? (
    <Link href={href} className="inline-block hover:opacity-90 transition-opacity">
      {logo}
    </Link>
  ) : (
    logo
  )
}

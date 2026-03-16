'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getMessages } from '@/messages'

type MemberType = 'creator' | 'buyer' | 'brand'

const copy = getMessages('ko')

const tabsByType: Record<MemberType, { label: string; href: string }[]> = {
  creator: [
    { label: copy.member.subnav.dashboard, href: '/creator' },
    { label: copy.member.subnav.selected, href: '/creator/sale-request' },
    { label: copy.member.subnav.deals, href: '/creator/orders' },
    { label: copy.member.subnav.payments, href: '/creator/orders' },
    { label: copy.member.subnav.deliveries, href: '/creator/orders' },
  ],
  buyer: [
    { label: copy.member.subnav.dashboard, href: '/buyer' },
    { label: 'Purchase Orders', href: '/buyer/po' },
    { label: copy.member.subnav.deals, href: '/buyer/orders' },
    { label: copy.member.subnav.payments, href: '/buyer/orders' },
    { label: copy.member.subnav.deliveries, href: '/buyer/orders' },
  ],
  brand: [
    { label: copy.member.subnav.dashboard, href: '/brand' },
    { label: 'Requests', href: '/brand/requests' },
    { label: 'New Product', href: '/brand/new-product' },
    { label: 'Review Request', href: '/brand/review-request' },
  ],
}

export default function MemberSubnav({ memberType }: { memberType: MemberType }) {
  const pathname = usePathname()
  const tabs = tabsByType[memberType]

  return (
    <div className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3">
        {tabs.map((tab) => {
          const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`)
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm transition-colors ${
                active ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {tab.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

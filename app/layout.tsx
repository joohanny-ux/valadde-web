import type { Metadata } from 'next'
import { Cormorant_Garamond, Outfit } from 'next/font/google'
import './globals.css'

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-serif',
})

const sans = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'ABU BUSINESS HUB',
  description: '크리에이터, 바이어, 브랜드를 연결하는 K-Beauty 허브',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className={`${serif.variable} ${sans.variable}`}>
      <body className="bg-gray-50 text-sm text-neutral-900 antialiased leading-normal">{children}</body>
    </html>
  )
}

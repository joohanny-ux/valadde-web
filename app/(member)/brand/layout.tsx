import { MemberGuard } from '@/components/MemberGuard'

export default function BrandLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MemberGuard allowedType="brand">{children}</MemberGuard>
}

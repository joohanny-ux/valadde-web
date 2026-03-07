import { MemberGuard } from '@/components/MemberGuard'

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MemberGuard allowedType="buyer">{children}</MemberGuard>
}

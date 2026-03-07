import { MemberGuard } from '@/components/MemberGuard'

export default function CreatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MemberGuard allowedType="creator">{children}</MemberGuard>
}

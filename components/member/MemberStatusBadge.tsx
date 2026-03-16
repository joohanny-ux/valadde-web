const statusStyles: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  submitted: 'bg-blue-100 text-blue-700',
  confirmed: 'bg-emerald-100 text-emerald-700',
  invoiced: 'bg-violet-100 text-violet-700',
  shipped: 'bg-sky-100 text-sky-700',
  cancelled: 'bg-rose-100 text-rose-700',
}

const statusLabels: Record<string, string> = {
  pending: '대기중',
  submitted: '제출됨',
  confirmed: '확정됨',
  invoiced: '인보이스',
  shipped: '배송중',
  cancelled: '취소됨',
}

export default function MemberStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
        statusStyles[status] || 'bg-neutral-100 text-neutral-600'
      }`}
    >
      {statusLabels[status] || status}
    </span>
  )
}

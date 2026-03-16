import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function NoticeListPage() {
  const { data: notices, error } = await supabase
    .from('notices')
    .select('id, title, is_pinned, created_at')
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="mb-6 text-3xl font-semibold tracking-tight text-neutral-900">공지사항</h1>
        <p className="text-red-600">공지를 불러올 수 없습니다. ({error?.message ?? String(error)})</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <h1 className="mb-10 text-4xl font-semibold tracking-tight text-neutral-900">공지사항</h1>

      <ul className="overflow-hidden rounded-[28px] border border-neutral-200 divide-y divide-neutral-200 bg-white shadow-sm">
        {(notices ?? []).length === 0 ? (
          <li className="p-10 text-center text-sm text-neutral-500">등록된 공지가 없습니다.</li>
        ) : (
          (notices ?? []).map((n) => (
            <li key={n.id}>
              <Link
                href={`/notice/${n.id}`}
                className="flex items-center justify-between p-5 text-sm transition-colors hover:bg-neutral-50"
              >
                <span className="flex items-center gap-2">
                  {n.is_pinned && (
                    <span className="rounded-full bg-neutral-900 px-2 py-1 text-[10px] text-white">
                      고정
                    </span>
                  )}
                  <span className="font-medium">{n.title}</span>
                </span>
                <span className="text-xs text-neutral-500">
                  {new Date(n.created_at).toLocaleDateString('ko-KR')}
                </span>
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}

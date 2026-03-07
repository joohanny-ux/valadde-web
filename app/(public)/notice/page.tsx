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
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="font-serif text-2xl font-bold mb-6">공지사항</h1>
        <p className="text-abu-pink">공지를 불러올 수 없습니다. ({error?.message ?? String(error)})</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-14">
      <h1 className="font-serif text-xl md:text-2xl font-bold mb-10">공지사항</h1>

      <ul className="divide-y divide-abu-gray border border-abu-gray rounded-lg overflow-hidden">
        {(notices ?? []).length === 0 ? (
          <li className="p-10 text-center text-white/60 text-sm">등록된 공지가 없습니다.</li>
        ) : (
          (notices ?? []).map((n) => (
            <li key={n.id}>
              <Link
                href={`/notice/${n.id}`}
                className="flex items-center justify-between p-4 hover:bg-abu-charcoal transition-colors text-sm"
              >
                <span className="flex items-center gap-2">
                  {n.is_pinned && (
                    <span className="text-[10px] bg-abu-pink/20 text-abu-pink px-2 py-0.5 rounded">
                      고정
                    </span>
                  )}
                  <span className="font-medium">{n.title}</span>
                </span>
                <span className="text-xs text-white/60">
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

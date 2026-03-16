import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'

export default async function BrandsPage() {
  const { data: brands, error } = await supabase
    .from('brands')
    .select('id, name, name_kr, slug, logo_url')
    .eq('is_active', true)
    .order('display_order')
    .order('name')

  if (error) {
    return <p className="p-4 text-red-600">오류: {error.message}</p>
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
      <div className="mb-10 max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-900">Brands</h1>
        <p className="mt-3 text-base leading-7 text-neutral-600">
          카테고리와 브랜드를 함께 탐색하고, 바로 상품 목록으로 이어질 수 있도록 정리했습니다.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {(brands ?? []).map((b) => (
          <Link
            key={b.id}
            href={`/products?brand=${b.id}`}
            className="flex flex-col items-center rounded-[28px] border border-neutral-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            {b.logo_url ? (
              <div className="relative w-24 h-24 mb-2">
                <Image
                  src={b.logo_url}
                  alt={b.name_kr || b.name}
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="mb-2 flex h-24 w-24 items-center justify-center rounded-2xl bg-neutral-100 text-sm text-neutral-500">
                {b.name.charAt(0)}
              </div>
            )}
            <span className="text-center text-sm font-medium text-neutral-900">{b.name_kr || b.name}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

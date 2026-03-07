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
    return <p className="text-abu-pink p-4">오류: {error.message}</p>
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="font-serif text-2xl md:text-3xl font-bold mb-8">브랜드</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {(brands ?? []).map((b) => (
          <Link
            key={b.id}
            href={`/products?brand=${b.id}`}
            className="flex flex-col items-center p-4 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 transition-colors"
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
              <div className="w-24 h-24 mb-2 flex items-center justify-center bg-white/5 rounded text-white/50 text-sm">
                {b.name.charAt(0)}
              </div>
            )}
            <span className="text-sm text-white/90 font-medium">{b.name_kr || b.name}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

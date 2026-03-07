import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (error || !product) {
    notFound()
  }

  const [brandRes, categoryRes] = await Promise.all([
    product.brand_id ? supabase.from('brands').select('id, name').eq('id', product.brand_id).single() : { data: null },
    product.category_id ? supabase.from('categories').select('id, name').eq('id', product.category_id).single() : { data: null },
  ])
  const brand = brandRes.data
  const category = categoryRes.data
  const specs = (product.specs as Record<string, unknown>) ?? {}
  const images = (product.images as string[]) ?? []

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Link
        href="/products"
        className="text-white/60 hover:text-white text-sm mb-8 inline-block transition-colors"
      >
        ← 상품 목록
      </Link>

      <div className="grid md:grid-cols-2 gap-10">
        {/* 이미지 */}
        <div className="space-y-3">
          <div
            className="aspect-square bg-abu-gray rounded-lg bg-cover bg-center border border-abu-gray"
            style={images[0] ? { backgroundImage: `url(${images[0]})` } : undefined}
          />
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.slice(1, 5).map((url, i) => (
                <div
                  key={i}
                  className="w-20 h-20 shrink-0 bg-abu-gray rounded bg-cover border border-abu-gray"
                  style={{ backgroundImage: `url(${url})` }}
                />
              ))}
            </div>
          )}
        </div>

        {/* 상품 정보 */}
        <div>
          {brand && (
            <p className="text-sm text-white/60 mb-2">{brand.name}</p>
          )}
          <h1 className="font-serif text-2xl md:text-3xl font-bold mb-3">{product.name}</h1>
          {product.name_en && (
            <p className="text-white/70 mb-6">{product.name_en}</p>
          )}
          <div className="text-2xl font-semibold mb-8">
            {product.promotion_price != null ? (
              <>
                <span className="text-abu-pink">{product.promotion_price.toLocaleString()}원</span>
                {product.price != null && (
                  <span className="text-lg line-through text-white/50 ml-2">
                    {product.price.toLocaleString()}원
                  </span>
                )}
              </>
            ) : product.price != null ? (
              `${product.price.toLocaleString()}원`
            ) : (
              '가격 문의'
            )}
          </div>
          {product.short_description && (
            <p className="text-white/80 mb-8">{product.short_description}</p>
          )}

          {/* CTA */}
          <div className="flex flex-wrap gap-3 mb-10">
            <Link
              href={`/creator/sale-request?productId=${product.id}`}
              className="px-5 py-3 bg-abu-pink text-abu-dark rounded-lg hover:bg-abu-pink-dark font-medium transition-colors"
            >
              판매 의사 신청 (크리에이터)
            </Link>
            <Link
              href={`/buyer/po?productId=${product.id}`}
              className="px-5 py-3 border border-abu-pink text-abu-pink rounded-lg hover:bg-abu-pink/10 transition-colors"
            >
              PO 작성 (바이어)
            </Link>
            <a
              href={`mailto:contact@valadde.com?subject=검수 요청: ${product.name}`}
              className="px-5 py-3 border border-abu-gray rounded-lg hover:bg-abu-gray/30 text-white/90 transition-colors"
            >
              검수 요청 (브랜드)
            </a>
          </div>

          {/* 스펙 */}
          {Object.keys(specs).length > 0 && (
            <div className="border-t border-abu-gray pt-8">
              <h2 className="font-semibold mb-4">상품 정보</h2>
              <table className="w-full text-sm">
                <tbody>
                  {Object.entries(specs).map(([k, v]) => (
                    <tr key={k} className="border-b border-abu-gray">
                      <td className="py-3 text-white/60 w-32">{k}</td>
                      <td className="py-3">{String(v)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* 상세 설명 */}
      {product.description && (
        <div className="mt-16 border-t border-abu-gray pt-10">
          <h2 className="font-semibold mb-6">상세 설명</h2>
          <div
            className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-white/80 prose-li:text-white/80"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import type { ProductPageData } from '@/lib/product-pages'
import { ProductInfoPageLayout } from '@/components/admin/ProductInfoPageLayout'

type ProductWithMeta = ProductPageData & {
  name_kr?: string
  name_en?: string
  brand?: string
}

export default function CatalogClient({ products }: { products: ProductWithMeta[] }) {
  const [popupProduct, setPopupProduct] = useState<ProductWithMeta | null>(null)

  if (products.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center text-gray-500">
        게시된 상품이 없습니다. 상품관리에서 상품을 선택한 뒤 &apos;상품페이지 생성&apos; → &apos;상품 페이지 게시&apos;를 진행해주세요.
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((p) => (
          <button
            key={p.productId}
            type="button"
            onClick={() => setPopupProduct(p)}
            className="border rounded-lg overflow-hidden hover:border-blue-500 transition-colors text-left"
          >
            <div className="aspect-square bg-gray-100">
              <img
                src={`data:image/png;base64,${p.basicImageBase64}`}
                alt={p.name_kr ?? p.productInfo.name_kr}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-3">
              <p className="font-medium text-sm line-clamp-1">{p.name_kr ?? p.productInfo.name_kr}</p>
              <p className="text-xs text-gray-500">{p.brand ?? p.productInfo.brand}</p>
            </div>
          </button>
        ))}
      </div>

      {popupProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 sm:p-6"
          onClick={() => setPopupProduct(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-[75vw] max-w-5xl h-[88vh] max-h-[900px] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex justify-between shrink-0">
              <span className="font-semibold text-lg">상품 정보</span>
              <button
                type="button"
                onClick={() => setPopupProduct(null)}
                className="text-gray-500 hover:text-black text-2xl leading-none w-8 h-8 flex items-center justify-center"
              >
                ×
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-auto p-4">
              <ProductInfoPageLayout basicImageBase64={popupProduct.basicImageBase64} productInfo={popupProduct.productInfo} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

'use client'

export type ProductInfo = {
  brand: string
  category_1: string
  category_2: string
  category_3: string
  name_kr: string
  name_en: string
  volume: string
  msrp: number | null
}

/** 상품 정보 페이지 레이아웃 - 첨부 디자인: 빨강(1:1 이미지) | 노랑(정보) | 초록(브랜드 배너) */
export function ProductInfoPageLayout({
  basicImageBase64,
  productInfo,
}: {
  basicImageBase64: string
  productInfo: ProductInfo
}) {
  return (
    <div className="flex flex-col h-full min-h-0">
      {/* 상단: [빨강] 생성된 상품 이미지(1:1) | [노랑] 상품 정보 텍스트 */}
      <div className="flex gap-6 p-6 flex-1 min-h-0">
        {/* 빨강: 생성된 상품 이미지 (1:1 사이즈), 좌측 약 50% */}
        <div className="w-[min(45%,360px)] shrink-0">
          <div className="aspect-square w-full rounded-lg overflow-hidden bg-gray-50 border">
            <img
              src={`data:image/png;base64,${basicImageBase64}`}
              alt="상품"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        {/* 노랑: 상품 정보 텍스트, 우측 나머지 */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="w-20 h-8 bg-emerald-100 rounded mb-3 flex items-center justify-center text-xs text-gray-600">브랜드 로고</div>
          <div className="text-base space-y-1.5">
            <p><span className="text-gray-500">Brand</span> | {productInfo.brand || '-'}</p>
            <p><span className="text-gray-500">Category</span> | {[productInfo.category_1, productInfo.category_2, productInfo.category_3].filter(Boolean).join(' / ') || '-'}</p>
            <p className="font-medium text-lg">{productInfo.name_kr || '-'}</p>
            <p>{productInfo.name_en || '-'}</p>
            <p><span className="text-gray-500">Volume</span> | {productInfo.volume || '-'}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <p><span className="text-gray-500">Retail Price</span> | KRW / {productInfo.msrp != null ? productInfo.msrp.toLocaleString() : '-'}</p>
              <span className="px-2 py-0.5 bg-emerald-500 text-white rounded text-xs font-medium">Request</span>
            </div>
          </div>
        </div>
      </div>
      {/* 하단: [초록] 브랜드 정보 이미지 - 가로 배너 비율 */}
      <div className="shrink-0 px-6 pb-6">
        <div className="w-full aspect-[4/1] min-h-[80px] max-h-[140px] bg-slate-100 rounded-lg flex items-center justify-center text-sm text-gray-500">
          브랜드 소개 이미지 (차후 설정)
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect, useCallback } from 'react'
import type { ProductWithMeta } from '@/lib/products-file'
import { ProductInfoPageLayout } from '@/components/admin/ProductInfoPageLayout'

const DEFAULT_PROMPT = `Create a clean product image on a pure white (#FFFFFF) studio background.
Make the product sharp and clear.
Use a front-facing angle.
Keep the product shape, label, color, and packaging details as close to the original as possible.
Do not add extra objects, props, text, hands, or decorations.
Center the product in the frame.
Change the entire background to solid pure white #FFFFFF. The background must be completely flat white with zero shadows, gradients, or color variation.`

const DEFAULT_NEGATIVE = `Do not change the packaging design.
Do not alter the label text.
Do not add extra objects.
Do not create a side angle.
Do not distort the shape.
Do not add shadows on the background.
No grey or off-white background.
No gradients on the background.`

function downloadBase64(base64: string, filename: string) {
  const a = document.createElement('a')
  a.href = `data:image/png;base64,${base64}`
  a.download = filename
  a.click()
}

function getDownloadFilename(brand: string, nameEn: string, suffix: string): string {
  const safe = `${brand}_${nameEn}`.replace(/[<>:"/\\|?*]/g, '_').replace(/\s+/g, ' ')
  return `${safe}_${suffix}.png`
}

export default function ProductPageClient({ product }: { product: ProductWithMeta }) {
  const [productImages, setProductImages] = useState<{ name: string; url: string }[]>([])
  const [hiddenImages, setHiddenImages] = useState<string[]>([])
  const [expectedFilename, setExpectedFilename] = useState<string>('')
  const [uploading, setUploading] = useState(false)
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null)
  const [selectedImageBase64, setSelectedImageBase64] = useState<string | null>(null)

  const [basicPrompt, setBasicPrompt] = useState(DEFAULT_PROMPT)
  const [negativePrompt, setNegativePrompt] = useState(DEFAULT_NEGATIVE)
  const [basicLoading, setBasicLoading] = useState(false)
  const [basicImage, setBasicImage] = useState<string | null>(null)

  const [pagePreview, setPagePreview] = useState<string | null>(null)
  const [publishing, setPublishing] = useState(false)
  const [isPublished, setIsPublished] = useState(false)

  const brand = (product.brand ?? '').trim()
  const nameEn = (product.name_en ?? '').trim()
  const productInfo = {
    brand,
    category_1: product.category_1 ?? '',
    category_2: product.category_2 ?? '',
    category_3: product.category_3 ?? '',
    name_kr: product.name_kr ?? '',
    name_en: nameEn,
    volume: product.volume ?? '',
    msrp: product.msrp ?? null,
  }

  const fetchImages = useCallback(async () => {
    const res = await fetch(`/api/admin/products/${product.id}/product-page/images`)
    const data = await res.json()
    if (Array.isArray(data.images)) setProductImages(data.images)
    if (Array.isArray(data.hiddenImages)) setHiddenImages(data.hiddenImages)
    if (data.expectedFilename) setExpectedFilename(data.expectedFilename)
    return data
  }, [product.id])

  useEffect(() => {
    fetchImages()
  }, [fetchImages])

  useEffect(() => {
    fetch(`/api/admin/products/${product.id}/product-page/produced-image`)
      .then((r) => r.json())
      .then((d) => { if (d?.imageBase64) setBasicImage(d.imageBase64) })
      .catch(() => {})
  }, [product.id])

  useEffect(() => {
    fetch(`/api/admin/products/product-pages/status?productId=${product.id}`)
      .then((r) => r.json())
      .then((d) => setIsPublished(!!d.published))
      .catch(() => {})
  }, [product.id])

  const refreshImages = useCallback(() => {
    fetchImages().then((data) => {
      const imgs = data?.images as { name: string; url: string }[] | undefined
      if (imgs?.length) setSelectedImageUrl(imgs[0].url)
    })
  }, [fetchImages])

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) {
      alert('이미지 파일을 선택해주세요.')
      return
    }
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch(`/api/admin/products/${product.id}/product-page/images/upload`, {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message ?? '업로드 실패')
      const refreshed = await fetchImages()
      const imgs = refreshed?.images as { name: string; url: string }[] | undefined
      if (imgs?.length) setSelectedImageUrl(imgs.find((i) => i.name === data.filename)?.url ?? imgs[0].url)
      e.target.value = ''
    } catch (err) {
      alert(err instanceof Error ? err.message : '업로드 실패')
    } finally {
      setUploading(false)
    }
  }

  async function handleDeleteImage(img: { name: string; url: string }) {
    if (!confirm(`"${img.name}" 이미지를 페이지에서 제거하시겠습니까? (폴더에는 그대로 유지됩니다)`)) return
    try {
      const res = await fetch(
        `/api/admin/products/${product.id}/product-page/images/delete?file=${encodeURIComponent(img.name)}`,
        { method: 'DELETE' }
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.message ?? '실패')
      if (selectedImageUrl === img.url) setSelectedImageUrl(null)
      setBasicImage(null)
      setPagePreview(null)
      refreshImages()
    } catch (err) {
      alert(err instanceof Error ? err.message : '실패')
    }
  }

  async function handleClearBasicImage() {
    try {
      await fetch(`/api/admin/products/${product.id}/product-page/produced-image`, { method: 'DELETE' })
    } catch {
      /* ignore */
    }
    setBasicImage(null)
    setPagePreview(null)
  }

  async function handleRestoreImage(filename: string) {
    try {
      const res = await fetch(
        `/api/admin/products/${product.id}/product-page/images/restore?file=${encodeURIComponent(filename)}`,
        { method: 'POST' }
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.message ?? '복원 실패')
      refreshImages()
    } catch (err) {
      alert(err instanceof Error ? err.message : '복원 실패')
    }
  }

  const loadImageAsBase64 = useCallback(async (url: string): Promise<string> => {
    const res = await fetch(url)
    const blob = await res.blob()
    return new Promise((resolve, reject) => {
      const r = new FileReader()
      r.onload = () => {
        const s = (r.result as string).split(',')[1]
        resolve(s ?? '')
      }
      r.onerror = reject
      r.readAsDataURL(blob)
    })
  }, [])

  useEffect(() => {
    if (selectedImageUrl && productImages.some((i) => i.url === selectedImageUrl)) {
      loadImageAsBase64(selectedImageUrl)
        .then(setSelectedImageBase64)
        .catch(() => setSelectedImageBase64(null))
    } else {
      setSelectedImageBase64(null)
    }
  }, [selectedImageUrl, productImages, loadImageAsBase64])

  useEffect(() => {
    if (productImages.length > 0 && !selectedImageUrl) {
      setSelectedImageUrl(productImages[0].url)
    }
  }, [productImages, selectedImageUrl])

  async function handleGenerateBasic() {
    if (!selectedImageBase64) {
      alert('상품 이미지를 선택해주세요.')
      return
    }
    setBasicLoading(true)
    setBasicImage(null)
    try {
      const res = await fetch(`/api/admin/products/${product.id}/product-page/generate-basic`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImageBase64,
          prompt: basicPrompt,
          negativePrompt: negativePrompt,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message ?? '실패')
      setBasicImage(data.imageBase64)
    } catch (err) {
      alert(err instanceof Error ? err.message : '기본 이미지 생성 실패')
    } finally {
      setBasicLoading(false)
    }
  }

  function handleCreatePage() {
    if (!basicImage) {
      alert('먼저 \'생성\' 버튼으로 기본 상품 이미지(600x600)를 생성해주세요.')
      return
    }
    setPagePreview(basicImage)
  }

  async function handlePublish() {
    if (!basicImage) {
      alert('먼저 \'생성\' 버튼으로 기본 상품 이미지를 생성해주세요.')
      return
    }
    setPublishing(true)
    try {
      const res = await fetch(`/api/admin/products/product-pages/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          productInfo,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message ?? '게시 실패')
      setIsPublished(true)
      alert('상품 페이지가 게시되었습니다.')
      window.open('/admin/products/catalog', '_blank')
    } catch (err) {
      alert(err instanceof Error ? err.message : '게시 실패')
    } finally {
      setPublishing(false)
    }
  }

  const displayBase64 = basicImage ?? selectedImageBase64

  return (
    <div className="space-y-6">
      {/* 템플릿 1: 상품 정보 + 상품 기본 이미지 */}
      <section className="border rounded-lg p-6 bg-white">
        <div className="grid md:grid-cols-2 gap-6">
          {/* 왼쪽: 상품 정보 */}
          <div>
            <h2 className="text-lg font-semibold mb-3">상품 정보</h2>
            <dl className="text-sm space-y-1.5">
              <p><span className="text-gray-500">Brand</span> | {productInfo.brand || '-'}</p>
              <p><span className="text-gray-500">Category</span> | {[productInfo.category_1, productInfo.category_2, productInfo.category_3].filter(Boolean).join(' / ') || '-'}</p>
              <p>{productInfo.name_kr || '-'}</p>
              <p>{productInfo.name_en || '-'}</p>
              <p><span className="text-gray-500">Volume</span> | {productInfo.volume || '-'}</p>
              <p><span className="text-gray-500">Retail Price</span> | {productInfo.msrp != null ? `KRW ${productInfo.msrp.toLocaleString()}` : '-'}</p>
            </dl>
          </div>

          {/* 오른쪽: 상품 기본 이미지 */}
          <div>
            <h2 className="text-lg font-semibold mb-3">상품 기본 이미지</h2>
            <div className="flex gap-4 items-start">
              <div className="w-48 h-48 shrink-0 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                {displayBase64 ? (
                  <img src={`data:image/png;base64,${displayBase64}`} alt="상품" className="w-full h-full object-contain" />
                ) : (
                  <div className="text-center text-gray-400 text-sm p-4">
                    이미지 불러오기/업로드 후 생성
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                {/* 상품 이미지 소스: 불러오기 또는 업로드 */}
                <div className="flex flex-wrap gap-2">
                  {productImages.length === 0 ? (
                    <div className="flex flex-col gap-2">
                      {expectedFilename && (
                        <p className="text-xs text-gray-500">
                          권장 파일명: <code className="bg-gray-100 px-1 rounded">{expectedFilename}</code>.png (products/images 폴더)
                        </p>
                      )}
                      <label className="inline-flex px-3 py-1.5 bg-blue-600 text-white rounded text-sm cursor-pointer hover:bg-blue-700">
                        <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} className="hidden" />
                        {uploading ? '업로드 중...' : '업로드'}
                      </label>
                    </div>
                  ) : (
                    <>
                      {productImages.map((img) => (
                        <div key={img.name} className={`relative border rounded overflow-hidden ${selectedImageUrl === img.url ? 'ring-2 ring-blue-500' : ''}`}>
                          <button type="button" onClick={() => setSelectedImageUrl(img.url)}>
                            <img src={img.url} alt="" className="w-12 h-12 object-cover" />
                          </button>
                          <button type="button" onClick={() => handleDeleteImage(img)} className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs">×</button>
                        </div>
                      ))}
                      <label className="inline-flex w-12 h-12 border-2 border-dashed border-gray-300 rounded items-center justify-center cursor-pointer text-gray-500 text-xs">
                        <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} className="hidden" />+
                      </label>
                    </>
                  )}
                  <button type="button" onClick={refreshImages} className="text-xs px-2 py-1 border rounded hover:bg-gray-100">새로고침</button>
                </div>
                {hiddenImages.length > 0 && (
                  <div className="text-xs text-gray-500 mt-2">
                    <span>숨긴 이미지: </span>
                    {hiddenImages.map((f) => (
                      <span key={f} className="inline-flex items-center gap-1 mr-2">
                        <span>{f}</span>
                        <button type="button" onClick={() => handleRestoreImage(f)} className="text-blue-600 hover:underline">복원</button>
                      </span>
                    ))}
                  </div>
                )}
                {/* 생성/재생성/다운로드 */}
                <div className="flex gap-2">
                  <button type="button" onClick={handleGenerateBasic} disabled={basicLoading || !selectedImageBase64} className="px-3 py-1.5 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200 disabled:opacity-50">
                    {basicLoading ? '생성 중...' : '생성'}
                  </button>
                  {basicImage && (
                    <>
                      <button type="button" onClick={handleGenerateBasic} disabled={basicLoading} className="px-3 py-1.5 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200">재생성</button>
                      <button type="button" onClick={() => downloadBase64(basicImage, getDownloadFilename(brand, nameEn, 'basic'))} className="px-3 py-1.5 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200">다운로드</button>
                      <button type="button" onClick={handleClearBasicImage} className="px-3 py-1.5 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200">제거</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 프롬프트 (접기 가능) */}
        <details className="mt-4">
          <summary className="cursor-pointer text-sm text-gray-500">AI 이미지 생성 프롬프트</summary>
          <div className="mt-2 space-y-2">
            <textarea value={basicPrompt} onChange={(e) => setBasicPrompt(e.target.value)} className="w-full px-2 py-1 border rounded text-xs min-h-[60px]" placeholder="프롬프트" />
            <textarea value={negativePrompt} onChange={(e) => setNegativePrompt(e.target.value)} className="w-full px-2 py-1 border rounded text-xs min-h-[40px]" placeholder="네거티브" />
          </div>
        </details>

        {/* 생성된 기본 상품 이미지 미리보기 */}
        {basicImage && (
          <div className="mt-4 pt-4 border-t">
            <h3 className="text-sm font-medium text-gray-700 mb-2">생성된 기본 상품 이미지 미리보기 (600x600) · products/images/produced 저장됨</h3>
            <div className="flex items-start gap-4">
              <img src={`data:image/png;base64,${basicImage}`} alt="기본 상품 이미지" className="w-48 h-48 object-contain border rounded-lg bg-white shadow-sm" />
              <div className="flex gap-2">
                <button type="button" onClick={() => downloadBase64(basicImage, getDownloadFilename(brand, nameEn, 'basic'))} className="px-3 py-1.5 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200">다운로드</button>
                <button type="button" onClick={handleGenerateBasic} disabled={basicLoading} className="px-3 py-1.5 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200">재생성</button>
                <button type="button" onClick={handleClearBasicImage} className="px-3 py-1.5 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200">제거</button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 상품 페이지 생성 버튼 */}
      <section className="border rounded-lg p-6 bg-white">
        <button
          type="button"
          onClick={handleCreatePage}
          disabled={!basicImage}
          className="w-full md:w-auto px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 font-medium"
        >
          상품 페이지 생성
        </button>
      </section>

      {/* 상품 페이지 미리보기 */}
      {pagePreview && (
        <section className="border rounded-lg p-6 bg-white">
          <h2 className="text-lg font-semibold mb-3">상품 페이지 미리보기</h2>
          <p className="text-sm text-gray-500 mb-2">이미지를 클릭하면 팝업으로 상품 정보를 볼 수 있습니다.</p>
          <div className="bg-gray-50 rounded-lg p-4">
            <ProductInfoPopup
              basicImageBase64={pagePreview}
              productInfo={productInfo}
              trigger={
                <div className="cursor-pointer max-w-lg mx-auto">
                  <ProductInfoPageLayout basicImageBase64={pagePreview} productInfo={productInfo} />
                </div>
              }
            />
          </div>
        </section>
      )}

      {/* 상품 페이지 게시 */}
      <section className="border rounded-lg p-6 bg-white">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePublish}
            disabled={publishing || !basicImage}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 font-medium"
          >
            {publishing ? '게시 중...' : '상품 페이지 게시'}
          </button>
          {isPublished && <span className="text-green-600 text-sm">✓ 게시됨</span>}
        </div>
      </section>
    </div>
  )
}

function ProductInfoPopup({
  basicImageBase64,
  productInfo,
  trigger,
}: {
  basicImageBase64: string
  productInfo: { brand: string; category_1: string; category_2: string; category_3: string; name_kr: string; name_en: string; volume: string; msrp: number | null }
  trigger: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="block w-full text-left">
        {trigger}
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 sm:p-6" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-lg shadow-xl w-[75vw] max-w-5xl h-[88vh] max-h-[900px] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b flex justify-between shrink-0">
              <span className="font-semibold text-lg">상품 정보</span>
              <button type="button" onClick={() => setOpen(false)} className="text-gray-500 hover:text-black text-2xl leading-none w-8 h-8 flex items-center justify-center">×</button>
            </div>
            <div className="flex-1 min-h-0 overflow-auto p-4">
              <ProductInfoPageLayout basicImageBase64={basicImageBase64} productInfo={productInfo} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

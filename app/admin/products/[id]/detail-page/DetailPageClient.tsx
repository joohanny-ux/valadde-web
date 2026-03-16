'use client'

import { useState, useEffect, useCallback } from 'react'
import type { ProductWithMeta } from '@/lib/products-file'

const DEFAULT_PROMPT = `Create a clean product image on a pure white studio background.
Make the product sharp and clear.
Use a front-facing angle.
Keep the product shape, label, color, and packaging details as close to the original as possible.
Do not add extra objects, props, text, shadows, hands, or decorations.
Center the product in the frame.`

const DEFAULT_NEGATIVE = `Do not change the packaging design.
Do not alter the label text.
Do not add extra objects.
Do not create a side angle.
Do not distort the shape.`

const STYLE_1_PROMPT = `깔끔하고 상품 정보에 맞는 라이프스타일로 창의적으로 생성`
const STYLE_2_PROMPT = `상품 정보와 사용 부위 등을 분석하여 손 모델 또는 인물 모델 포함하여 사용 장소를 배경으로 생성`

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

export default function DetailPageClient({ product }: { product: ProductWithMeta }) {
  const [productImages, setProductImages] = useState<{ name: string; url: string }[]>([])
  const [expectedFilename, setExpectedFilename] = useState<string>('')
  const [uploading, setUploading] = useState(false)
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null)
  const [selectedImageBase64, setSelectedImageBase64] = useState<string | null>(null)

  const [basicPrompt, setBasicPrompt] = useState(DEFAULT_PROMPT)
  const [negativePrompt, setNegativePrompt] = useState(DEFAULT_NEGATIVE)
  const [basicLoading, setBasicLoading] = useState(false)
  const [basicImage, setBasicImage] = useState<string | null>(null)

  const [productFeatures, setProductFeatures] = useState('')
  const [style1Prompt, setStyle1Prompt] = useState(STYLE_1_PROMPT)
  const [style2Prompt, setStyle2Prompt] = useState(STYLE_2_PROMPT)
  const [styleLoading, setStyleLoading] = useState(false)
  const [styleImages, setStyleImages] = useState<[string | null, string | null]>([null, null])

  const [copywriting, setCopywriting] = useState('')
  const [designConcept, setDesignConcept] = useState('')
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailImage, setDetailImage] = useState<string | null>(null)

  const brand = (product.brand ?? '').trim()
  const nameEn = (product.name_en ?? '').trim()

  const fetchImages = useCallback(async () => {
    const res = await fetch(`/api/admin/products/${product.id}/detail-page/images`)
    const data = await res.json()
    if (Array.isArray(data.images)) setProductImages(data.images)
    if (data.expectedFilename) setExpectedFilename(data.expectedFilename)
    return data
  }, [product.id])

  useEffect(() => {
    fetchImages()
  }, [fetchImages])

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
      const res = await fetch(`/api/admin/products/${product.id}/detail-page/images/upload`, {
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
    if (!confirm(`"${img.name}" 이미지를 삭제하시겠습니까?`)) return
    try {
      const res = await fetch(
        `/api/admin/products/${product.id}/detail-page/images/delete?file=${encodeURIComponent(img.name)}`,
        { method: 'DELETE' }
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.message ?? '삭제 실패')
      if (selectedImageUrl === img.url) setSelectedImageUrl(null)
      refreshImages()
    } catch (err) {
      alert(err instanceof Error ? err.message : '삭제 실패')
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
      alert('상품 이미지를 선택해주세요.\n\n이미지가 보이면 위 상품 이미지 중 하나를 클릭해 선택한 뒤 다시 시도해주세요.\n없다면 \'새로운 이미지를 업로드하세요\'로 업로드해주세요.')
      return
    }
    setBasicLoading(true)
    setBasicImage(null)
    try {
      const res = await fetch(`/api/admin/products/${product.id}/detail-page/generate-basic`, {
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

  async function handleGenerateStyle() {
    const base = basicImage ?? selectedImageBase64
    if (!base) {
      alert('먼저 기본 이미지를 생성하거나 상품 이미지를 선택해주세요.')
      return
    }
    setStyleLoading(true)
    setStyleImages([null, null])
    try {
      const res = await fetch(`/api/admin/products/${product.id}/detail-page/generate-style`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          basicImageBase64: base,
          productFeatures,
          style1Prompt,
          style2Prompt,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message ?? '실패')
      setStyleImages([data.image1Base64 ?? null, data.image2Base64 ?? null])
    } catch (err) {
      alert(err instanceof Error ? err.message : '연출 이미지 생성 실패')
    } finally {
      setStyleLoading(false)
    }
  }

  async function handleGenerateDetail() {
    const base = basicImage ?? selectedImageBase64
    if (!base) {
      alert('먼저 기본 이미지를 생성해주세요.')
      return
    }
    setDetailLoading(true)
    setDetailImage(null)
    try {
      const res = await fetch(`/api/admin/products/${product.id}/detail-page/generate-detail`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          basicImageBase64: base,
          styleImage1Base64: styleImages[0] || undefined,
          styleImage2Base64: styleImages[1] || undefined,
          copywriting,
          designConcept,
          productFeatures,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message ?? '실패')
      setDetailImage(data.imageBase64)
      if (data.suggestedCopywriting && !copywriting) setCopywriting(data.suggestedCopywriting)
      if (data.suggestedDesignConcept && !designConcept) setDesignConcept(data.suggestedDesignConcept)
    } catch (err) {
      alert(err instanceof Error ? err.message : '상세 페이지 생성 실패')
    } finally {
      setDetailLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* 1. 상품 정보 */}
      <section className="border rounded-lg p-6 bg-white">
        <h2 className="text-lg font-semibold mb-4">상품 정보</h2>
        <dl className="grid grid-cols-2 gap-2 text-sm">
          <dt className="text-gray-500">브랜드명</dt><dd>{brand || '-'}</dd>
          <dt className="text-gray-500">카테고리 1</dt><dd>{product.category_1 || '-'}</dd>
          <dt className="text-gray-500">카테고리 2</dt><dd>{product.category_2 || '-'}</dd>
          <dt className="text-gray-500">카테고리 3</dt><dd>{product.category_3 || '-'}</dd>
          <dt className="text-gray-500">상품명 한국어</dt><dd>{product.name_kr || '-'}</dd>
          <dt className="text-gray-500">상품명 영어</dt><dd>{nameEn || '-'}</dd>
          <dt className="text-gray-500">상품명 중국어</dt><dd>{product.name_cn_s || product.name_cn_f || '-'}</dd>
          <dt className="text-gray-500">상품 용량</dt><dd>{product.volume || '-'}</dd>
          <dt className="text-gray-500">소비자 가격</dt><dd>{product.msrp != null ? product.msrp.toLocaleString() : '-'}</dd>
        </dl>
      </section>

      {/* 2. 상품 이미지 */}
      <section className="border rounded-lg p-6 bg-white">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">상품 이미지</h2>
          <button
            type="button"
            onClick={refreshImages}
            className="text-sm px-2 py-1 border rounded hover:bg-gray-100"
          >
            새로고침
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-3">
          상품정보(&apos;브랜드명_상품명 영어&apos;)와 정확히 일치하는 이미지를 불러옵니다. images 폴더에서 파일 변경 시 새로고침을 눌러주세요.
        </p>
        {productImages.length === 0 ? (
          <div className="space-y-3">
            <p className="text-amber-600 text-sm">
              &apos;{expectedFilename || `${brand}_${nameEn}`}&apos; 와 일치하는 이미지가 없습니다.
            </p>
            <div>
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer text-sm">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                  onChange={handleUpload}
                  disabled={uploading}
                  className="hidden"
                />
                {uploading ? '업로드 중...' : '새로운 이미지를 업로드하세요'}
              </label>
              <p className="text-xs text-gray-500 mt-1">
                업로드 시 &apos;{expectedFilename || `${brand}_${nameEn}`}&apos;.png 로 저장됩니다.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3 items-start">
            {productImages.map((img) => (
              <div
                key={img.name}
                className={`relative border-2 rounded-lg overflow-hidden transition ${selectedImageUrl === img.url ? 'border-blue-600 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-400'}`}
              >
                <button
                  type="button"
                  onClick={() => setSelectedImageUrl(img.url)}
                  className="block w-full"
                >
                  <img src={img.url} alt={img.name} className="w-24 h-24 object-cover" />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleDeleteImage(img) }}
                  className="absolute top-0 right-0 w-6 h-6 bg-red-500 text-white text-xs rounded-bl hover:bg-red-600"
                  title="삭제"
                >
                  ×
                </button>
              </div>
            ))}
            <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 cursor-pointer text-gray-500 text-xs">
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                onChange={handleUpload}
                disabled={uploading}
                className="hidden"
              />
              {uploading ? '업로드 중...' : '+ 추가 업로드'}
            </label>
          </div>
        )}
      </section>

      {/* 3. 기본 이미지 생성 */}
      <section className="border rounded-lg p-6 bg-white">
        <h2 className="text-lg font-semibold mb-2">기본 이미지 생성</h2>
        <p className="text-sm text-gray-500 mb-4">600x600px, 흰 배경 상품 이미지</p>

        <div className="space-y-3 mb-4">
          <label className="block text-sm font-medium">프롬프트 (편집 가능)</label>
          <textarea
            value={basicPrompt}
            onChange={(e) => setBasicPrompt(e.target.value)}
            className="w-full px-3 py-2 border rounded text-sm min-h-[100px]"
            placeholder="기본 프롬프트"
          />
          <label className="block text-sm font-medium">네거티브 프롬프트</label>
          <textarea
            value={negativePrompt}
            onChange={(e) => setNegativePrompt(e.target.value)}
            className="w-full px-3 py-2 border rounded text-sm min-h-[80px]"
          />
        </div>

        <button
          type="button"
          onClick={handleGenerateBasic}
          disabled={basicLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {basicLoading ? '생성 중...' : '이미지 생성'}
        </button>

        {basicImage && (
          <div className="mt-4 p-4 border rounded bg-gray-50">
            <p className="text-sm font-medium mb-2">미리보기</p>
            <img
              src={`data:image/png;base64,${basicImage}`}
              alt="기본 이미지"
              className="w-48 h-48 object-contain border rounded"
            />
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => downloadBase64(basicImage, getDownloadFilename(brand, nameEn, 'basic'))}
                className="px-3 py-1 border rounded hover:bg-gray-200 text-sm"
              >
                Download
              </button>
              <button
                type="button"
                onClick={handleGenerateBasic}
                disabled={basicLoading}
                className="px-3 py-1 border rounded hover:bg-gray-200 text-sm"
              >
                재생성
              </button>
            </div>
          </div>
        )}
      </section>

      {/* 4. 연출 이미지 생성 */}
      <section className="border rounded-lg p-6 bg-white">
        <h2 className="text-lg font-semibold mb-2">연출 이미지 생성</h2>
        <p className="text-sm text-gray-500 mb-4">기본 이미지 기반, 600x600px, 2장</p>

        <div className="space-y-3 mb-4">
          <label className="block text-sm font-medium">상품 특징 (옵션)</label>
          <input
            type="text"
            value={productFeatures}
            onChange={(e) => setProductFeatures(e.target.value)}
            placeholder="사용 부위, 피부 타입 등"
            className="w-full px-3 py-2 border rounded text-sm"
          />
          <label className="block text-sm font-medium">연출 이미지 1 프롬프트</label>
          <input
            type="text"
            value={style1Prompt}
            onChange={(e) => setStyle1Prompt(e.target.value)}
            className="w-full px-3 py-2 border rounded text-sm"
          />
          <label className="block text-sm font-medium">연출 이미지 2 프롬프트</label>
          <input
            type="text"
            value={style2Prompt}
            onChange={(e) => setStyle2Prompt(e.target.value)}
            className="w-full px-3 py-2 border rounded text-sm"
          />
        </div>

        <button
          type="button"
          onClick={handleGenerateStyle}
          disabled={styleLoading || (!basicImage && !selectedImageBase64)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          {styleLoading ? '생성 중...' : '연출 이미지 생성'}
        </button>

        {(styleImages[0] || styleImages[1]) && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            {styleImages.map((img, i) =>
              img ? (
                <div key={i} className="p-4 border rounded bg-gray-50">
                  <p className="text-sm font-medium mb-2">연출 이미지 {i + 1}</p>
                  <img
                    src={`data:image/png;base64,${img}`}
                    alt={`style ${i + 1}`}
                    className="w-48 h-48 object-contain border rounded"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => downloadBase64(img, getDownloadFilename(brand, nameEn, `style_${i + 1}`))}
                      className="px-3 py-1 border rounded hover:bg-gray-200 text-sm"
                    >
                      Download
                    </button>
                    <button
                      type="button"
                      onClick={handleGenerateStyle}
                      disabled={styleLoading}
                      className="px-3 py-1 border rounded hover:bg-gray-200 text-sm"
                    >
                      재생성
                    </button>
                  </div>
                </div>
              ) : null
            )}
          </div>
        )}
      </section>

      {/* 5. 상세 페이지 생성 */}
      <section className="border rounded-lg p-6 bg-white">
        <h2 className="text-lg font-semibold mb-2">상세 페이지 생성</h2>
        <p className="text-sm text-gray-500 mb-4">
          기본이미지·연출이미지를 기반으로, products/productdetails/templete01.png 템플릿을 분석하여 860x1800px 상세페이지를 생성합니다. 카피·컨셉은 한국어로 입력. (가격 미포함)
        </p>

        <div className="space-y-3 mb-4">
          <label className="block text-sm font-medium">카피라이트 (한국어)</label>
          <input
            type="text"
            value={copywriting}
            onChange={(e) => setCopywriting(e.target.value)}
            placeholder="템플릿 분석 후 Gemini가 제안합니다"
            className="w-full px-3 py-2 border rounded text-sm"
          />
          <label className="block text-sm font-medium">디자인 컨셉</label>
          <input
            type="text"
            value={designConcept}
            onChange={(e) => setDesignConcept(e.target.value)}
            placeholder="디자인 포인트, 톤앤매너 (분석 후 제안)"
            className="w-full px-3 py-2 border rounded text-sm"
          />
        </div>

        <button
          type="button"
          onClick={handleGenerateDetail}
          disabled={detailLoading || (!basicImage && !selectedImageBase64)}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
        >
          {detailLoading ? '생성 중...' : '상세 페이지 생성'}
        </button>

        {detailImage && (
          <div className="mt-4 p-4 border rounded bg-gray-50">
            <p className="text-sm font-medium mb-2">미리보기 (860x1800)</p>
            <img
              src={`data:image/png;base64,${detailImage}`}
              alt="상세 페이지"
              className="max-w-full max-h-[400px] object-contain border rounded"
            />
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => downloadBase64(detailImage!, getDownloadFilename(brand, nameEn, 'detail'))}
                className="px-3 py-1 border rounded hover:bg-gray-200 text-sm"
              >
                Download
              </button>
              <button
                type="button"
                onClick={handleGenerateDetail}
                disabled={detailLoading}
                className="px-3 py-1 border rounded hover:bg-gray-200 text-sm"
              >
                재생성
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

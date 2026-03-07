'use client'

import { useState, useRef } from 'react'

type Product = { id: string; name: string; name_en: string | null; images: string[] | null }

type JobResult = {
  status: string
  specs?: Record<string, string>
  designSuggestion?: Record<string, { copy: string; designNotes: string; prompt: string }>
  generatedImages?: { image_01: string; image_02: string; image_03: string }
  errorMessage?: string
}

export default function DetailPageClient({ product }: { product: Product }) {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [running, setRunning] = useState(false)
  const [jobId, setJobId] = useState<string | null>(null)
  const [result, setResult] = useState<JobResult | null>(null)
  const [publishing, setPublishing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleRun() {
    if (!imageFile) {
      alert('상품 이미지를 업로드해주세요.')
      return
    }
    setRunning(true)
    setResult(null)
    try {
      const formData = new FormData()
      formData.append('image', imageFile)
      const res = await fetch(`/api/admin/products/${product.id}/detail-page/run`, {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message ?? '실행 실패')
      setJobId(data.jobId)
      pollStatus(data.jobId)
    } catch (err) {
      alert(err instanceof Error ? err.message : '오류')
      setRunning(false)
    }
  }

  async function pollStatus(jid: string) {
    const maxAttempts = 120
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise((r) => setTimeout(r, 2000))
      const res = await fetch(
        `/api/admin/products/${product.id}/detail-page/status?jobId=${jid}`
      )
      const data = await res.json()
      if (!res.ok) continue
      setResult(data)
      if (data.status === 'done' || data.status === 'error') {
        setRunning(false)
        return
      }
    }
    setRunning(false)
  }

  async function handleRegenerate(imageKey: string) {
    try {
      const res = await fetch(
        `/api/admin/products/${product.id}/detail-page/regenerate`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageKey }),
        }
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      if (result?.generatedImages) {
        setResult({
          ...result,
          generatedImages: { ...result.generatedImages, [imageKey]: data.imageUrl },
        })
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : '재생성 실패')
    }
  }

  async function handlePublish() {
    if (!result?.generatedImages) return
    setPublishing(true)
    try {
      const res = await fetch(
        `/api/admin/products/${product.id}/detail-page/publish`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            images: result.generatedImages,
            specs: result.specs ?? {},
          }),
        }
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      alert('게시되었습니다.')
      window.location.reload()
    } catch (err) {
      alert(err instanceof Error ? err.message : '게시 실패')
    } finally {
      setPublishing(false)
    }
  }

  function downloadImage(url: string, name: string) {
    const a = document.createElement('a')
    a.href = url
    a.download = name
    a.target = '_blank'
    a.click()
  }

  const imgs = result?.generatedImages

  return (
    <div className="space-y-8">
      <div className="border rounded-lg p-6 bg-gray-50">
        <h2 className="font-semibold mb-3">1. 상품 이미지 업로드</h2>
        <p className="text-sm text-gray-600 mb-3">
          이 이미지를 분석해 상품 정보를 검색하고, 상세페이지용 이미지를 생성합니다.
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
          className="block mb-3"
        />
        {imageFile && (
          <div className="flex items-center gap-4">
            <img
              src={URL.createObjectURL(imageFile)}
              alt="미리보기"
              className="w-24 h-24 object-cover rounded"
            />
            <button
              onClick={handleRun}
              disabled={running}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {running ? `진행 중... (${result?.status ?? '시작'})` : '상세페이지 생성 시작'}
            </button>
          </div>
        )}
      </div>

      {result && (
        <>
          {result.status === 'error' && (
            <div className="p-4 bg-red-50 text-red-700 rounded">
              오류: {result.errorMessage}
            </div>
          )}

          {result.specs && Object.keys(result.specs).length > 0 && (
            <div className="border rounded-lg p-6">
              <h2 className="font-semibold mb-3">상품 정보 (스펙)</h2>
              <dl className="grid gap-2 text-sm">
                {Object.entries(result.specs).map(([k, v]) => (
                  <div key={k} className="flex gap-2">
                    <dt className="text-gray-600 w-40">{k}:</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {imgs && (
            <div className="border rounded-lg p-6">
              <h2 className="font-semibold mb-4">생성된 이미지</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {(['image_01', 'image_02', 'image_03'] as const).map((key) => (
                  <div key={key} className="border rounded p-3">
                    <p className="text-sm text-gray-600 mb-2">
                      {key === 'image_01' && '검색페이지 (280×280)'}
                      {key === 'image_02' && '썸네일 (600×600)'}
                      {key === 'image_03' && '상세페이지 (860×1200)'}
                    </p>
                    <img
                      src={imgs[key]}
                      alt={key}
                      className="w-full aspect-square object-cover rounded mb-2"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => downloadImage(imgs[key], `${key}.png`)}
                        className="text-sm px-2 py-1 border rounded hover:bg-gray-100"
                      >
                        다운로드
                      </button>
                      <button
                        onClick={() => handleRegenerate(key)}
                        className="text-sm px-2 py-1 border rounded hover:bg-gray-100"
                      >
                        재생성
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={handlePublish}
                disabled={publishing}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                {publishing ? '게시 중...' : '게시하기'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

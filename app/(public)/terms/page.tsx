'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function TermsPage() {
  const router = useRouter()

  function handleClose() {
    router.back()
  }

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') handleClose()
    }
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50"
      onClick={handleClose}
    >
      <div
        className="relative flex flex-col w-full max-w-2xl max-h-[90vh] bg-white rounded-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-center shrink-0 py-5 px-6 border-b border-gray-200">
          <h1 className="font-bold text-lg text-gray-900">ABU 회원 이용약관</h1>
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            aria-label="닫기"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 px-6 py-6 text-sm text-gray-800">
          <p className="text-gray-500 mb-6">시행일: 2025년 3월 4일</p>

          <section className="mb-6">
            <h2 className="font-semibold text-base mb-2">제1조 (목적)</h2>
            <p>
              본 약관은 ABU BUSINESS HUB(이하 &quot;서비스&quot;)가 제공하는 크리에이터·바이어·브랜드 간의 상품 검색, 협상, 구매 주문 등 서비스 이용과 관련하여 서비스와 이용자 간의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="font-semibold text-base mb-2">제2조 (정의)</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>&quot;서비스&quot;: ABU BUSINESS HUB 및 관련 웹사이트(www.valadde.com)를 의미합니다.</li>
              <li>&quot;이용자&quot;: 크리에이터, 바이어, 브랜드 등 서비스에 가입하여 이용하는 모든 회원을 의미합니다.</li>
              <li>&quot;회원&quot;: 서비스에 가입하여 이용자 인증을 받은 자를 의미합니다.</li>
            </ol>
          </section>

          <section className="mb-6">
            <h2 className="font-semibold text-base mb-2">제3조 (약관의 효력 및 변경)</h2>
            <p>
              서비스는 관련 법령을 위배하지 않는 범위에서 본 약관을 변경할 수 있으며, 변경된 약관은 서비스 내 공지 후 시행됩니다. 변경 후 7일 이내 이의가 없으면 동의한 것으로 간주합니다.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="font-semibold text-base mb-2">제4조 (서비스 이용)</h2>
            <p>
              이용자는 서비스 내 상품 검색, 협상 요청, 구매 주문 등 정해진 기능을 법령 및 약관에 따라 이용할 수 있습니다. 서비스는 필요한 경우 사전 공지 후 일부 기능을 제한·변경할 수 있습니다.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="font-semibold text-base mb-2">제5조 (회원의 의무)</h2>
            <p>
              회원은 타인의 정보를 도용하거나 허위 정보를 등록하여서는 안 되며, 서비스 운영을 방해하는 행위를 하여서는 안 됩니다. 위반 시 서비스 이용이 제한될 수 있습니다.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="font-semibold text-base mb-2">제6조 (저작권 및 지적재산)</h2>
            <p>
              서비스 내 게시된 상품 정보, 이미지, 텍스트 등에 대한 저작권 및 지적재산권은 서비스 또는 해당 권리자에게 귀속됩니다. 이용자는 이를 무단으로 복제·배포·이용할 수 없습니다.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="font-semibold text-base mb-2">제7조 (면책)</h2>
            <p>
              서비스는 이용자 간의 거래(협상, 주문, 결제 등)에 대해 중개자로서 관여하며, 해당 거래로 인한 분쟁에 대해 일체의 책임을 지지 않습니다.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="font-semibold text-base mb-2">제8조 (분쟁 해결)</h2>
            <p>
              서비스와 이용자 간 분쟁이 발생할 경우, 관련 법령에 따른 관할 법원에서 해결합니다.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

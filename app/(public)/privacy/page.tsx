'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const LABELS = [
  { label: '일반 개인정보 수집', icon: '👤' },
  { label: '개인정보 처리목적', icon: '🎯' },
  { label: '개인정보의 보유 기간', icon: '📋' },
  { label: '개인정보 처리위탁', icon: '🤝' },
  { label: '개인정보의 제공', icon: '↔️' },
  { label: '개인정보 열람 청구', icon: '💬' },
]

export default function PrivacyPage() {
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
          <h1 className="font-bold text-lg text-gray-900">ABU 개인정보처리방침</h1>
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
          {/* 주요 개인정보 처리 표시 (라벨링) */}
          <h2 className="font-semibold text-base text-gray-900 mb-4">주요 개인정보 처리 표시 (라벨링)</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {LABELS.map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg bg-gray-50/50"
              >
                <span className="text-2xl mb-2">{item.icon}</span>
                <span className="text-xs text-center text-gray-700">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Intro */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            ABU BUSINESS HUB(이하 &quot;서비스&quot;)는 이용자의 개인정보를 소중히 여기며, 「개인정보보호법」 및 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 등 관련 법령을 준수합니다.
            법령 개정 또는 정책 변경에 따라 본 방침이 수정될 수 있으며, 최신 내용은 서비스 내에서 확인하실 수 있습니다.
          </p>

          <p className="text-gray-500 mb-6">시행일: 2025년 3월 4일</p>

          {/* 목차 */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-8">
            {[
              '1. 개인정보의 수집·이용 목적',
              '2. 수집하는 개인정보 항목',
              '3. 개인정보의 보유·이용 기간',
              '4. 개인정보의 제3자 제공',
              '5. 개인정보 처리 위탁',
              '6. 이용자의 권리',
              '7. 쿠키의 사용',
              '8. 문의',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 text-xs font-bold">
                  {i + 1}
                </span>
                <span className="text-gray-700 text-sm">{item.replace(/^\d+\.\s/, '')}</span>
              </div>
            ))}
          </div>

          <section className="mb-6">
            <h2 className="font-semibold text-base mb-2">1. 개인정보의 수집·이용 목적</h2>
            <p>
              ABU BUSINESS HUB(이하 &quot;서비스&quot;)는 회원 가입, 상품 검색·협상·주문, 고객 문의 응대 등 서비스 제공을 위하여 최소한의 개인정보를 수집·이용합니다.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="font-semibold text-base mb-2">2. 수집하는 개인정보 항목</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>필수: 이메일, 비밀번호, 성명, 회원 유형(크리에이터/바이어/브랜드)</li>
              <li>선택: 연락처, 사업자 정보 등</li>
              <li>자동 수집: IP 주소, 쿠키, 접속 로그 등</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="font-semibold text-base mb-2">3. 개인정보의 보유·이용 기간</h2>
            <p>
              회원 탈퇴 시까지 보유하며, 탈퇴 후에는 법령에서 정한 기간(예: 전자상거래 기록 5년 등)에 따라 필요한 경우에만 보관 후 파기합니다.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="font-semibold text-base mb-2">4. 개인정보의 제3자 제공</h2>
            <p>
              원칙적으로 제3자에게 제공하지 않습니다. 배송, 결제 등을 위해 필요한 경우 이용자 동의 하에 제공합니다.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="font-semibold text-base mb-2">5. 개인정보 처리 위탁</h2>
            <p>
              서비스 운영을 위해 클라우드·인증 등 일부 업무를 위탁할 수 있으며, 위탁 시 관련 법령에 따라 안전하게 관리됩니다.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="font-semibold text-base mb-2">6. 이용자의 권리</h2>
            <p>
              이용자는 언제든지 자신의 개인정보에 대한 조회·수정·삭제·처리정지 요청을 할 수 있으며, 서비스는 이를 신속히 처리합니다.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="font-semibold text-base mb-2">7. 쿠키의 사용</h2>
            <p>
              서비스는 로그인 유지, 설정 저장 등을 위해 쿠키를 사용합니다. 이용자는 브라우저 설정에서 쿠키 사용을 제한할 수 있습니다.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="font-semibold text-base mb-2">8. 문의</h2>
            <p>
              개인정보 관련 문의는 <Link href="/contact" onClick={(e) => e.stopPropagation()} className="text-abu-pink hover:underline">문의하기</Link>를 통해 접수해 주세요.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

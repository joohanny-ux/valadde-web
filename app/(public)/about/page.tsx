import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-[50vh]">
      {/* Two-column layout: Image (left) | Text (right) */}
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[50vh]">
        {/* ABU Business Hub Intro Image - 차후 이미지 적용 */}
        <div className="min-h-[50vh] flex items-center justify-center bg-abu-charcoal bg-cover bg-center">
          <span className="text-white/40 text-sm font-sans">ABU Business Hub Intro Image</span>
        </div>

        {/* ABU Business Hub Intro Text - 차후 텍스트 적용 */}
        <div className="min-h-[50vh] flex items-center p-8 md:p-12 bg-abu-dark">
          <section className="prose prose-invert prose-sm max-w-none text-white/80 space-y-5 text-[13px] prose-headings:text-white prose-headings:text-base prose-strong:text-white">
            <p>
              <strong>ABU BUSINESS HUB</strong>는 크리에이터, 바이어, 브랜드를 연결하는 상품 허브입니다.
              www.valadde.com을 통해 다양한 상품을 검색하고, 협상·주문·검수를 한곳에서 처리할 수 있습니다.
            </p>

            <h2 className="text-sm font-semibold mt-12">서비스 대상</h2>
            <ul className="list-disc list-inside space-y-2 text-white/80">
              <li><strong>크리에이터</strong> — 라이브·쇼츠 판매용 상품 검색, 판매 의사 신청, 가격 협상</li>
              <li><strong>바이어</strong> — B2B 수출·대량 구매용 PO 작성 및 주문</li>
              <li><strong>브랜드</strong> — 기존 상품 검수 요청, 신상품 게시 요청</li>
            </ul>

            <h2 className="text-sm font-semibold mt-12">연락처</h2>
            <p>
              서비스 이용 문의는 <Link href="/contact" className="text-abu-pink hover:underline">문의하기</Link>를 이용해 주세요.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

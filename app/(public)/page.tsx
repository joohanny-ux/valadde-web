export default function HomePage() {
  return (
    <div>
      {/* Business Intro Image - 차후 이미지 적용 */}
      <section className="min-h-[50vh] flex items-center justify-center bg-abu-charcoal bg-cover bg-center">
        <span className="text-white/40 text-sm font-sans">Business Intro Image</span>
      </section>

      {/* User Intro Image - 차후 이미지 적용 */}
      <section className="min-h-[50vh] flex items-center justify-center bg-abu-dark bg-cover bg-center">
        <span className="text-white/40 text-sm font-sans">User Intro Image</span>
      </section>

      {/* Operation Flow Image - 차후 이미지 적용 */}
      <section className="min-h-[50vh] flex items-center justify-center bg-abu-charcoal bg-cover bg-center">
        <span className="text-white/40 text-sm font-sans">Operation Flow Image</span>
      </section>
    </div>
  )
}

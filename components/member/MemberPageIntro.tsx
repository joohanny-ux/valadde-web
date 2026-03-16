export default function MemberPageIntro({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">{title}</h1>
      <p className="mt-3 max-w-3xl text-base leading-7 text-neutral-600">{description}</p>
    </div>
  )
}

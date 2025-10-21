import { contentData } from './content.data'

export function Content() {
  return (
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <div className="flex flex-col gap-6 max-w-3xl mx-auto">
        {contentData.sections.map((section) => (
          <div key={section.title} className="flex flex-col gap-4">
            <h3 className="scroll-m-20 text-2xl font-semibold">{section.title}</h3>
            <p className="leading-7">{section.content}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

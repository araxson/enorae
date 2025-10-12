import { H3, P } from '@/components/ui/typography'
import { contentData } from './content.data'

export function Content() {
  return (
    <section className="bg-background">
      <div className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-16 sm:px-6 lg:px-8">
        {contentData.sections.map((section) => (
          <div key={section.title} className="space-y-3">
            <H3>{section.title}</H3>
            <P className="text-muted-foreground">{section.content}</P>
          </div>
        ))}
      </div>
    </section>
  )
}

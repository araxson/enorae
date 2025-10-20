import { Section, Stack } from '@/components/layout'
import { contentData } from './content.data'

export function Content() {
  return (
    <Section size="lg">
      <Stack gap="lg" className="max-w-3xl mx-auto">
        {contentData.sections.map((section) => (
          <Stack gap="md" key={section.title}>
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">{section.title}</h3>
            <p className="leading-7">{section.content}</p>
          </Stack>
        ))}
      </Stack>
    </Section>
  )
}

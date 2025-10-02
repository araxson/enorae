import { Section, Stack } from '@/components/layout'
import { H3, P } from '@/components/ui/typography'
import { contentData } from './content.data'

export function Content() {
  return (
    <Section size="lg">
      <Stack gap="lg" className="max-w-3xl mx-auto">
        {contentData.sections.map((section) => (
          <Stack gap="md" key={section.title}>
            <H3>{section.title}</H3>
            <P>{section.content}</P>
          </Stack>
        ))}
      </Stack>
    </Section>
  )
}

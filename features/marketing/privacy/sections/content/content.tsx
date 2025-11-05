import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { MarketingPanel, MarketingSection } from '@/features/marketing/components/common'
import { contentData } from './content.data'

export function Content() {
  return (
    <MarketingSection
      spacing="compact"
      containerClassName="max-w-6xl"
      groupClassName="mx-auto max-w-3xl gap-4"
    >
      <MarketingPanel
        variant="muted"
        description="We explain what data we collect, how it's used, and your control options."
        align="start"
      />
      <Accordion type="multiple" className="w-full">
        {contentData.sections.map((section, index) => (
          <AccordionItem key={section.title} value={`privacy-${index}`}>
            <AccordionTrigger>{section.title}</AccordionTrigger>
            <AccordionContent>
              {section.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </MarketingSection>
  )
}

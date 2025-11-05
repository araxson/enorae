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
      className="bg-background"
      containerClassName="max-w-4xl"
      groupClassName="gap-6"
    >
      <MarketingPanel
        variant="muted"
        description="These sections outline usage policies, payment terms, and user responsibilities."
        align="start"
      />
      <Accordion type="multiple" className="w-full">
        {contentData.sections.map((section, index) => (
          <AccordionItem key={section.title} value={`terms-${index}`}>
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

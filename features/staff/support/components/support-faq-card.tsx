import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

type FaqItem = {
  question: string
  answer: string
}

interface SupportFaqCardProps {
  items: readonly FaqItem[]
}

export function SupportFaqCard({ items }: SupportFaqCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>FAQ & best practices</CardTitle>
        <CardDescription>Answers curated from our support specialists.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Accordion type="single" collapsible className="w-full">
            {items.map((faq, index) => (
              <AccordionItem key={`faq-${index}`} value={`faq-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <Separator />

          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-20" />
              <span>Latest incident updates posted hourly.</span>
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-16" />
              <span>Join the staff Slack channel for live tips.</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

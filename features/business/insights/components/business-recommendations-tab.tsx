'use client'

import {
  CheckCircle2,
  Target,
  Lightbulb,
} from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'

import type { BusinessRecommendation } from '@/features/business/insights/api/queries'

interface BusinessRecommendationsTabProps {
  recommendations: BusinessRecommendation[]
}

export function BusinessRecommendationsTab({ recommendations }: BusinessRecommendationsTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">AI-powered recommendations</h3>
          <p className="text-sm text-muted-foreground">Data-driven actions to improve your performance.</p>
        </div>
        <Badge variant="outline">
          <Lightbulb className="mr-1 h-3 w-3" aria-hidden="true" />
          {recommendations.length} insights
        </Badge>
      </div>

      {recommendations.length > 0 ? (
        <Accordion type="single" collapsible className="w-full">
          {recommendations.map((rec, idx) => (
            <AccordionItem key={rec.id} value={`item-${idx}`}>
              <AccordionTrigger>
                <div className="flex flex-wrap items-center gap-2 text-left">
                  <span>{rec.title}</span>
                  <Badge
                    variant={
                      rec.priority === 'high'
                        ? 'destructive'
                        : rec.priority === 'medium'
                        ? 'default'
                        : 'secondary'
                    }
                  >
                    {rec.priority}
                  </Badge>
                  <Badge variant="outline">{rec.category}</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <p className="text-sm">{rec.description}</p>
                <Item variant="outline" className="items-center gap-3">
                  <ItemMedia variant="icon">
                    <Target className="h-4 w-4 text-primary" aria-hidden="true" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>Impact</ItemTitle>
                    <ItemDescription>{rec.impact}</ItemDescription>
                  </ItemContent>
                </Item>
                <div>
                  <ItemTitle>Action items</ItemTitle>
                  <ItemGroup className="mt-2 space-y-1.5">
                    {rec.actionItems.map((item, idx) => (
                      <Item key={idx} variant="muted" className="items-start gap-2">
                        <ItemMedia variant="icon">
                          <CheckCircle2
                            className="h-4 w-4 text-primary"
                            aria-hidden="true"
                          />
                        </ItemMedia>
                        <ItemContent>
                          <ItemDescription>{item}</ItemDescription>
                        </ItemContent>
                      </Item>
                    ))}
                  </ItemGroup>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>All systems optimal</AlertTitle>
          <AlertDescription>
            Your business metrics are performing well. Keep up the great work!
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

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
  ItemActions,
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
    <ItemGroup className="gap-4">
      <Item>
        <ItemContent>
          <ItemTitle>AI-powered recommendations</ItemTitle>
          <ItemDescription>Data-driven actions to improve your performance.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Badge variant="outline">
            <Lightbulb className="mr-1 size-3" aria-hidden="true" />
            {recommendations.length} insights
          </Badge>
        </ItemActions>
      </Item>

      {recommendations.length > 0 ? (
        <Accordion type="single" collapsible className="w-full">
          {recommendations.map((rec, idx) => (
            <AccordionItem key={rec.id} value={`item-${idx}`}>
              <AccordionTrigger>
                <Item size="sm">
                  <ItemContent>
                    <ItemTitle>{rec.title}</ItemTitle>
                  </ItemContent>
                  <ItemActions>
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
                  </ItemActions>
                </Item>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <p className="text-sm">{rec.description}</p>
                  <Item variant="outline" size="sm">
                    <ItemMedia variant="icon">
                      <Target className="size-4 text-primary" aria-hidden="true" />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>Impact</ItemTitle>
                      <ItemDescription>{rec.impact}</ItemDescription>
                    </ItemContent>
                  </Item>
                  <div>
                    <ItemTitle>Action items</ItemTitle>
                    <div className="mt-2 space-y-1.5">
                      {rec.actionItems.map((item, actionIdx) => (
                        <Item key={actionIdx} variant="muted" size="sm">
                          <ItemMedia variant="icon">
                            <CheckCircle2 className="size-4 text-primary" aria-hidden="true" />
                          </ItemMedia>
                          <ItemContent>
                            <ItemDescription>{item}</ItemDescription>
                          </ItemContent>
                        </Item>
                      ))}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <Alert>
          <CheckCircle2 className="size-4" />
          <AlertTitle>All systems optimal</AlertTitle>
          <AlertDescription>
            Your business metrics are performing well. Keep up the great work!
          </AlertDescription>
        </Alert>
      )}
    </ItemGroup>
  )
}

'use client'

import {
  TrendingUp,
  Lightbulb,
} from 'lucide-react'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface BusinessOpportunitiesTabProps {
  opportunities: Array<{
    type: string
    title: string
    description: string
    potential: string
  }>
}

export function BusinessOpportunitiesTab({ opportunities }: BusinessOpportunitiesTabProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">Growth opportunities</h3>
        <p className="text-sm text-muted-foreground">Focus areas with the highest projected upside.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {opportunities.map((opp, idx) => (
          <Card key={idx}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" aria-hidden="true" />
                <CardTitle>{opp.title}</CardTitle>
              </div>
              <CardDescription>{opp.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  <span className="font-medium">{opp.potential}</span>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

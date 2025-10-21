import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Crown, Heart, Users, AlertTriangle, UserPlus, UserX } from 'lucide-react'
import type { InsightsSummary } from './types'

interface SegmentationCardProps {
  summary: InsightsSummary
}

export function SegmentationCard({ summary }: SegmentationCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Segmentation</CardTitle>
        <CardDescription>
          Customer distribution across different segments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
          <div className="flex flex-col items-center p-4 border rounded-lg bg-accent/10">
            <Crown className="h-6 w-6 text-accent mb-2" />
            <div className="text-2xl font-bold">{summary.segmentation.vip}</div>
            <div className="text-xs text-muted-foreground">VIP</div>
          </div>
          <div className="flex flex-col items-center p-4 border rounded-lg bg-destructive/10">
            <Heart className="h-6 w-6 text-destructive mb-2" />
            <div className="text-2xl font-bold">{summary.segmentation.loyal}</div>
            <div className="text-xs text-muted-foreground">Loyal</div>
          </div>
          <div className="flex flex-col items-center p-4 border rounded-lg bg-secondary/10">
            <Users className="h-6 w-6 text-secondary mb-2" />
            <div className="text-2xl font-bold">{summary.segmentation.regular}</div>
            <div className="text-xs text-muted-foreground">Regular</div>
          </div>
          <div className="flex flex-col items-center p-4 border rounded-lg bg-accent/10">
            <AlertTriangle className="h-6 w-6 text-accent mb-2" />
            <div className="text-2xl font-bold">{summary.segmentation.at_risk}</div>
            <div className="text-xs text-muted-foreground">At Risk</div>
          </div>
          <div className="flex flex-col items-center p-4 border rounded-lg bg-primary/10">
            <UserPlus className="h-6 w-6 text-primary mb-2" />
            <div className="text-2xl font-bold">{summary.segmentation.new}</div>
            <div className="text-xs text-muted-foreground">New</div>
          </div>
          <div className="flex flex-col items-center p-4 border rounded-lg bg-muted">
            <UserX className="h-6 w-6 text-muted-foreground mb-2" />
            <div className="text-2xl font-bold">{summary.segmentation.churned}</div>
            <div className="text-xs text-muted-foreground">Churned</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Tailor campaigns for at-risk and churned segments to rebalance your funnel.
      </CardFooter>
    </Card>
  )
}

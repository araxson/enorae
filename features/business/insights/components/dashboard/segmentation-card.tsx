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
          <Card className="bg-accent/10">
            <CardContent className="flex flex-col items-center gap-2 py-4">
              <Crown className="h-6 w-6 text-accent" />
              <div className="text-2xl font-bold">{summary.segmentation.vip}</div>
              <div className="text-xs text-muted-foreground">VIP</div>
            </CardContent>
          </Card>
          <Card className="bg-destructive/10">
            <CardContent className="flex flex-col items-center gap-2 py-4">
              <Heart className="h-6 w-6 text-destructive" />
              <div className="text-2xl font-bold">{summary.segmentation.loyal}</div>
              <div className="text-xs text-muted-foreground">Loyal</div>
            </CardContent>
          </Card>
          <Card className="bg-secondary/10">
            <CardContent className="flex flex-col items-center gap-2 py-4">
              <Users className="h-6 w-6 text-secondary" />
              <div className="text-2xl font-bold">{summary.segmentation.regular}</div>
              <div className="text-xs text-muted-foreground">Regular</div>
            </CardContent>
          </Card>
          <Card className="bg-accent/10">
            <CardContent className="flex flex-col items-center gap-2 py-4">
              <AlertTriangle className="h-6 w-6 text-accent" />
              <div className="text-2xl font-bold">{summary.segmentation.at_risk}</div>
              <div className="text-xs text-muted-foreground">At Risk</div>
            </CardContent>
          </Card>
          <Card className="bg-primary/10">
            <CardContent className="flex flex-col items-center gap-2 py-4">
              <UserPlus className="h-6 w-6 text-primary" />
              <div className="text-2xl font-bold">{summary.segmentation.new}</div>
              <div className="text-xs text-muted-foreground">New</div>
            </CardContent>
          </Card>
          <Card className="bg-muted">
            <CardContent className="flex flex-col items-center gap-2 py-4">
              <UserX className="h-6 w-6 text-muted-foreground" />
              <div className="text-2xl font-bold">{summary.segmentation.churned}</div>
              <div className="text-xs text-muted-foreground">Churned</div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
      <CardFooter>
        Tailor campaigns for at-risk and churned segments to rebalance your funnel.
      </CardFooter>
    </Card>
  )
}

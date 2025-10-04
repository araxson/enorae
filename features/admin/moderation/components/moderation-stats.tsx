import { MessageSquare, AlertTriangle, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Flex, Box } from '@/components/layout'
import { P } from '@/components/ui/typography'

type ModerationStatsProps = {
  stats: {
    totalReviews: number
    flaggedReviews: number
    pendingReviews: number
  }
}

export function ModerationStats({ stats }: ModerationStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardContent className="p-4">
          <Flex justify="between" align="start">
            <Box>
              <P className="text-sm text-muted-foreground">Total Reviews</P>
              <p className="text-2xl font-bold">{stats.totalReviews}</p>
            </Box>
            <MessageSquare className="h-4 w-4 text-blue-500" />
          </Flex>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <Flex justify="between" align="start">
            <Box>
              <P className="text-sm text-muted-foreground">Flagged Reviews</P>
              <p className="text-2xl font-bold">{stats.flaggedReviews}</p>
            </Box>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </Flex>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <Flex justify="between" align="start">
            <Box>
              <P className="text-sm text-muted-foreground">Pending Response</P>
              <p className="text-2xl font-bold">{stats.pendingReviews}</p>
            </Box>
            <Clock className="h-4 w-4 text-orange-500" />
          </Flex>
        </CardContent>
      </Card>
    </div>
  )
}

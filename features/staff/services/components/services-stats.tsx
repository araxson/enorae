import { Scissors, Star, TrendingUp, Award } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Flex, Box } from '@/components/layout'
import { P } from '@/components/ui/typography'

type StaffService = {
  id: string
  proficiency_level?: string | null
  performed_count?: number | null
  rating_average?: number | null
  rating_count?: number | null
}

type ServicesStatsProps = {
  services: StaffService[]
}

export function ServicesStats({ services }: ServicesStatsProps) {
  const totalServices = services.length
  const totalPerformed = services.reduce((sum, s) => sum + (s.performed_count || 0), 0)
  const avgRating =
    services.reduce((sum, s) => {
      if (s.rating_average && s.rating_count && s.rating_count > 0) {
        return sum + s.rating_average
      }
      return sum
    }, 0) / services.filter((s) => s.rating_average && s.rating_count && s.rating_count > 0).length || 0
  const expertServices = services.filter((s) => s.proficiency_level === 'expert').length

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="p-4">
          <Flex justify="between" align="start">
            <Box>
              <P className="text-sm text-muted-foreground">Total Services</P>
              <p className="text-2xl font-bold">{totalServices}</p>
            </Box>
            <Scissors className="h-4 w-4 text-blue-500" />
          </Flex>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <Flex justify="between" align="start">
            <Box>
              <P className="text-sm text-muted-foreground">Total Performed</P>
              <p className="text-2xl font-bold">{totalPerformed}</p>
            </Box>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </Flex>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <Flex justify="between" align="start">
            <Box>
              <P className="text-sm text-muted-foreground">Average Rating</P>
              <p className="text-2xl font-bold">{avgRating > 0 ? avgRating.toFixed(1) : '-'}</p>
            </Box>
            <Star className="h-4 w-4 text-yellow-500" />
          </Flex>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <Flex justify="between" align="start">
            <Box>
              <P className="text-sm text-muted-foreground">Expert Level</P>
              <p className="text-2xl font-bold">{expertServices}</p>
            </Box>
            <Award className="h-4 w-4 text-purple-500" />
          </Flex>
        </CardContent>
      </Card>
    </div>
  )
}

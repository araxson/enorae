import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Flex } from '@/components/layout'
import { Badge } from '@/components/ui/badge'
import type { Salon } from '../types'

interface LanguagesCardProps {
  salon: Salon
}

export function LanguagesCard({ salon }: LanguagesCardProps) {
  if (!salon.languages_spoken?.length) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Languages Spoken</CardTitle>
      </CardHeader>
      <CardContent>
        <Flex gap="xs" className="flex-wrap">
          {salon.languages_spoken.map((language: string) => (
            <Badge key={language} variant="outline">
              {language}
            </Badge>
          ))}
        </Flex>
      </CardContent>
    </Card>
  )
}

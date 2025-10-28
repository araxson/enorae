import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Clock, FileText } from 'lucide-react'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
} from '@/components/ui/item'

type GuideSection = {
  id: string
  title: string
  description: string
}

interface SupportGuidesCardProps {
  sections: readonly GuideSection[]
}

export function SupportGuidesCard({ sections }: SupportGuidesCardProps) {
  if (sections.length === 0) {
    return null
  }

  const firstSection = sections[0]?.id ?? 'guides'

  return (
    <Card id="release-notes">
      <CardHeader>
        <CardTitle>Guides & updates</CardTitle>
        <CardDescription>Training, release notes, and policy reminders curated for staff.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={firstSection} className="space-y-4">
          <TabsList className="grid grid-cols-3">
            {sections.map((section) => (
              <TabsTrigger key={section.id} value={section.id}>
                {section.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {sections.map((section) => (
            <TabsContent key={`section-${section.id}`} value={section.id}>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <CardTitle>{section.title}</CardTitle>
                        <CardDescription>{section.description}</CardDescription>
                      </div>
                      <Badge variant="outline">Updated weekly</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <ItemGroup className="space-y-3 text-sm text-muted-foreground">
                        <Item variant="muted" size="sm">
                          <ItemMedia variant="icon">
                            <CheckCircle2 className="size-4 text-primary" aria-hidden="true" />
                          </ItemMedia>
                          <ItemContent>
                            <ItemDescription>Review the onboarding checklist to ensure nothing blocks customers from booking.</ItemDescription>
                          </ItemContent>
                        </Item>
                        <Item variant="muted" size="sm">
                          <ItemMedia variant="icon">
                            <Clock className="size-4 text-secondary" aria-hidden="true" />
                          </ItemMedia>
                          <ItemContent>
                            <ItemDescription>Add buffer times and automated reminders for your services within scheduling preferences.</ItemDescription>
                          </ItemContent>
                        </Item>
                        <Item variant="muted" size="sm">
                          <ItemMedia variant="icon">
                            <FileText className="size-4 text-accent" aria-hidden="true" />
                          </ItemMedia>
                          <ItemContent>
                            <ItemDescription>Download printable cheat sheets for front-desk team members joining midweek.</ItemDescription>
                          </ItemContent>
                        </Item>
                      </ItemGroup>
                      <Button variant="secondary" size="sm">
                        View full playbook
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}

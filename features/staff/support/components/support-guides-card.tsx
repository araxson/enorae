import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Clock, FileText } from 'lucide-react'

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
            <TabsContent key={`section-${section.id}`} value={section.id} className="space-y-4">
              <Card>
                <CardHeader className="space-y-1">
                  <div className="flex items-center justify-between">
                    <CardTitle>{section.title}</CardTitle>
                    <Badge variant="outline">Updated weekly</Badge>
                  </div>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-success" />
                      Review the onboarding checklist to ensure nothing blocks customers from booking.
                    </li>
                    <li className="flex items-start gap-2">
                      <Clock className="mt-0.5 h-4 w-4 text-info" />
                      Add buffer times and automated reminders for your services within scheduling preferences.
                    </li>
                    <li className="flex items-start gap-2">
                      <FileText className="mt-0.5 h-4 w-4 text-accent" />
                      Download printable cheat sheets for front-desk team members joining midweek.
                    </li>
                  </ul>
                  <Button variant="secondary" size="sm">
                    View full playbook
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}

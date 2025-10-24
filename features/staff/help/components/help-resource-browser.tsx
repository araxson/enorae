import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Download } from 'lucide-react'

const resources: ReadonlyArray<{
  title: string
  type: string
  lastUpdated: string
  status: string
}> = [
  { title: 'Intro to appointment workflows', type: 'Article', lastUpdated: '3 days ago', status: 'New' },
  { title: 'Client retention scripts', type: 'Template', lastUpdated: '2 weeks ago', status: 'Popular' },
  { title: 'Enorae release overview – March', type: 'Video', lastUpdated: '4 weeks ago', status: 'Replay' },
] as const

export function HelpResourceBrowser() {
  return (
    <Card id="resource-browser">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Resource browser</CardTitle>
            <CardDescription>Browse top resources and save them for easy access.</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export list
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <div className="space-y-3">
              <ScrollArea className="max-h-64 rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Updated</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resources.map((resource) => (
                      <TableRow key={resource.title}>
                        <TableCell className="font-medium">{resource.title}</TableCell>
                        <TableCell>{resource.type}</TableCell>
                        <TableCell>{resource.lastUpdated}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="secondary">{resource.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
              <Separator />
              <p className="text-muted-foreground">
                Save any resource using the bookmark icon in the toolbar. Follow categories to be notified when new content drops.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="articles">
            <p className="text-muted-foreground">
              Quick reads covering workflows, customer scripts, and salon operations.
            </p>
          </TabsContent>
          <TabsContent value="videos">
            <p className="text-muted-foreground">
              Watch on-demand walkthroughs and feature spotlights curated for staff.
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

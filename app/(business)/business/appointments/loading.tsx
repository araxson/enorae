import { Section, Stack } from '@/components/layout'
import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'

export default function AppointmentsLoading() {
  return (
    <Section size="lg">
      <Stack gap="xl">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-10 w-48 mb-2" />
            <Skeleton className="h-5 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <Card className="p-6">
          <Stack gap="md">
            <Skeleton className="h-6 w-40 mb-4" />
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between py-4 border-b last:border-0">
                <div className="flex-1">
                  <Skeleton className="h-5 w-48 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-9 w-20" />
              </div>
            ))}
          </Stack>
        </Card>
      </Stack>
    </Section>
  )
}

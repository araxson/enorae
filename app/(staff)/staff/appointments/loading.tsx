import { Section, Stack } from '@/components/layout'
import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'

export default function StaffAppointmentsLoading() {
  return (
    <Section size="lg">
      <Stack gap="xl">
        <div>
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>

        <Card className="p-12">
          <Stack gap="lg" className="max-w-2xl mx-auto">
            <div className="text-center">
              <Skeleton className="w-20 h-20 rounded-full mx-auto mb-4" />
              <Skeleton className="h-8 w-64 mx-auto mb-2" />
              <Skeleton className="h-5 w-80 mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24 rounded-lg" />
              ))}
            </div>
          </Stack>
        </Card>
      </Stack>
    </Section>
  )
}

import { getUserSalons, getDashboardMetrics } from './dal/dashboard.queries'
import { SalonSelector } from './components/salon-selector'
import { MetricsCards } from './components/metrics-cards'
import { RecentBookings } from './components/recent-bookings'
import { Button } from '@enorae/ui'

export async function Dashboard() {
  const salons = await getUserSalons()

  if (salons.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <h1 className="text-3xl font-bold">Welcome to Enorae</h1>
          <p className="text-muted-foreground">
            You don't have any salons yet. Create your first salon to get started.
          </p>
          <Button asChild>
            <a href="/business/salons/new">Create Salon</a>
          </Button>
        </div>
      </div>
    )
  }

  const selectedSalon = salons[0]
  const metrics = await getDashboardMetrics(selectedSalon.id!)

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <SalonSelector salons={salons} selectedSalonId={selectedSalon.id!} />
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a href="/business/appointments">Appointments</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/business/staff">Staff</a>
          </Button>
        </div>
      </div>

      <MetricsCards metrics={metrics} />
      <RecentBookings bookings={metrics.recentBookings} />
    </div>
  )
}
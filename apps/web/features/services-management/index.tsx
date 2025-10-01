import { Button } from '@enorae/ui'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@enorae/ui'
import { getUserSalons } from '../dashboard/dal/dashboard.queries'
import { getSalonServices, getActiveServices } from './dal/services.queries'
import { ServicesGrid } from './components/services-grid'

export async function ServicesManagement() {
  const salons = await getUserSalons()

  if (salons.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-muted-foreground">
          Please create a salon first.
        </p>
      </div>
    )
  }

  const selectedSalon = salons[0]
  const [allServices, activeServices] = await Promise.all([
    getSalonServices(selectedSalon.id!),
    getActiveServices(selectedSalon.id!),
  ])

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Services</h1>
          <p className="text-muted-foreground mt-1">{selectedSalon.name}</p>
        </div>
        <Button asChild>
          <a href="/business/services/new">Add Service</a>
        </Button>
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">
            Active ({activeServices.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            All ({allServices.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <ServicesGrid services={activeServices} />
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <ServicesGrid services={allServices} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
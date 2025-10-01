import { Card, CardContent, CardDescription, CardHeader, CardTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Badge, Button } from '@enorae/ui'
import { getAllSalons } from './dal/salons.queries'
import { MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react'

export async function AdminSalonsList() {
  const salons = await getAllSalons()

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Salon Management</h1>
        <p className="text-muted-foreground">Manage all salons on the platform</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Salons</CardTitle>
          <CardDescription>
            {salons.length} salons registered on the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salons.map((salon) => (
                <TableRow key={salon.id}>
                  <TableCell className="font-medium">
                    {salon.name}
                  </TableCell>
                  <TableCell>
                    {salon.owner?.full_name || salon.owner?.email || 'N/A'}
                  </TableCell>
                  <TableCell>
                    {salon.location?.city || 'Not set'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={salon.status === 'active' ? 'default' : 'secondary'}>
                      {salon.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(salon.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    ${salon.totalRevenue?.toFixed(2) || '0.00'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        asChild
                      >
                        <a href={`/admin/salons/${salon.id}`}>
                          <Eye className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        asChild
                      >
                        <a href={`/admin/salons/${salon.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Building2, MapPin, Star } from 'lucide-react'
import type { ChainSalon } from '@/features/admin/chains/api/queries'

interface ChainHierarchyProps {
  chainName: string
  salons: ChainSalon[]
}

export function ChainHierarchy({ chainName, salons }: ChainHierarchyProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          <CardTitle>Chain Hierarchy: {chainName}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Salon Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Rating</TableHead>
                <TableHead className="text-right">Reviews</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salons.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No salons in this chain
                  </TableCell>
                </TableRow>
              ) : (
                salons.map((salon) => (
                  <TableRow key={salon.id}>
                    <TableCell className="font-medium">{salon.name}</TableCell>
                    <TableCell>
                      {salon.city || salon.state ? (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {[salon.city, salon.state].filter(Boolean).join(', ')}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {salon.ratingAverage !== null ? (
                        <div className="flex items-center justify-end gap-1">
                        <Star className="h-3 w-3 text-accent" fill="currentColor" />
                          <span className="font-medium">{salon.ratingAverage.toFixed(1)}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">{salon.ratingCount}</TableCell>
                    <TableCell>
                      <Badge variant={salon.isAcceptingBookings ? 'default' : 'secondary'}>
                        {salon.isAcceptingBookings ? 'Accepting' : 'Paused'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(salon.createdAt)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

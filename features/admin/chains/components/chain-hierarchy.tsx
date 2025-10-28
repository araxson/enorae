import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { Building2, MapPin, Star } from 'lucide-react'
import type { ChainSalon } from '@/features/admin/chains/api/queries'
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia } from '@/components/ui/item'

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
        <ItemGroup>
          <Item variant="muted">
            <ItemMedia variant="icon">
              <Building2 className="size-5" />
            </ItemMedia>
            <ItemContent>
              <CardTitle>Chain Hierarchy: {chainName}</CardTitle>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        <div className="-m-6">
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
                <TableCell colSpan={6}>
                  <Empty>
                    <EmptyHeader>
                      <EmptyTitle>No salons in this chain</EmptyTitle>
                      <EmptyDescription>Invite or link salons to this chain to populate the hierarchy.</EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>
            ) : (
              salons.map((salon) => (
                <TableRow key={salon.id}>
                  <TableCell className="font-medium">{salon.name}</TableCell>
                  <TableCell>
                    {salon.city || salon.state ? (
                      <ItemGroup>
                        <Item variant="muted" className="items-center gap-1 text-sm text-muted-foreground">
                          <ItemMedia variant="icon">
                            <MapPin className="size-3" />
                          </ItemMedia>
                          <ItemContent>
                            <ItemDescription>
                              {[salon.city, salon.state].filter(Boolean).join(', ')}
                            </ItemDescription>
                          </ItemContent>
                        </Item>
                      </ItemGroup>
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {salon.ratingAverage !== null ? (
                      <div className="flex items-center justify-end gap-1">
                        <Star className="size-3 text-primary" fill="currentColor" />
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

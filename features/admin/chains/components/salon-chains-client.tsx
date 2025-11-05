import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { ChainActions } from './chain-actions'
import type { Database } from '@/lib/types/database.types'
import { Item, ItemContent, ItemDescription, ItemGroup, ItemTitle } from '@/components/ui/item'

type SalonChain = Database['public']['Views']['salon_chains_view']['Row']

interface SalonChainsClientProps {
  chains: SalonChain[]
}

export function SalonChainsClient({ chains }: SalonChainsClientProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatSubscriptionTier = (tier: string | null) => {
    if (!tier) return 'Free'
    return tier.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
  }

  return (
    <Card>
      <CardHeader>
        <ItemGroup>
          <Item variant="muted">
            <ItemContent>
              <CardTitle>Salon Chains</CardTitle>
              <CardDescription>Review chain memberships and platform status.</CardDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      {chains.length === 0 ? (
        <CardContent>
          <div className="py-12">
            <Empty>
              <EmptyHeader>
                <EmptyTitle>No salon chains found</EmptyTitle>
                <EmptyDescription>Chains will appear here once created.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          </div>
        </CardContent>
      ) : (
        <CardContent>
          <Table>
            <TableCaption>Salon chains with membership, subscription tier, and verification status.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Chain Name</TableHead>
                <TableHead className="text-right">Salons</TableHead>
                <TableHead className="text-right">Staff</TableHead>
                <TableHead>Subscription</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chains.map((chain) => (
                <TableRow key={chain['id']}>
                  <TableCell>
                    <ItemGroup>
                      <Item variant="muted" className="flex-col items-start gap-1">
                        <ItemContent>
                          <ItemTitle>{chain['name']}</ItemTitle>
                          {chain['legal_name'] && chain['legal_name'] !== chain['name'] ? (
                            <ItemDescription>{chain['legal_name']}</ItemDescription>
                          ) : null}
                        </ItemContent>
                      </Item>
                    </ItemGroup>
                  </TableCell>
                  <TableCell className="text-right">{chain['salon_count'] || 0}</TableCell>
                  <TableCell className="text-right">{chain['staff_count'] || 0}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{formatSubscriptionTier(chain['subscription_tier'])}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={chain['is_verified'] ? 'default' : 'secondary'}>
                      {chain['is_verified'] ? 'Verified' : 'Unverified'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={chain['is_active'] ? 'default' : 'destructive'}>
                      {chain['is_active'] ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(chain['created_at'])}
                  </TableCell>
                  <TableCell className="text-right">
                    <ChainActions
                      chainId={chain['id']!}
                      chainName={chain['name'] || 'Unknown'}
                      isVerified={chain['is_verified'] || false}
                      isActive={chain['is_active'] || false}
                      subscriptionTier={chain['subscription_tier']}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={8}>
                  <span className="text-sm text-muted-foreground">
                    Total chains: {chains.length}
                  </span>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      )}
    </Card>
  )
}

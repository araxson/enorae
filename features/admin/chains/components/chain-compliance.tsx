import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Progress } from '@/components/ui/progress'
import { Empty, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { AlertCircle } from 'lucide-react'
import type { ChainCompliance } from '@/features/admin/chains/api/queries'
import { Item, ItemContent, ItemGroup } from '@/components/ui/item'

interface ChainComplianceTableProps {
  compliance: ChainCompliance[]
}

export function ChainComplianceTable({ compliance }: ChainComplianceTableProps) {
  const getComplianceColor = (rate: number) => {
    if (rate >= 90) return 'text-primary'
    if (rate >= 70) return 'text-secondary'
    return 'text-destructive'
  }

  const getComplianceVariant = (rate: number): 'default' | 'destructive' | 'secondary' => {
    if (rate >= 90) return 'default'
    if (rate >= 70) return 'secondary'
    return 'destructive'
  }

  return (
    <Card>
      <CardHeader>
        <ItemGroup>
          <Item variant="muted">
            <ItemContent>
              <CardTitle>Chain Compliance Monitoring</CardTitle>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>Compliance overview for each salon chain.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Chain Name</TableHead>
              <TableHead className="text-right">Total Salons</TableHead>
              <TableHead className="text-right">Active</TableHead>
              <TableHead className="text-right">Paused</TableHead>
              <TableHead>Compliance Rate</TableHead>
              <TableHead>Issues</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {compliance.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <Empty>
                    <EmptyHeader>
                      <EmptyTitle>No compliance data available</EmptyTitle>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>
            ) : (
              compliance.map((chain) => (
                <TableRow key={chain.chainId}>
                  <TableCell className="font-medium">{chain.chainName}</TableCell>
                  <TableCell className="text-right">{chain.totalSalons}</TableCell>
                  <TableCell className="text-right text-primary">{chain.verifiedSalons}</TableCell>
                  <TableCell className="text-right text-destructive">{chain.unverifiedSalons}</TableCell>
                  <TableCell>
                    <ItemGroup className="gap-2">
                      <Item variant="muted">
                        <ItemContent>
                          <span className={`text-sm font-medium ${getComplianceColor(chain.complianceRate)}`}>
                            {chain.complianceRate.toFixed(1)}%
                          </span>
                        </ItemContent>
                      </Item>
                      <Item variant="muted">
                        <ItemContent>
                          <Progress value={chain.complianceRate} className="h-2" />
                        </ItemContent>
                      </Item>
                    </ItemGroup>
                  </TableCell>
                  <TableCell>
                    {chain.issues.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {chain.issues.map((issue, idx) => (
                          <Badge key={idx} variant={getComplianceVariant(chain.complianceRate)}>
                            <AlertCircle className="mr-1 size-3" />
                            {issue}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <Badge variant="default">No issues</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={6}>
                <span className="text-sm text-muted-foreground">
                  Chains monitored: {compliance.length}
                </span>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  )
}

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { AlertCircle } from 'lucide-react'
import type { ChainCompliance } from '../api/queries'

interface ChainComplianceTableProps {
  compliance: ChainCompliance[]
}

export function ChainComplianceTable({ compliance }: ChainComplianceTableProps) {
  const getComplianceColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600'
    if (rate >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getComplianceVariant = (rate: number): 'default' | 'destructive' | 'secondary' => {
    if (rate >= 90) return 'default'
    if (rate >= 70) return 'secondary'
    return 'destructive'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chain Compliance Monitoring</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
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
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No compliance data available
                  </TableCell>
                </TableRow>
              ) : (
                compliance.map((chain) => (
                  <TableRow key={chain.chainId}>
                    <TableCell className="font-medium">{chain.chainName}</TableCell>
                    <TableCell className="text-right">{chain.totalSalons}</TableCell>
                    <TableCell className="text-right text-green-600">
                      {chain.verifiedSalons}
                    </TableCell>
                    <TableCell className="text-right text-red-600">
                      {chain.unverifiedSalons}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-medium ${getComplianceColor(chain.complianceRate)}`}>
                            {chain.complianceRate.toFixed(1)}%
                          </span>
                        </div>
                        <Progress
                          value={chain.complianceRate}
                          className="h-2"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      {chain.issues.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {chain.issues.map((issue, idx) => (
                            <Badge
                              key={idx}
                              variant={getComplianceVariant(chain.complianceRate)}
                              className="text-xs"
                            >
                              <AlertCircle className="mr-1 h-3 w-3" />
                              {issue}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <Badge variant="default">
                          No issues
                        </Badge>
                      )}
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

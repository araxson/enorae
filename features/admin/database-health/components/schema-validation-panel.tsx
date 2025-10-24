'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, ShieldAlert, Key } from 'lucide-react'
import type { SchemaValidationSnapshot } from '@/features/admin/database-health/api/internal/schema-validation'

interface SchemaValidationPanelProps {
  data: SchemaValidationSnapshot
}

export function SchemaValidationPanel({ data }: SchemaValidationPanelProps) {
  const { tablesWithoutRLS, tablesWithoutPK, summary } = data

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schema Validation</CardTitle>
        <CardDescription>Audit RLS coverage and primary key adoption</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {summary.criticalSecurityIssues > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Critical Security Issues Detected</AlertTitle>
            <AlertDescription>
              {summary.criticalSecurityIssues} table(s) without RLS policies detected.
              This is a critical security vulnerability.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5" />
                <CardTitle>RLS Policy Issues</CardTitle>
              </div>
              <CardDescription>
                {summary.totalRLSIssues} table{summary.totalRLSIssues === 1 ? '' : 's'} without RLS
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant={summary.totalRLSIssues > 0 ? 'destructive' : 'default'}>
                  {summary.totalRLSIssues} tables
                </Badge>
                <p className="text-muted-foreground">missing RLS coverage</p>
              </div>

              {tablesWithoutRLS.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Schema</TableHead>
                      <TableHead>Table</TableHead>
                      <TableHead>RLS Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tablesWithoutRLS.slice(0, 10).map((table, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-mono text-xs">
                          {String(table.schemaname ?? 'N/A')}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {String(table.tablename ?? 'N/A')}
                        </TableCell>
                        <TableCell>
                          <Badge variant="destructive">
                            {String(table.rls_status ?? 'unknown')}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-4 text-center">
                  <p className="text-muted-foreground">All tables have RLS policies</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                <CardTitle>Primary Key Issues</CardTitle>
              </div>
              <CardDescription>
                {summary.totalPKIssues} table{summary.totalPKIssues === 1 ? '' : 's'} missing primary
                keys
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant={summary.totalPKIssues > 0 ? 'secondary' : 'default'}>
                  {summary.totalPKIssues} tables
                </Badge>
                <p className="text-muted-foreground">without primary keys</p>
              </div>

              {tablesWithoutPK.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Schema</TableHead>
                      <TableHead>Table</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tablesWithoutPK.slice(0, 10).map((table, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-mono text-xs">
                          {String(table.schema_name ?? 'N/A')}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {String(table.table_name ?? 'N/A')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-4 text-center">
                  <p className="text-muted-foreground">All tables have primary keys</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}

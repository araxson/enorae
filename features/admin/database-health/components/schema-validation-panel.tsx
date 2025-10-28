'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'

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
import type { SchemaValidationSnapshot } from '@/features/admin/database-health/api/queries/schema-validation'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'

interface SchemaValidationPanelProps {
  data: SchemaValidationSnapshot
}

export function SchemaValidationPanel({ data }: SchemaValidationPanelProps) {
  const { tablesWithoutRLS, tablesWithoutPK, summary } = data

  return (
    <Card>
      <CardHeader>
        <ItemGroup>
          <Item>
            <ItemMedia variant="icon">
              <ShieldAlert className="size-5" aria-hidden="true" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Schema Validation</ItemTitle>
              <ItemDescription>Audit RLS coverage and primary key adoption</ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {summary.criticalSecurityIssues > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertTitle>Critical Security Issues Detected</AlertTitle>
              <AlertDescription>
                {summary.criticalSecurityIssues} table(s) without RLS policies detected.
                This is a critical security vulnerability.
              </AlertDescription>
            </Alert>
          )}

          <ItemGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Item variant="outline" className="flex-col gap-4">
            <ItemGroup>
              <Item>
                <ItemMedia variant="icon">
                  <ShieldAlert className="size-5" aria-hidden="true" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>RLS Policy Issues</ItemTitle>
                  <ItemDescription>
                    {summary.totalRLSIssues} table{summary.totalRLSIssues === 1 ? '' : 's'} without RLS
                  </ItemDescription>
                </ItemContent>
              </Item>
            </ItemGroup>

            <ItemContent className="space-y-4">
              <ItemGroup>
                <Item variant="muted" className="items-center gap-2">
                  <ItemContent className="flex items-center gap-2">
                    <Badge variant={summary.totalRLSIssues > 0 ? 'destructive' : 'default'}>
                      {summary.totalRLSIssues} tables
                    </Badge>
                    <span className="text-muted-foreground">missing RLS coverage</span>
                  </ItemContent>
                </Item>
              </ItemGroup>

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
                          {String(table['schemaname'] ?? 'N/A')}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {String(table['tablename'] ?? 'N/A')}
                        </TableCell>
                        <TableCell>
                          <Badge variant="destructive">
                            {String(table['rls_status'] ?? 'unknown')}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Empty>
                  <EmptyHeader>
                    <EmptyTitle>All tables have RLS policies</EmptyTitle>
                    <EmptyDescription>Great work—no missing row level security coverage.</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              )}
            </ItemContent>
          </Item>

          <Item variant="outline" className="flex-col gap-4">
            <ItemGroup>
              <Item>
                <ItemMedia variant="icon">
                  <Key className="size-5" aria-hidden="true" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>Primary Key Issues</ItemTitle>
                  <ItemDescription>
                    {summary.totalPKIssues} table{summary.totalPKIssues === 1 ? '' : 's'} missing primary keys
                  </ItemDescription>
                </ItemContent>
              </Item>
            </ItemGroup>

            <ItemContent className="space-y-4">
              <ItemGroup>
                <Item variant="muted" className="items-center gap-2">
                  <ItemContent className="flex items-center gap-2">
                    <Badge variant={summary.totalPKIssues > 0 ? 'secondary' : 'default'}>
                      {summary.totalPKIssues} tables
                    </Badge>
                    <span className="text-muted-foreground">without primary keys</span>
                  </ItemContent>
                </Item>
              </ItemGroup>

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
                          {String(table['schema_name'] ?? 'N/A')}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {String(table['table_name'] ?? 'N/A')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Empty>
                  <EmptyHeader>
                    <EmptyTitle>All tables have primary keys</EmptyTitle>
                    <EmptyDescription>Your schemas already enforce primary key requirements.</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              )}
            </ItemContent>
          </Item>
          </ItemGroup>
        </div>
      </CardContent>
    </Card>
  )
}

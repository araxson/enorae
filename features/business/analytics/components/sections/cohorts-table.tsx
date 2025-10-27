'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ExportButton } from '@/features/business/business-common/components'
import type { getCustomerCohorts } from '@/features/business/analytics/api/queries'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

type CustomerCohort = Awaited<ReturnType<typeof getCustomerCohorts>>[number]

type Props = {
  cohorts: CustomerCohort[]
  start: string
  end: string
}

export function CohortsTable({ cohorts, start, end }: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex gap-4 items-center items-center justify-between">
          <CardTitle>Customer cohorts</CardTitle>
          <ExportButton
            data={cohorts.map((cohort) => ({
              cohort: cohort.cohort,
              size: cohort.size,
              ...Object.fromEntries(
                cohort.retention.slice(0, 6).map((value, index) => [`r${index}`, Number(value.toFixed(1))])
              ),
            }))}
            filename={`cohorts-${start}-to-${end}`}
          />
        </div>
        <CardDescription>Monthly retention for the last 6 cohorts.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cohort</TableHead>
                <TableHead>Size</TableHead>
                {Array.from({ length: 6 }).map((_, index) => (
                  <TableHead key={index}>M+{index}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {cohorts.map((cohort) => (
                <TableRow key={cohort.cohort}>
                  <TableCell>{cohort.cohort}</TableCell>
                  <TableCell>{cohort.size}</TableCell>
                  {cohort.retention.slice(0, 6).map((value: number, index: number) => (
                    <TableCell key={index}>{value.toFixed(1)}%</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

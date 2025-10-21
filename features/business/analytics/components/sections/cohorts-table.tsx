'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ExportButton } from '@/features/business/business-common/components'
import type { getCustomerCohorts } from '../../api/queries'

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
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="p-2 text-left">Cohort</th>
                <th className="p-2 text-left">Size</th>
                {Array.from({ length: 6 }).map((_, index) => (
                  <th key={index} className="p-2 text-left">M+{index}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cohorts.map((cohort) => (
                <tr key={cohort.cohort} className="border-t">
                  <td className="p-2">{cohort.cohort}</td>
                  <td className="p-2">{cohort.size}</td>
                  {cohort.retention.slice(0, 6).map((value: number, index: number) => (
                    <td key={index} className="p-2">{value.toFixed(1)}%</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

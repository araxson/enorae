'use client'

import { Box, Group } from '@/components/layout'
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
    <Box className="rounded-lg border p-4">
      <Group className="items-center justify-between mb-3">
        <small className="text-sm font-medium leading-none font-semibold">Customer Cohorts (Monthly, last 6)</small>
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
      </Group>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="text-left p-2">Cohort</th>
              <th className="text-left p-2">Size</th>
              {Array.from({ length: 6 }).map((_, index) => (
                <th key={index} className="text-left p-2">M+{index}</th>
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
    </Box>
  )
}

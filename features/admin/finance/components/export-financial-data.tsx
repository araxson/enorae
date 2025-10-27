'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Download, CheckCircle2, XCircle } from 'lucide-react'
import { exportFinancialDataToCSV } from '@/features/admin/finance/api/mutations'
import { Spinner } from '@/components/ui/spinner'
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Item, ItemContent, ItemDescription, ItemGroup, ItemTitle } from '@/components/ui/item'
import { ButtonGroup } from '@/components/ui/button-group'

export function ExportFinancialData() {
  const [isLoading, setIsLoading] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [includeTransactions, setIncludeTransactions] = useState(true)
  const [includeRevenueSummary, setIncludeRevenueSummary] = useState(true)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleExport = async () => {
    if (!startDate || !endDate) {
      setMessage({ type: 'error', text: 'Please select both start and end dates' })
      return
    }

    setIsLoading(true)
    setMessage(null)
    try {
      await exportFinancialDataToCSV({
        startDate,
        endDate,
        includeTransactions,
        includeRevenueSummary
      })

      setMessage({ type: 'success', text: 'Your export is ready' })
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to export data'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <ItemGroup>
          <Item variant="muted">
            <ItemContent>
              <CardTitle>Export Financial Data</CardTitle>
              <CardDescription>
                Download financial reports for accounting and analysis
              </CardDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-8">
          {message && (
            <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
              {message.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              <AlertTitle>{message.type === 'success' ? 'Export ready' : 'Export failed'}</AlertTitle>
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          <FieldGroup className="grid gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="start-date">Start Date</FieldLabel>
              <FieldContent>
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="end-date">End Date</FieldLabel>
              <FieldContent>
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </FieldContent>
            </Field>
          </FieldGroup>

          <ItemGroup className="space-y-3">
            <Item variant="muted">
              <ItemContent>
                <ItemTitle>Include in Export</ItemTitle>
              </ItemContent>
            </Item>
            <FieldGroup className="space-y-2">
              <Field orientation="horizontal" className="flex-row-reverse items-center justify-end gap-2">
                <FieldLabel htmlFor="include-transactions">Transaction details</FieldLabel>
                <FieldContent className="flex-none">
                  <Checkbox
                    id="include-transactions"
                    checked={includeTransactions}
                    onCheckedChange={(checked) => setIncludeTransactions(checked as boolean)}
                  />
                </FieldContent>
              </Field>
              <Field orientation="horizontal" className="flex-row-reverse items-center justify-end gap-2">
                <FieldLabel htmlFor="include-summary">Revenue summary</FieldLabel>
                <FieldContent className="flex-none">
                  <Checkbox
                    id="include-summary"
                    checked={includeRevenueSummary}
                    onCheckedChange={(checked) => setIncludeRevenueSummary(checked as boolean)}
                  />
                </FieldContent>
              </Field>
            </FieldGroup>
          </ItemGroup>

          <ButtonGroup className="w-full md:w-auto">
            <Button
              onClick={handleExport}
              disabled={isLoading || !startDate || !endDate}
              className="w-full md:w-auto"
            >
              {isLoading ? (
                <>
                  <Spinner className="size-4" />
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>Export to CSV</span>
                </>
              )}
            </Button>
          </ButtonGroup>
        </div>
      </CardContent>
    </Card>
  )
}

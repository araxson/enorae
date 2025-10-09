'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Stack } from '@/components/layout'
import { Download, Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { exportFinancialDataToCSV } from '../api/mutations'

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
      const result = await exportFinancialDataToCSV({
        startDate,
        endDate,
        includeTransactions,
        includeRevenueSummary
      })

      setMessage({ type: 'success', text: result.message || 'Your export is ready' })
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
        <CardTitle>Export Financial Data</CardTitle>
        <CardDescription>
          Download financial reports for accounting and analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Stack gap="lg">
          {message && (
            <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
              {message.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Include in Export</Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-transactions"
                checked={includeTransactions}
                onCheckedChange={(checked) => setIncludeTransactions(checked as boolean)}
              />
              <Label
                htmlFor="include-transactions"
                className="text-sm font-normal cursor-pointer"
              >
                Transaction details
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-summary"
                checked={includeRevenueSummary}
                onCheckedChange={(checked) => setIncludeRevenueSummary(checked as boolean)}
              />
              <Label
                htmlFor="include-summary"
                className="text-sm font-normal cursor-pointer"
              >
                Revenue summary
              </Label>
            </div>
          </div>

          <Button
            onClick={handleExport}
            disabled={isLoading || !startDate || !endDate}
            className="w-full md:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export to CSV
              </>
            )}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}

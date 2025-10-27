'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react'
import type { LocationAddress } from './address-form/types'
import { Spinner } from '@/components/ui/spinner'
import { ButtonGroup } from '@/components/ui/button-group'

type ValidationResult = {
  isValid: boolean
  score: number
  issues: string[]
  suggestions: string[]
}

type Props = {
  address: LocationAddress | null
}

export function AddressValidation({ address }: Props) {
  const [isValidating, setIsValidating] = useState(false)
  const [result, setResult] = useState<ValidationResult | null>(null)

  const validateAddress = async () => {
    if (!address) return

    setIsValidating(true)

    // Simulate validation logic
    await new Promise(resolve => setTimeout(resolve, 1000))

    const issues: string[] = []
    const suggestions: string[] = []
    let score = 100

    // Check required fields
    if (!address.street_address) {
      issues.push('Street address is required')
      score -= 30
    }

    if (!address.city) {
      issues.push('City is required')
      score -= 20
    }

    if (!address.state_province) {
      issues.push('State/Province is required')
      score -= 20
    }

    if (!address.postal_code) {
      issues.push('Postal code is required')
      score -= 15
    }

    // Check coordinates
    if (!address.latitude || !address.longitude) {
      suggestions.push('Add coordinates for better map accuracy')
      score -= 10
    }

    // Check formatted address
    if (!address.formatted_address) {
      suggestions.push('Use address search to get formatted address')
      score -= 5
    }

    // Validate postal code format (basic US check)
    if (address.postal_code && address.country_code === 'US') {
      const usZipRegex = /^\d{5}(-\d{4})?$/
      if (!usZipRegex.test(address.postal_code)) {
        issues.push('Invalid US postal code format (should be 12345 or 12345-6789)')
        score -= 10
      }
    }

    setResult({
      isValid: score >= 70,
      score,
      issues,
      suggestions,
    })
    setIsValidating(false)
  }

  const getStatusBadge = () => {
    if (!result) return null

    if (result.isValid) {
      return (
        <Badge variant="default">
          <span className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Valid ({result.score}%)
          </span>
        </Badge>
      )
    }

    if (result.score >= 50) {
      return (
        <Badge variant="secondary">
          <span className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Needs Improvement ({result.score}%)
          </span>
        </Badge>
      )
    }

    return (
      <Badge variant="destructive">
        <span className="flex items-center gap-1">
          <XCircle className="h-3 w-3" />
          Invalid ({result.score}%)
        </span>
      </Badge>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex gap-4 items-center justify-between">
          <CardTitle>Address Validation</CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <ButtonGroup className="w-full">
            <Button
              type="button"
              variant="outline"
              onClick={validateAddress}
              disabled={isValidating || !address}
              className="w-full"
            >
              {isValidating ? (
                <Spinner className="mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              {isValidating ? 'Validating...' : 'Validate Address'}
            </Button>
          </ButtonGroup>

          {result && result.issues.length > 0 && (
            <Alert variant="destructive">
              <AlertTitle>Issues found</AlertTitle>
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {result.issues.map((issue, i) => (
                    <li key={i} className="text-sm">{issue}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {result && result.suggestions.length > 0 && (
            <Alert>
              <AlertTitle>Suggestions</AlertTitle>
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {result.suggestions.map((suggestion, i) => (
                    <li key={i} className="text-sm">{suggestion}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {result && result.isValid && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Validation passed</AlertTitle>
              <AlertDescription>
                Address validation passed! Your address is properly formatted and complete.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

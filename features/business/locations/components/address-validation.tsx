'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Stack, Flex } from '@/components/layout'
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react'
import type { LocationAddress } from './address-form/types'

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
        <Badge variant="default" className="gap-1">
          <CheckCircle className="h-3 w-3" />
          Valid ({result.score}%)
        </Badge>
      )
    }

    if (result.score >= 50) {
      return (
        <Badge variant="secondary" className="gap-1">
          <AlertTriangle className="h-3 w-3" />
          Needs Improvement ({result.score}%)
        </Badge>
      )
    }

    return (
      <Badge variant="destructive" className="gap-1">
        <XCircle className="h-3 w-3" />
        Invalid ({result.score}%)
      </Badge>
    )
  }

  return (
    <Card>
      <CardHeader>
        <Flex justify="between" align="center">
          <CardTitle>Address Validation</CardTitle>
          {getStatusBadge()}
        </Flex>
      </CardHeader>
      <CardContent>
        <Stack gap="md">
          <Button
            type="button"
            variant="outline"
            onClick={validateAddress}
            disabled={isValidating || !address}
            className="w-full"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isValidating ? 'animate-spin' : ''}`} />
            {isValidating ? 'Validating...' : 'Validate Address'}
          </Button>

          {result && result.issues.length > 0 && (
            <Alert variant="destructive">
              <AlertDescription>
                <div className="font-semibold mb-2">Issues Found:</div>
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
              <AlertDescription>
                <div className="font-semibold mb-2">Suggestions:</div>
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
              <AlertDescription>
                Address validation passed! Your address is properly formatted and complete.
              </AlertDescription>
            </Alert>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}

'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@enorae/ui'
import { getStripePublishableKey } from '../lib/stripe-client'
import { createPaymentIntent, confirmPayment } from '../actions/payment.actions'
import type { PaymentDetails } from '../types/payment.types'

// Load Stripe
const stripePromise = loadStripe(getStripePublishableKey())

interface PaymentFormProps {
  paymentDetails: PaymentDetails
  onSuccess?: () => void
  onError?: (error: string) => void
}

function CheckoutForm({ paymentDetails, onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setErrorMessage(null)

    try {
      // Confirm payment with Stripe
      const { error: stripeError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/booking/success`,
        },
        redirect: 'if_required',
      })

      if (stripeError) {
        setErrorMessage(stripeError.message || 'Payment failed')
        onError?.(stripeError.message || 'Payment failed')
      } else {
        // Payment succeeded
        onSuccess?.()
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Payment processing failed'
      setErrorMessage(message)
      onError?.(message)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
          <CardDescription>
            Complete your booking by entering your payment information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PaymentElement />
          {errorMessage && (
            <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md text-sm">
              {errorMessage}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            disabled={!stripe || isProcessing}
            className="w-full"
          >
            {isProcessing ? 'Processing...' : `Pay $${paymentDetails.amount.toFixed(2)}`}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

export function PaymentForm({ paymentDetails, onSuccess, onError }: PaymentFormProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Create payment intent on mount
  useState(() => {
    createPaymentIntent(paymentDetails).then((result) => {
      if (result.success && result.clientSecret) {
        setClientSecret(result.clientSecret)
      } else {
        onError?.(result.error || 'Failed to initialize payment')
      }
      setLoading(false)
    })
  })

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!clientSecret) {
    return (
      <Card>
        <CardContent className="p-8">
          <p className="text-center text-muted-foreground">
            Unable to initialize payment. Please try again.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#000000',
          },
        },
      }}
    >
      <CheckoutForm
        paymentDetails={paymentDetails}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  )
}
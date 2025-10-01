'use server'

import { stripe } from '../lib/stripe-client'
import { createClient } from '@/lib/supabase/client'
import type { PaymentDetails } from '../types/payment.types'

export async function createPaymentIntent(details: PaymentDetails) {
  const supabase = await createClient()

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  try {
    // Create or retrieve Stripe customer
    let customerId: string

    // Check if user already has a Stripe customer ID
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    if ((profile as any)?.stripe_customer_id) {
      customerId = (profile as any).stripe_customer_id
    } else {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: details.customerEmail,
        name: details.customerName,
        metadata: {
          userId: user.id,
        },
      })
      customerId = customer.id

      // Save Stripe customer ID to profile
      await (supabase as any)
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id)
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(details.amount * 100), // Convert to cents
      currency: 'usd',
      customer: customerId,
      metadata: {
        appointmentId: details.appointmentId,
        serviceName: details.serviceName,
        salonName: details.salonName,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    // Store payment record in database
    const { error } = await (supabase as any)
      .from('transactions')
      .insert({
        appointment_id: details.appointmentId,
        amount: details.amount,
        status: 'pending',
        payment_intent_id: paymentIntent.id,
        customer_id: user.id,
      })

    if (error) throw error

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    }
  } catch (error) {
    console.error('Error creating payment intent:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create payment',
    }
  }
}

export async function confirmPayment(paymentIntentId: string) {
  const supabase = await createClient()

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  try {
    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    // Update transaction status in database
    const { error } = await (supabase as any)
      .from('transactions')
      .update({
        status: paymentIntent.status === 'succeeded' ? 'succeeded' : 'failed',
        updated_at: new Date().toISOString(),
      })
      .eq('payment_intent_id', paymentIntentId)

    if (error) throw error

    // If payment succeeded, update appointment status
    if (paymentIntent.status === 'succeeded') {
      const appointmentId = paymentIntent.metadata.appointmentId
      await (supabase as any)
        .from('appointments')
        .update({ status: 'confirmed' })
        .eq('id', appointmentId)
    }

    return {
      success: true,
      status: paymentIntent.status,
    }
  } catch (error) {
    console.error('Error confirming payment:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to confirm payment',
    }
  }
}

export async function refundPayment(paymentIntentId: string, reason?: string) {
  const supabase = await createClient()

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  try {
    // Create refund in Stripe
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      reason: reason as any || 'requested_by_customer',
    })

    // Update transaction status in database
    const { error } = await (supabase as any)
      .from('transactions')
      .update({
        status: 'refunded',
        updated_at: new Date().toISOString(),
      })
      .eq('payment_intent_id', paymentIntentId)

    if (error) throw error

    return {
      success: true,
      refundId: refund.id,
    }
  } catch (error) {
    console.error('Error refunding payment:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to refund payment',
    }
  }
}

export async function getPaymentHistory(customerId?: string) {
  const supabase = await createClient()

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const query = supabase
    .from('transactions')
    .select(`
      id,
      appointment_id,
      amount,
      status,
      created_at,
      appointments:appointment_id (
        salons:salon_id (
          name
        ),
        services:appointment_services!inner(
          services:service_id (
            name
          )
        )
      )
    `)
    .order('created_at', { ascending: false })

  // Filter by customer if provided, otherwise get current user's transactions
  if (customerId) {
    query.eq('customer_id', customerId)
  } else {
    query.eq('customer_id', user.id)
  }

  const { data, error } = await query

  if (error) throw error

  return data
}
export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status: string
  clientSecret: string
  appointmentId: string
  customerId: string
  salonId: string
}

export interface PaymentDetails {
  appointmentId: string
  amount: number
  serviceName: string
  salonName: string
  customerEmail: string
  customerName: string
}

export interface PaymentMethod {
  id: string
  type: 'card' | 'bank_transfer' | 'cash'
  last4?: string
  brand?: string
}

export interface Transaction {
  id: string
  appointmentId: string
  amount: number
  status: 'pending' | 'succeeded' | 'failed' | 'refunded'
  paymentIntentId: string
  createdAt: Date
  updatedAt: Date
}
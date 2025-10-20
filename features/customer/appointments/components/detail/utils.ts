export function getStatusVariant(status: string | null): 'default' | 'destructive' | 'secondary' {
  switch (status) {
    case 'completed':
    case 'confirmed':
      return 'default'
    case 'cancelled':
      return 'destructive'
    default:
      return 'secondary'
  }
}

export function formatCurrency(amount: number | null): string {
  if (amount === null || amount === undefined) return 'N/A'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

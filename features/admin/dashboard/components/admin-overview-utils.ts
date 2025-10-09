const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export const formatCurrency = (value: number | null | undefined): string =>
  formatter.format(value ?? 0)

export const appointmentStatusVariant: Record<string, 'default' | 'secondary' | 'destructive'> = {
  completed: 'default',
  confirmed: 'default',
  scheduled: 'secondary',
  pending: 'secondary',
  cancelled: 'destructive',
  no_show: 'destructive',
}

export const formatCurrency = (amount: number | null | undefined) => {
  if (amount === null || amount === undefined) {
    return 'N/A'
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

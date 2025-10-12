import type { Metadata } from 'next'
import { FinancePageContent } from '@/features/admin/finance'

export const metadata: Metadata = {
  title: 'Finance & Revenue | Admin',
  description: 'Platform-wide revenue analytics and financial management',
}

type FinancePageProps = {
  searchParams?: Promise<{ startDate?: string; endDate?: string }>
}

export default async function AdminFinancePage({ searchParams }: FinancePageProps) {
  const resolved = searchParams ? await searchParams : undefined

  return <FinancePageContent startDate={resolved?.startDate} endDate={resolved?.endDate} />
}

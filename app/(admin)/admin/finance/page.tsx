import { FinancePageFeature, adminFinanceMetadata } from '@/features/admin/finance'

export const metadata = adminFinanceMetadata

export default function Page(props: Parameters<typeof FinancePageFeature>[0]) {
  return <FinancePageFeature {...props} />
}

import { CustomerNav } from '@/features/navigation/components/customer-nav'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CustomerNav />
      {children}
    </>
  )
}
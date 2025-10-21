import { BasePortalLayout } from '@/features/shared/portal-shell'

export const runtime = 'nodejs'

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <BasePortalLayout portal="business" title="Business Portal">
      {children}
    </BasePortalLayout>
  )
}

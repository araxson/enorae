import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import type { StaffBreadcrumb } from './types'

interface StaffPageBreadcrumbsProps {
  breadcrumbs: readonly StaffBreadcrumb[]
}

export function StaffPageBreadcrumbs({ breadcrumbs }: StaffPageBreadcrumbsProps) {
  if (!breadcrumbs || breadcrumbs.length === 0) return null

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1
          return (
            <BreadcrumbItem key={`${crumb.label}-${index}`}>
              {crumb.href && !isLast ? (
                <>
                  <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                  <BreadcrumbSeparator />
                </>
              ) : (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

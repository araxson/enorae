/**
 * Page Breadcrumbs Component
 * Visual breadcrumb navigation using shadcn/ui breadcrumb component
 */

import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Container } from '@/components/layout'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface PageBreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export function PageBreadcrumbs({ items, className }: PageBreadcrumbsProps) {
  if (items.length === 0) return null

  return (
    <div className={className}>
      <Container>
        <Breadcrumb>
          <BreadcrumbList>
            {items.map((item, index) => {
              const isLast = index === items.length - 1

              return (
                <div key={index} className="contents">
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={item.href || '/'}>{item.label}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator />}
                </div>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </Container>
    </div>
  )
}
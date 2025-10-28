import type { ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface AdminMetricCardProps {
  icon?: ReactNode
  title: string
  description?: string
  value: ReactNode
  valueAdornment?: ReactNode
  helper?: ReactNode
  badge?: ReactNode
}

export function AdminMetricCard({
  icon,
  title,
  description,
  value,
  valueAdornment,
  helper,
  badge,
}: AdminMetricCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            {icon ? (
              <div className="flex size-10 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground">
                {icon}
              </div>
            ) : null}
            <div>
              <CardTitle>{title}</CardTitle>
              {description ? <CardDescription>{description}</CardDescription> : null}
            </div>
          </div>
          {badge ? <div className="flex flex-none items-center">{badge}</div> : null}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-3xl font-semibold leading-none tracking-tight text-foreground">
            {value}
          </div>
          {valueAdornment ? <div>{valueAdornment}</div> : null}
          {helper ? <div className="text-sm text-muted-foreground">{helper}</div> : null}
        </div>
      </CardContent>
    </Card>
  )
}

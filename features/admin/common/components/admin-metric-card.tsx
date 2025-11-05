import type { ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { InfoIcon } from 'lucide-react'

interface AdminMetricCardProps {
  icon?: ReactNode
  title: string
  description?: string
  value: ReactNode
  valueAdornment?: ReactNode
  helper?: ReactNode
  badge?: ReactNode
  tooltip?: string
}

export function AdminMetricCard({
  icon,
  title,
  description,
  value,
  valueAdornment,
  helper,
  badge,
  tooltip,
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
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CardTitle>{title}</CardTitle>
                {tooltip && (
                  <TooltipProvider delayDuration={150}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={`More information about ${title}`}
                        >
                          <InfoIcon className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>{tooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
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

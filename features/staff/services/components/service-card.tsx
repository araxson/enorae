'use client'

import { useState } from 'react'
import { Clock, DollarSign, Star, TrendingUp, MoreVertical, Power } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/lib/hooks/use-toast'
import { toggleServiceAvailability, updateServiceProficiency } from '../api/mutations'

type StaffService = {
  id: string
  service_name: string
  category_name?: string | null
  effective_duration?: number | null
  effective_price?: number | null
  proficiency_level?: string | null
  performed_count?: number | null
  rating_average?: number | null
  rating_count?: number | null
  is_available?: boolean | null
}

type ServiceCardProps = {
  service: StaffService
}

function getProficiencyColor(level?: string | null) {
  switch (level) {
    case 'expert':
      return 'default'
    case 'intermediate':
      return 'secondary'
    case 'beginner':
      return 'outline'
    default:
      return 'outline'
  }
}

export function ServiceCard({ service }: ServiceCardProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()

  const handleToggleAvailability = async () => {
    setIsUpdating(true)
    try {
      await toggleServiceAvailability(service.id, !(service.is_available ?? true))
      toast({
        title: 'Service updated',
        description: `Service ${service.is_available ? 'disabled' : 'enabled'} successfully`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update service',
        variant: 'destructive',
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleUpdateProficiency = async (level: 'beginner' | 'intermediate' | 'advanced' | 'expert') => {
    setIsUpdating(true)
    try {
      await updateServiceProficiency(service.id, level)
      toast({
        title: 'Proficiency updated',
        description: `Service proficiency set to ${level}`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update proficiency',
        variant: 'destructive',
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Card className={service.is_available === false ? 'opacity-60' : ''}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle>{service.service_name}</CardTitle>
              {service.is_available === false && (
                <Badge variant="outline" className="text-xs">
                  Unavailable
                </Badge>
              )}
            </div>
            {service.category_name && <p className="text-sm text-muted-foreground text-sm">{service.category_name}</p>}
          </div>
          <div className="flex items-center gap-2">
            {service.proficiency_level && (
              <Badge variant={getProficiencyColor(service.proficiency_level)} className="capitalize">
                {service.proficiency_level}
              </Badge>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" disabled={isUpdating}>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Service actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleToggleAvailability}>
                  <Power className="mr-2 h-4 w-4" />
                  {service.is_available === false ? 'Enable' : 'Disable'} service
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Update proficiency</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleUpdateProficiency('beginner')}>
                  Beginner
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdateProficiency('intermediate')}>
                  Intermediate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdateProficiency('advanced')}>
                  Advanced
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdateProficiency('expert')}>
                  Expert
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {service.effective_duration && (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <p className="leading-7 text-sm">{service.effective_duration} minutes</p>
          </div>
        )}
        {service.effective_price && (
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <p className="leading-7 text-sm">${service.effective_price}</p>
          </div>
        )}
        {service.performed_count != null && service.performed_count > 0 && (
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground text-sm">Performed {service.performed_count} times</p>
          </div>
        )}
        {service.rating_average && service.rating_count && service.rating_count > 0 && (
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 fill-warning text-warning" />
            <p className="leading-7 text-sm">
              {service.rating_average.toFixed(1)} ({service.rating_count} reviews)
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

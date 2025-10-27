'use client'

import { useState } from 'react'
import { Clock, DollarSign, Star, TrendingUp, MoreVertical, Power } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import { toggleServiceAvailability, updateServiceProficiency } from '@/features/staff/services/api/mutations'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'

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

const formatLabel = (value?: string | null) =>
  (value ?? '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())

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
        <ItemGroup>
          <Item variant="muted" size="sm">
            <ItemContent>
              <CardTitle>{service.service_name}</CardTitle>
              {service.category_name ? (
                <CardDescription>{service.category_name}</CardDescription>
              ) : null}
            </ItemContent>
            <ItemActions className="flex items-center gap-2">
              {service.is_available === false ? (
                <Badge variant="outline">Unavailable</Badge>
              ) : null}
              {service.proficiency_level ? (
                <Badge variant={getProficiencyColor(service.proficiency_level)}>
                  {formatLabel(service.proficiency_level)}
                </Badge>
              ) : null}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" disabled={isUpdating} aria-label="Service actions menu">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Service actions</span>
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
            </ItemActions>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        <ItemGroup className="gap-2">
          {service.effective_duration && (
            <Item size="sm" variant="muted">
              <ItemMedia variant="icon">
                <Clock className="h-4 w-4" aria-hidden="true" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{service.effective_duration} minutes</ItemTitle>
                <ItemDescription>Duration</ItemDescription>
              </ItemContent>
            </Item>
          )}
          {service.effective_price && (
            <Item size="sm" variant="muted">
              <ItemMedia variant="icon">
                <DollarSign className="h-4 w-4" aria-hidden="true" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>${service.effective_price}</ItemTitle>
                <ItemDescription>Base price</ItemDescription>
              </ItemContent>
            </Item>
          )}
          {service.performed_count != null && service.performed_count > 0 && (
            <Item size="sm" variant="muted">
              <ItemMedia variant="icon">
                <TrendingUp className="h-4 w-4" aria-hidden="true" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Performed {service.performed_count} times</ItemTitle>
              </ItemContent>
            </Item>
          )}
          {service.rating_average && service.rating_count && service.rating_count > 0 && (
            <Item size="sm" variant="muted">
              <ItemMedia variant="icon">
                <Star className="h-4 w-4 fill-accent text-accent" aria-hidden="true" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{service.rating_average.toFixed(1)} rating</ItemTitle>
                <ItemDescription>{service.rating_count} reviews</ItemDescription>
              </ItemContent>
            </Item>
          )}
        </ItemGroup>
      </CardContent>
    </Card>
  )
}

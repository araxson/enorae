"use client"

import { Scissors, Star, TrendingUp } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/shared/empty-state'
import { SearchInput } from '@/components/shared/search-input'
import { Box, Group, Stack } from '@/components/layout'
import { H4, Muted } from '@/components/ui/typography'

import type { StaffMemberWithServices } from './types'

type StaffServicesListProps = {
  staff: StaffMemberWithServices[]
  filteredStaff: StaffMemberWithServices[]
  searchQuery: string
  onSearchChange: (value: string) => void
  onManageStaff: (member: StaffMemberWithServices) => void
}

export function StaffServicesList({
  staff,
  filteredStaff,
  searchQuery,
  onSearchChange,
  onManageStaff,
}: StaffServicesListProps) {
  if (staff.length === 0) {
    return (
      <EmptyState
        icon={Scissors}
        title="No staff members"
        description="Add staff members to your team to manage their services"
      />
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Staff Services Management</CardTitle>
        <Box className="mt-4">
          <SearchInput
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search by name, title, or service..."
            className="w-full"
          />
        </Box>
      </CardHeader>
      <CardContent>
        {filteredStaff.length === 0 ? (
          <EmptyState
            icon={Scissors}
            title="No staff found"
            description="Try adjusting your search query"
          />
        ) : (
          <Stack gap="md">
            {filteredStaff.map((member) => (
              <StaffMemberCard
                key={member.id}
                member={member}
                onManage={() => onManageStaff(member)}
              />
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  )
}

type StaffMemberCardProps = {
  member: StaffMemberWithServices
  onManage: () => void
}

function StaffMemberCard({ member, onManage }: StaffMemberCardProps) {
  return (
    <Group gap="md" className="pb-4 border-b last:border-0 last:pb-0">
      <Avatar>
        {member.avatar_url && (
          <AvatarImage src={member.avatar_url} alt={member.full_name || 'Staff'} />
        )}
        <AvatarFallback>
          {member.full_name?.slice(0, 2).toUpperCase() || 'ST'}
        </AvatarFallback>
      </Avatar>

      <Stack gap="xs" className="flex-1">
        <H4 className="text-base">{member.full_name || 'Staff Member'}</H4>
        {member.title && <Muted className="text-sm">{member.title}</Muted>}

        <div className="flex flex-wrap gap-2 mt-2">
          {member.services.length === 0 ? (
            <Muted className="text-xs">No services assigned</Muted>
          ) : (
            member.services.map((service: StaffMemberWithServices['services'][number]) => (
              <ServiceBadge key={service.id} service={service} />
            ))
          )}
        </div>
      </Stack>

      <Button variant="outline" size="sm" onClick={onManage}>
        <Scissors className="h-4 w-4 mr-2" />
        Manage Services
      </Button>
    </Group>
  )
}

function ServiceBadge({
  service,
}: {
  service: StaffMemberWithServices['services'][number]
}) {
  return (
    <div className="flex flex-col gap-1">
      <Badge variant="secondary" className="text-xs">
        {service.service_name}
        {service.proficiency_level && (
          <span className="ml-1 opacity-70">({service.proficiency_level})</span>
        )}
      </Badge>

      {(service.performed_count || service.rating_average) && (
        <div className="flex gap-3 text-xs text-muted-foreground mt-1">
          {service.performed_count && service.performed_count > 0 && (
            <span className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {service.performed_count} performed
            </span>
          )}
          {service.rating_average && service.rating_average > 0 && (
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              {Number(service.rating_average).toFixed(1)} ({service.rating_count || 0} reviews)
            </span>
          )}
        </div>
      )}
    </div>
  )
}

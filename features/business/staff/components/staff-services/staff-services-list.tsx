"use client"
import { Scissors, Star, TrendingUp } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { SearchInput } from '@/features/shared/ui-components'
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
      <Empty>
        <EmptyMedia variant="icon">
          <Scissors className="size-6" aria-hidden="true" />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>No staff members</EmptyTitle>
          <EmptyDescription>Add staff members to your team to manage their services.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>Invite staff to assign services and set availability.</EmptyContent>
      </Empty>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Staff Services Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <SearchInput
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search by name, title, or service..."
            className="w-full"
          />
        </div>
        {filteredStaff.length === 0 ? (
          <Empty>
            <EmptyMedia variant="icon">
              <Scissors className="size-6" aria-hidden="true" />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle>No staff found</EmptyTitle>
              <EmptyDescription>Try adjusting your search query.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>Clear filters or search by another role to continue.</EmptyContent>
          </Empty>
        ) : (
          <ItemGroup className="gap-3">
            {filteredStaff.map((member) => (
              <StaffMemberCard
                key={member['id']}
                member={member}
                onManage={() => onManageStaff(member)}
              />
            ))}
          </ItemGroup>
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
    <Item variant="outline" className="sm:items-center">
      <ItemMedia className="flex-shrink-0">
        <Avatar>
          {member['avatar_url'] && (
            <AvatarImage src={member['avatar_url']} alt={member['full_name'] || 'Staff'} />
          )}
          <AvatarFallback>
            {member['full_name']?.slice(0, 2).toUpperCase() || 'ST'}
          </AvatarFallback>
        </Avatar>
      </ItemMedia>

      <ItemContent>
        <ItemTitle>{member['full_name'] || 'Staff Member'}</ItemTitle>
        {member['title'] ? <ItemDescription>{member['title']}</ItemDescription> : null}
        <div className="mt-2 flex flex-wrap gap-2">
          {member.services.length === 0 ? (
            <ItemDescription>No services assigned</ItemDescription>
          ) : (
            member.services.map((service: StaffMemberWithServices['services'][number]) => (
              <ServiceBadge key={service['id']} service={service} />
            ))
          )}
        </div>
      </ItemContent>

      <ItemActions>
        <Button variant="outline" size="sm" onClick={onManage}>
          <Scissors className="size-4 mr-2" />
          Manage Services
        </Button>
      </ItemActions>
    </Item>
  )
}

function ServiceBadge({
  service,
}: {
  service: StaffMemberWithServices['services'][number]
}) {
  return (
    <div className="flex flex-col gap-1">
      <Badge variant="secondary">
        <span className="flex items-center gap-1 text-xs">
          <span>{service['service_name']}</span>
          {service['proficiency_level'] && (
            <span className="opacity-70">({service['proficiency_level']})</span>
          )}
        </span>
      </Badge>

      {service['rating_average'] && service['rating_average'] > 0 && (
        <div className="flex gap-3 text-xs text-muted-foreground mt-1">
          <span className="flex items-center gap-1">
            <Star className="size-3 text-accent" fill="currentColor" />
            {Number(service['rating_average']).toFixed(1)} rating
          </span>
        </div>
      )}
    </div>
  )
}

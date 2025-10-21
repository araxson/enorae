"use client"

import { Scissors, Star, TrendingUp } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/shared/empty-state'
import { SearchInput } from '@/components/shared/search-input'
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
        <div className="mt-4">
          <SearchInput
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search by name, title, or service..."
            className="w-full"
          />
        </div>
      </CardHeader>
      <CardContent>
        {filteredStaff.length === 0 ? (
          <EmptyState
            icon={Scissors}
            title="No staff found"
            description="Try adjusting your search query"
          />
        ) : (
          <div className="flex flex-col gap-4">
            {filteredStaff.map((member) => (
              <StaffMemberCard
                key={member.id}
                member={member}
                onManage={() => onManageStaff(member)}
              />
            ))}
          </div>
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
    <div className="flex gap-4 items-center pb-4 border-b last:border-0 last:pb-0">
      <Avatar>
        {member.avatar_url && (
          <AvatarImage src={member.avatar_url} alt={member.full_name || 'Staff'} />
        )}
        <AvatarFallback>
          {member.full_name?.slice(0, 2).toUpperCase() || 'ST'}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col gap-2 flex-1">
        <h4 className="scroll-m-20 text-xl font-semibold text-base">{member.full_name || 'Staff Member'}</h4>
        {member.title && <p className="text-sm text-muted-foreground text-sm">{member.title}</p>}

        <div className="flex flex-wrap gap-2 mt-2">
          {member.services.length === 0 ? (
            <p className="text-sm text-muted-foreground text-xs">No services assigned</p>
          ) : (
            member.services.map((service: StaffMemberWithServices['services'][number]) => (
              <ServiceBadge key={service.id} service={service} />
            ))
          )}
        </div>
      </div>

      <Button variant="outline" size="sm" onClick={onManage}>
        <Scissors className="h-4 w-4 mr-2" />
        Manage Services
      </Button>
    </div>
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
              <Star className="h-3 w-3 text-accent" fill="currentColor" />
              {Number(service.rating_average).toFixed(1)} ({service.rating_count || 0} reviews)
            </span>
          )}
        </div>
      )}
    </div>
  )
}

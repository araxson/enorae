'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@enorae/ui'
import { RadioGroup, RadioGroupItem } from '@enorae/ui'
import { Label } from '@enorae/ui'
import { Avatar, AvatarFallback } from '@enorae/ui'
import type { Staff } from '../types/booking.types'

interface StaffSelectorProps {
  staff: Staff[]
  selectedStaff?: string
  onSelectStaff: (staffId: string) => void
}

export function StaffSelector({
  staff,
  selectedStaff,
  onSelectStaff
}: StaffSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Staff Member</CardTitle>
        <CardDescription>Choose who you'd like to book with</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedStaff} onValueChange={onSelectStaff}>
          <div className="space-y-3">
            {staff.map((member) => (
              <div key={member.id} className="flex items-center space-x-3">
                <RadioGroupItem value={member.id!} id={member.id!} />
                <Label htmlFor={member.id!} className="flex items-center gap-3 flex-1 cursor-pointer">
                  <Avatar>
                    <AvatarFallback>
                      {member.title?.charAt(0) || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.title}</p>
                    {member.experience_years && (
                      <p className="text-sm text-muted-foreground">
                        {member.experience_years} years experience
                      </p>
                    )}
                  </div>
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  )
}
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Mail, Star, Briefcase } from 'lucide-react'
import type { StaffProfile } from '@/features/customer/staff-profiles/api/queries'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'

interface StaffProfileDetailProps {
  profile: StaffProfile
}

export function StaffProfileDetail({ profile }: StaffProfileDetailProps) {
  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader className="p-6 pb-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-xl space-y-2">
              <CardTitle>{profile['title'] || 'Staff Member'}</CardTitle>
              {profile['bio'] ? <CardDescription>{profile['bio']}</CardDescription> : null}
            </div>
            {profile.average_rating ? (
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5" aria-hidden="true" />
                <CardDescription>{profile.average_rating.toFixed(1)}</CardDescription>
                <CardDescription>
                  ({profile.review_count ?? 0} reviews)
                </CardDescription>
              </div>
            ) : null}
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="flex flex-col gap-4">
            {profile['email'] ? (
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4" aria-hidden="true" />
                <CardDescription>{profile['email']}</CardDescription>
              </div>
            ) : null}

            {profile.specialties && profile.specialties.length > 0 ? (
              <div className="space-y-2">
                <CardDescription>Specialties</CardDescription>
                <div className="flex flex-wrap gap-2">
                  {(profile.specialties as string[]).map((specialty, index) => (
                    <Badge key={index} variant="secondary">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : null}

            {profile.certifications && profile.certifications.length > 0 ? (
              <div className="space-y-2">
                <CardDescription>Certifications</CardDescription>
                <div className="flex flex-wrap gap-2">
                  {(profile.certifications as string[]).map((cert, index) => (
                    <Badge key={index} variant="outline">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {profile.services && profile.services.length > 0 ? (
        <div className="space-y-4">
          <CardTitle>Services Offered</CardTitle>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {profile.services.map((service) => (
              <Card key={service['id']}>
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle>{service['name']}</CardTitle>
                    {service['price'] ? (
                      <CardDescription>${service['price']}</CardDescription>
                    ) : null}
                  </div>
                  {service['category_name'] ? (
                    <div className="flex justify-end">
                      <Badge variant="secondary">{service['category_name']}</Badge>
                    </div>
                  ) : null}
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <ItemGroup className="gap-3">
                    {service['description'] ? (
                      <Item variant="muted">
                        <ItemContent>
                          <ItemDescription>{service['description']}</ItemDescription>
                        </ItemContent>
                      </Item>
                    ) : null}
                    {service['duration_minutes'] ? (
                      <Item variant="muted">
                        <ItemContent className="flex items-center gap-2">
                          <Briefcase className="h-3 w-3" aria-hidden="true" />
                          <ItemTitle>{service['duration_minutes']} minutes</ItemTitle>
                        </ItemContent>
                      </Item>
                    ) : null}
                  </ItemGroup>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : null}

      {profile['salon_id'] ? (
        <Card>
          <CardHeader className="p-6 pb-2">
            <CardTitle>Book an Appointment</CardTitle>
            <CardDescription>
              Schedule a session with {profile['title'] || 'this staff member'}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6">
            <CardDescription>
              Choose a suitable time and confirm your booking in just a few steps.
            </CardDescription>
          </CardContent>
          <CardFooter className="p-6 pt-0 justify-end">
            <Link href={`/customer/book/${profile['salon_id']}?staff=${profile['id']}`}>
              <Button>Book Now</Button>
            </Link>
          </CardFooter>
        </Card>
      ) : null}
    </div>
  )
}

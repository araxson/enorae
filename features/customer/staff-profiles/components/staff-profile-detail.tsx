import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Mail, Star, Briefcase } from 'lucide-react'
import type { StaffProfile } from '@/features/customer/staff-profiles/api/queries'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'

interface StaffProfileDetailProps {
  profile: StaffProfile
}

export function StaffProfileDetail({ profile }: StaffProfileDetailProps) {
  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 pb-4">
            <ItemGroup>
              <Item className="flex-wrap items-start justify-between gap-4">
                <ItemContent className="max-w-xl space-y-2">
                  <ItemTitle>{profile['title'] || 'Staff Member'}</ItemTitle>
                  {profile['bio'] ? <ItemDescription>{profile['bio']}</ItemDescription> : null}
                </ItemContent>
                {profile.average_rating ? (
                  <ItemActions className="flex items-center gap-2">
                    <Star className="size-5" aria-hidden="true" />
                    <ItemDescription>{profile.average_rating.toFixed(1)}</ItemDescription>
                    <ItemDescription>
                      ({profile.review_count ?? 0} reviews)
                    </ItemDescription>
                  </ItemActions>
                ) : null}
              </Item>
            </ItemGroup>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <ItemGroup className="gap-4">
            {profile['email'] ? (
              <Item variant="muted">
                <ItemMedia variant="icon">
                  <Mail className="size-4" aria-hidden="true" />
                </ItemMedia>
                <ItemContent>
                  <ItemDescription>{profile['email']}</ItemDescription>
                </ItemContent>
              </Item>
            ) : null}

            {profile.specialties && profile.specialties.length > 0 ? (
              <Item variant="muted">
                <ItemContent className="space-y-2">
                  <ItemDescription className="text-xs text-muted-foreground">
                    Specialties
                  </ItemDescription>
                  <ItemActions className="flex-wrap gap-2">
                    {(profile.specialties as string[]).map((specialty, index) => (
                      <Badge key={index} variant="secondary">
                        {specialty}
                      </Badge>
                    ))}
                  </ItemActions>
                </ItemContent>
              </Item>
            ) : null}

            {profile.certifications && profile.certifications.length > 0 ? (
              <Item variant="muted">
                <ItemContent className="space-y-2">
                  <ItemDescription className="text-xs text-muted-foreground">
                    Certifications
                  </ItemDescription>
                  <ItemActions className="flex-wrap gap-2">
                    {(profile.certifications as string[]).map((cert, index) => (
                      <Badge key={index} variant="outline">
                        {cert}
                      </Badge>
                    ))}
                  </ItemActions>
                </ItemContent>
              </Item>
            ) : null}
          </ItemGroup>
        </CardContent>
      </Card>

      {profile.services && profile.services.length > 0 ? (
        <div className="space-y-4">
          <CardTitle>Services Offered</CardTitle>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {profile.services.map((service) => (
              <Card key={service['id']}>
                <CardHeader>
                  <div className="flex flex-col gap-2 pb-2">
                    <ItemGroup className="gap-2">
                      <Item className="items-start justify-between gap-3">
                        <ItemContent>
                          <ItemTitle>{service['name']}</ItemTitle>
                        </ItemContent>
                        {service['price'] ? (
                          <ItemActions className="flex-none">
                            <Badge variant="secondary">${service['price']}</Badge>
                          </ItemActions>
                        ) : null}
                      </Item>
                      {service['category_name'] ? (
                        <ItemActions className="justify-end">
                          <Badge variant="secondary">{service['category_name']}</Badge>
                        </ItemActions>
                      ) : null}
                    </ItemGroup>
                  </div>
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
                          <Briefcase className="size-3" aria-hidden="true" />
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
          <CardHeader>
            <div className="flex flex-col gap-1 pb-2">
              <ItemGroup>
                <Item className="flex-col items-start gap-1">
                  <ItemContent>
                    <ItemTitle>Book an Appointment</ItemTitle>
                  </ItemContent>
                  <ItemContent>
                    <ItemDescription>
                      Schedule a session with {profile['title'] || 'this staff member'}
                    </ItemDescription>
                  </ItemContent>
                </Item>
              </ItemGroup>
            </div>
          </CardHeader>
          <CardContent className="px-6">
            <CardDescription>
              Choose a suitable time and confirm your booking in just a few steps.
            </CardDescription>
          </CardContent>
          <CardFooter className="p-6 pt-0 justify-end">
            <Button
              asChild
              className="min-w-32 justify-center"
            >
              <Link href={`/customer/book/${profile['salon_id']}?staff=${profile['id']}`}>
                Book Now
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ) : null}
    </div>
  )
}

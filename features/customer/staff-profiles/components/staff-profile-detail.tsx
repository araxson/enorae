import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Mail, Star, Briefcase } from 'lucide-react'
import type { StaffProfile } from '@/features/customer/staff-profiles/api/queries'

interface StaffProfileDetailProps {
  profile: StaffProfile
}

export function StaffProfileDetail({ profile }: StaffProfileDetailProps) {
  return (
    <div className="flex flex-col gap-8">
      {/* Profile Header */}
      <Card>
        <CardHeader className="p-6 pb-4">
          <div className="flex gap-4 items-start justify-between flex-wrap">
            <div className="max-w-xl space-y-2">
              <CardTitle>{profile['title'] || 'Staff Member'}</CardTitle>
              {profile['bio'] && <CardDescription>{profile['bio']}</CardDescription>}
            </div>
            {profile.average_rating && (
              <div className="flex gap-2 items-center">
                <Star className="h-5 w-5 fill-primary text-primary" />
                <p>{profile.average_rating.toFixed(1)}</p>
                <p className="text-sm text-muted-foreground">
                  ({profile.review_count || 0} reviews)
                </p>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="flex flex-col gap-4">
            {profile['email'] && (
              <div className="flex gap-3 items-center">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{profile['email']}</p>
              </div>
            )}

            {profile.specialties && profile.specialties.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2">Specialties</p>
                <div className="flex gap-2 flex-wrap">
                  {(profile.specialties as string[]).map((specialty, index) => (
                    <Badge key={index} variant="secondary">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {profile.certifications && profile.certifications.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2">Certifications</p>
                <div className="flex gap-2 flex-wrap">
                  {(profile.certifications as string[]).map((cert, index) => (
                    <Badge key={index} variant="outline">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Services Offered */}
      {profile.services && profile.services.length > 0 && (
        <div>
          <h3 className="scroll-m-20 text-2xl mb-4">Services Offered</h3>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {profile.services.map((service) => (
              <Card key={service['id']}>
                <CardHeader className="p-4 pb-2">
                  <div className="flex gap-3 items-start justify-between">
                    <CardTitle>{service['name']}</CardTitle>
                    {service['price'] && <p>${service['price']}</p>}
                  </div>
                  {service['category_name'] && (
                    <div className="flex justify-end">
                      <Badge variant="secondary">{service['category_name']}</Badge>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex flex-col gap-3">
                    {service['description'] && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {service['description']}
                      </p>
                    )}
                    {service['duration_minutes'] && (
                      <p className="text-sm text-muted-foreground">
                        <Briefcase className="inline h-3 w-3 mr-1" />
                        {service['duration_minutes']} minutes
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Book Appointment CTA */}
      {profile['salon_id'] && (
        <Card className="bg-primary/5">
          <CardHeader className="p-6 pb-2">
            <CardTitle>Book an Appointment</CardTitle>
            <CardDescription>
              Schedule a session with {profile['title'] || 'this staff member'}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6">
            <p className="text-sm text-muted-foreground">
              Choose a suitable time and confirm your booking in just a few steps.
            </p>
          </CardContent>
          <CardFooter className="p-6 pt-0 justify-end">
            <Link href={`/customer/book/${profile['salon_id']}?staff=${profile['id']}`}>
              <Button>Book Now</Button>
            </Link>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

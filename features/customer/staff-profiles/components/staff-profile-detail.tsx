import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Stack, Flex, Box, Grid } from '@/components/layout'
import { Mail, Star, Briefcase } from 'lucide-react'
import type { StaffProfile } from '../api/queries'

interface StaffProfileDetailProps {
  profile: StaffProfile
}

export function StaffProfileDetail({ profile }: StaffProfileDetailProps) {
  return (
    <Stack gap="xl">
      {/* Profile Header */}
      <Card>
        <CardHeader className="p-6 pb-4">
          <Flex justify="between" align="start" gap="md" wrap="wrap">
            <Box className="max-w-xl space-y-2">
              <CardTitle>{profile.title || 'Staff Member'}</CardTitle>
              {profile.bio && <CardDescription>{profile.bio}</CardDescription>}
            </Box>
            {profile.average_rating && (
              <Flex gap="xs" align="center">
                <Star className="h-5 w-5 fill-primary text-primary" />
                <p className="font-semibold">{profile.average_rating.toFixed(1)}</p>
                <p className="text-sm text-muted-foreground">
                  ({profile.review_count || 0} reviews)
                </p>
              </Flex>
            )}
          </Flex>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <Stack gap="md">
            {profile.email && (
              <Flex gap="sm" align="center">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{profile.email}</p>
              </Flex>
            )}

            {profile.specialties && profile.specialties.length > 0 && (
              <Box>
                <p className="text-xs text-muted-foreground mb-2">Specialties</p>
                <Flex gap="xs" wrap="wrap">
                  {(profile.specialties as string[]).map((specialty, index) => (
                    <Badge key={index} variant="secondary">
                      {specialty}
                    </Badge>
                  ))}
                </Flex>
              </Box>
            )}

            {profile.certifications && profile.certifications.length > 0 && (
              <Box>
                <p className="text-xs text-muted-foreground mb-2">Certifications</p>
                <Flex gap="xs" wrap="wrap">
                  {(profile.certifications as string[]).map((cert, index) => (
                    <Badge key={index} variant="outline">
                      {cert}
                    </Badge>
                  ))}
                </Flex>
              </Box>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Services Offered */}
      {profile.services && profile.services.length > 0 && (
        <Box>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-4">Services Offered</h3>
          <Grid cols={{ base: 1, md: 2 }} gap="md">
            {profile.services.map((service) => (
              <Card key={service.id}>
                <CardHeader className="p-4 pb-2">
                  <Flex justify="between" align="start" gap="sm">
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    {service.price && <p className="font-semibold">${service.price}</p>}
                  </Flex>
                  {service.category_name && (
                    <Badge variant="secondary" className="w-fit">
                      {service.category_name}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <Stack gap="sm">
                    {service.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {service.description}
                      </p>
                    )}
                    {service.duration_minutes && (
                      <p className="text-sm text-muted-foreground">
                        <Briefcase className="inline h-3 w-3 mr-1" />
                        {service.duration_minutes} minutes
                      </p>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Box>
      )}

      {/* Book Appointment CTA */}
      {profile.salon_id && (
        <Card className="bg-primary/5">
          <CardHeader className="p-6 pb-2">
            <CardTitle>Book an Appointment</CardTitle>
            <CardDescription>
              Schedule a session with {profile.title || 'this staff member'}
            </CardDescription>
          </CardHeader>
          <CardFooter className="p-6 pt-0 justify-end">
            <Link href={`/customer/book/${profile.salon_id}?staff=${profile.id}`}>
              <Button>Book Now</Button>
            </Link>
          </CardFooter>
        </Card>
      )}
    </Stack>
  )
}

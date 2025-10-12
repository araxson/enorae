import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Stack, Flex, Box, Grid } from '@/components/layout'
import { H2, H3, P, Muted } from '@/components/ui/typography'
import { Mail, Star, Briefcase } from 'lucide-react'
import type { StaffProfile } from '../api/queries'

interface StaffProfileDetailProps {
  profile: StaffProfile
}

export function StaffProfileDetail({ profile }: StaffProfileDetailProps) {
  return (
    <Stack gap="xl">
      {/* Profile Header */}
      <Card className="p-6">
        <Stack gap="md">
          <Flex justify="between" align="start">
            <Box>
              <H2>{profile.title || 'Staff Member'}</H2>
              {profile.bio && (
                <P className="mt-2 text-muted-foreground">{profile.bio}</P>
              )}
            </Box>
            {profile.average_rating && (
              <Flex gap="xs" align="center">
                <Star className="h-5 w-5 fill-primary text-primary" />
                <P className="font-semibold">{profile.average_rating.toFixed(1)}</P>
                <Muted className="text-sm">({profile.review_count || 0} reviews)</Muted>
              </Flex>
            )}
          </Flex>

          {profile.email && (
            <Flex gap="sm" align="center">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <P className="text-sm">{profile.email}</P>
            </Flex>
          )}

          {profile.specialties && profile.specialties.length > 0 && (
            <Box>
              <Muted className="text-xs mb-2">Specialties</Muted>
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
              <Muted className="text-xs mb-2">Certifications</Muted>
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
      </Card>

      {/* Services Offered */}
      {profile.services && profile.services.length > 0 && (
        <Box>
          <H3 className="mb-4">Services Offered</H3>
          <Grid cols={{ base: 1, md: 2 }} gap="md">
            {profile.services.map((service) => (
              <Card key={service.id} className="p-4">
                <Stack gap="sm">
                  <Flex justify="between" align="start">
                    <H3 className="text-lg">{service.name}</H3>
                    {service.price && (
                      <P className="font-semibold">${service.price}</P>
                    )}
                  </Flex>

                  {service.description && (
                    <P className="text-sm text-muted-foreground line-clamp-2">
                      {service.description}
                    </P>
                  )}

                  {service.duration_minutes && (
                    <Muted className="text-sm">
                      <Briefcase className="inline h-3 w-3 mr-1" />
                      {service.duration_minutes} minutes
                    </Muted>
                  )}

                  {service.category_name && (
                    <Badge variant="secondary" className="w-fit">
                      {service.category_name}
                    </Badge>
                  )}
                </Stack>
              </Card>
            ))}
          </Grid>
        </Box>
      )}

      {/* Book Appointment CTA */}
      {profile.salon_id && (
        <Card className="p-6 bg-primary/5">
          <Flex justify="between" align="center">
            <Box>
              <H3>Book an Appointment</H3>
              <P className="text-muted-foreground">
                Schedule a session with {profile.title || 'this staff member'}
              </P>
            </Box>
            <Link href={`/customer/book/${profile.salon_id}?staff=${profile.id}`}>
              <Button>Book Now</Button>
            </Link>
          </Flex>
        </Card>
      )}
    </Stack>
  )
}

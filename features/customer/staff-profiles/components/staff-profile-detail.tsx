import Link from 'next/link'
import { Card } from '@/components/ui/card'
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
      <Card className="p-6">
        <Stack gap="md">
          <Flex justify="between" align="start">
            <Box>
              <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">{profile.title || 'Staff Member'}</h2>
              {profile.bio && (
                <p className="leading-7 mt-2 text-muted-foreground">{profile.bio}</p>
              )}
            </Box>
            {profile.average_rating && (
              <Flex gap="xs" align="center">
                <Star className="h-5 w-5 fill-primary text-primary" />
                <p className="leading-7 font-semibold">{profile.average_rating.toFixed(1)}</p>
                <p className="text-sm text-muted-foreground text-sm">({profile.review_count || 0} reviews)</p>
              </Flex>
            )}
          </Flex>

          {profile.email && (
            <Flex gap="sm" align="center">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <p className="leading-7 text-sm">{profile.email}</p>
            </Flex>
          )}

          {profile.specialties && profile.specialties.length > 0 && (
            <Box>
              <p className="text-sm text-muted-foreground text-xs mb-2">Specialties</p>
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
              <p className="text-sm text-muted-foreground text-xs mb-2">Certifications</p>
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
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-4">Services Offered</h3>
          <Grid cols={{ base: 1, md: 2 }} gap="md">
            {profile.services.map((service) => (
              <Card key={service.id} className="p-4">
                <Stack gap="sm">
                  <Flex justify="between" align="start">
                    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-lg">{service.name}</h3>
                    {service.price && (
                      <p className="leading-7 font-semibold">${service.price}</p>
                    )}
                  </Flex>

                  {service.description && (
                    <p className="leading-7 text-sm text-muted-foreground line-clamp-2">
                      {service.description}
                    </p>
                  )}

                  {service.duration_minutes && (
                    <p className="text-sm text-muted-foreground text-sm">
                      <Briefcase className="inline h-3 w-3 mr-1" />
                      {service.duration_minutes} minutes
                    </p>
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
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Book an Appointment</h3>
              <p className="leading-7 text-muted-foreground">
                Schedule a session with {profile.title || 'this staff member'}
              </p>
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

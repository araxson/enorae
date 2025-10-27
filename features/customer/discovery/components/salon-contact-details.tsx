import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { Phone, Mail, Globe } from 'lucide-react'
import type { Database } from '@/lib/types/database.types'

type SalonContactDetails = Database['public']['Views']['salons_view']['Row']

interface SalonContactDetailsProps {
  contactDetails: SalonContactDetails
}

export function SalonContactDetails({ contactDetails }: SalonContactDetailsProps) {
  const contactMethods = [
    {
      icon: Phone,
      label: 'Phone',
      value: contactDetails['primary_phone'],
      action: contactDetails['primary_phone'] && (
        <Button size="sm" variant="outline" asChild>
          <a href={`tel:${contactDetails['primary_phone']}`}>Call</a>
        </Button>
      ),
    },
    {
      icon: Mail,
      label: 'Email',
      value: contactDetails['primary_email'],
      action: contactDetails['primary_email'] && (
        <Button size="sm" variant="outline" asChild>
          <a href={`mailto:${contactDetails['primary_email']}`}>Email</a>
        </Button>
      ),
    },
    {
      icon: Globe,
      label: 'Website',
      value: contactDetails['website_url'] ? 'Visit website' : null,
      action: contactDetails['website_url'] && (
        <Button size="sm" variant="outline" asChild>
          <a href={contactDetails['website_url']} target="_blank" rel="noopener noreferrer">
            Visit
          </a>
        </Button>
      ),
    },
  ].filter((method) => method.value)

  if (contactMethods.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>No contact information available</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
        <CardDescription>Reach the salon using the channels below.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            {contactMethods.map((method) => {
              const Icon = method.icon
              return (
                <TableRow key={method.label}>
                  <TableCell className="w-12">
                    <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  </TableCell>
                  <TableCell className="font-medium">{method.label}</TableCell>
                  <TableCell className="text-muted-foreground">{method.value}</TableCell>
                  <TableCell className="text-right">{method.action}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

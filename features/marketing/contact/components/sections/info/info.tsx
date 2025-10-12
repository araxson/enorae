import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { P } from '@/components/ui/typography'
import { Mail, MapPin, Phone } from 'lucide-react'
import { infoData } from './info.data'

export function Info() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{infoData.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <div className="flex gap-3">
            <Mail className="h-5 w-5 text-primary" />
            <div>
              <P className="font-medium text-foreground">General inquiries</P>
              <p>{infoData.email}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Phone className="h-5 w-5 text-primary" />
            <div>
              <P className="font-medium text-foreground">Phone</P>
              <p>{infoData.phone}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <MapPin className="h-5 w-5 text-primary" />
            <div>
              <P className="font-medium text-foreground">HQ address</P>
              <p>{infoData.address}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Support hours</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          {infoData.supportHours.map(({ label, value }) => (
            <div key={label} className="flex justify-between">
              <span>{label}</span>
              <span>{value}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

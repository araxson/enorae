import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, MapPin, Phone } from 'lucide-react'
import { infoData } from './info.data'

export function Info() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{infoData.title}</CardTitle>
          <CardDescription>
            Contact our team directly using the details below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Mail className="h-5 w-5 text-primary" />
            <div>
              <p>General inquiries</p>
              <p className="text-muted-foreground">{infoData.email}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Phone className="h-5 w-5 text-primary" />
            <div>
              <p>Phone</p>
              <p className="text-muted-foreground">{infoData.phone}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <MapPin className="h-5 w-5 text-primary" />
            <div>
              <p>HQ address</p>
              <p className="text-muted-foreground">{infoData.address}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Support hours</CardTitle>
          <CardDescription>
            Availability window for customer assistance.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {infoData.supportHours.map(({ label, value }) => (
            <div key={label} className="flex justify-between text-muted-foreground">
              <span>{label}</span>
              <span>{value}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

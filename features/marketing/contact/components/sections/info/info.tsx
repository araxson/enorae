import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
              <p className="leading-7 font-medium text-foreground">General inquiries</p>
              <p>{infoData.email}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Phone className="h-5 w-5 text-primary" />
            <div>
              <p className="leading-7 font-medium text-foreground">Phone</p>
              <p>{infoData.phone}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <MapPin className="h-5 w-5 text-primary" />
            <div>
              <p className="leading-7 font-medium text-foreground">HQ address</p>
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

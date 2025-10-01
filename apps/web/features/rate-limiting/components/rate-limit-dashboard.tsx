import { Shield, Activity } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@enorae/ui'
import { Progress } from '@enorae/ui'
import { getRateLimits } from '../dal/queries'

export async function RateLimitDashboard() {
  const limits = await getRateLimits()

  const endpoints = [
    { name: 'API Calls', current: 450, limit: 1000, path: '/api/*' },
    { name: 'Bookings', current: 8, limit: 50, path: '/api/bookings' },
    { name: 'Messages', current: 25, limit: 100, path: '/api/messages' },
    { name: 'Reviews', current: 2, limit: 10, path: '/api/reviews' },
  ]

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Rate Limiting Overview
          </CardTitle>
          <CardDescription>
            API usage and rate limit status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {endpoints.map((endpoint) => (
              <div key={endpoint.path} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{endpoint.name}</span>
                  <span className="text-muted-foreground">
                    {endpoint.current} / {endpoint.limit}
                  </span>
                </div>
                <Progress
                  value={(endpoint.current / endpoint.limit) * 100}
                  className={
                    endpoint.current / endpoint.limit > 0.8
                      ? 'bg-destructive/20'
                      : ''
                  }
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
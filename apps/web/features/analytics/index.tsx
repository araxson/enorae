import { Card, CardContent, CardDescription, CardHeader, CardTitle, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@enorae/ui'
import { getAnalyticsData } from './dal/analytics.queries'
import { TrendingUp, TrendingDown, Users, DollarSign, Calendar, Clock, Star, Activity } from 'lucide-react'

export async function AnalyticsDashboard() {
  const analytics = await getAnalyticsData()

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Track your salon's performance and insights</p>
        </div>
        <Select defaultValue="last30days">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="last7days">Last 7 days</SelectItem>
            <SelectItem value="last30days">Last 30 days</SelectItem>
            <SelectItem value="last90days">Last 90 days</SelectItem>
            <SelectItem value="thisYear">This year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analytics.revenue.total.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {analytics.revenue.growth > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span className={analytics.revenue.growth > 0 ? 'text-green-500' : 'text-red-500'}>
                {Math.abs(analytics.revenue.growth)}%
              </span>
              from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.appointments.total}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.appointments.completed} completed, {analytics.appointments.cancelled} cancelled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.customers.new}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.customers.returning} returning customers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.rating.average.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              Based on {analytics.rating.total} reviews
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Service</CardTitle>
            <CardDescription>Top performing services by revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topServices.map((service, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <div>
                      <p className="text-sm font-medium">{service.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {service.bookings} bookings
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">${service.revenue.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">
                      {((service.revenue / analytics.revenue.total) * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Staff Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Staff Performance</CardTitle>
            <CardDescription>Appointments and revenue by staff member</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.staffPerformance.map((staff, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium">{staff.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{staff.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {staff.appointments} appointments
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">${staff.revenue.toFixed(2)}</p>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span className="text-xs">{staff.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Busy Hours */}
        <Card>
          <CardHeader>
            <CardTitle>Peak Hours</CardTitle>
            <CardDescription>Busiest times for appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.peakHours.map((hour, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">{hour.time}</span>
                      <span className="text-sm font-medium">{hour.appointments}</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(hour.appointments / Math.max(...analytics.peakHours.map(h => h.appointments))) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Customer Retention */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Insights</CardTitle>
            <CardDescription>Customer behavior and retention metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm">Retention Rate</span>
                <span className="text-sm font-medium">{analytics.retention.rate}%</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm">Average Visits/Customer</span>
                <span className="text-sm font-medium">{analytics.retention.avgVisits}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm">Customer Lifetime Value</span>
                <span className="text-sm font-medium">${analytics.retention.lifetimeValue.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm">Referral Rate</span>
                <span className="text-sm font-medium">{analytics.retention.referralRate}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trends Chart Placeholder */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Revenue Trends</CardTitle>
          <CardDescription>Revenue performance over the selected period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-muted/50 rounded-lg">
            <div className="text-center">
              <Activity className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Chart visualization would go here</p>
              <p className="text-xs text-muted-foreground mt-1">Integrate with a charting library like Recharts</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
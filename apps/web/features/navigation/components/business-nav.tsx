import { Button } from '@enorae/ui'
import { UserMenu } from './user-menu'

export async function BusinessNav() {
  return (
    <nav className="border-b bg-muted/50">
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <a href="/business" className="text-2xl font-bold">
              Enorae Business
            </a>
            <div className="flex gap-4">
              <Button variant="ghost" asChild>
                <a href="/business">Dashboard</a>
              </Button>
              <Button variant="ghost" asChild>
                <a href="/business/appointments">Appointments</a>
              </Button>
              <Button variant="ghost" asChild>
                <a href="/business/staff">Staff</a>
              </Button>
              <Button variant="ghost" asChild>
                <a href="/business/services">Services</a>
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <a href="/">Customer Site</a>
            </Button>
            <UserMenu />
          </div>
        </div>
      </div>
    </nav>
  )
}
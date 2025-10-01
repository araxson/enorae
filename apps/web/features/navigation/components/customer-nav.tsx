import { Button } from '@enorae/ui'
import { UserMenu } from './user-menu'

export async function CustomerNav() {
  return (
    <nav className="border-b">
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <a href="/" className="text-2xl font-bold">
              Enorae
            </a>
            <div className="flex gap-4">
              <Button variant="ghost" asChild>
                <a href="/salons">Browse Salons</a>
              </Button>
              <Button variant="ghost" asChild>
                <a href="/profile">My Appointments</a>
              </Button>
            </div>
          </div>
          <UserMenu />
        </div>
      </div>
    </nav>
  )
}
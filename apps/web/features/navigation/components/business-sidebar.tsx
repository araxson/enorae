import { LayoutDashboard, Calendar, Users, Briefcase, Settings, Menu } from 'lucide-react'
import { Button } from '@enorae/ui'
import { UserMenu } from './user-menu'

const menuItems = [
  {
    title: 'Dashboard',
    href: '/business',
    icon: LayoutDashboard,
  },
  {
    title: 'Appointments',
    href: '/business/appointments',
    icon: Calendar,
  },
  {
    title: 'Staff',
    href: '/business/staff',
    icon: Users,
  },
  {
    title: 'Services',
    href: '/business/services',
    icon: Briefcase,
  },
  {
    title: 'Settings',
    href: '/business/settings',
    icon: Settings,
  },
]

export async function BusinessSidebar() {
  return (
    <aside className="w-64 border-r bg-muted/40 flex flex-col h-screen">
      {/* Logo/Brand */}
      <div className="p-6 border-b">
        <a href="/business" className="text-xl font-bold">
          Enorae Business
        </a>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <Button
            key={item.href}
            variant="ghost"
            className="w-full justify-start gap-3"
            asChild
          >
            <a href={item.href}>
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </a>
          </Button>
        ))}
      </nav>

      {/* Footer with User Menu */}
      <div className="p-4 border-t">
        <Button variant="ghost" size="sm" asChild className="w-full justify-start gap-2">
          <a href="/">
            <Menu className="h-4 w-4" />
            Customer Site
          </a>
        </Button>
        <div className="mt-2">
          <UserMenu />
        </div>
      </div>
    </aside>
  )
}
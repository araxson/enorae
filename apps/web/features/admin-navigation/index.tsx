import { Button } from '@enorae/ui'
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Calendar,
  Settings,
  Shield,
  Activity,
  FileText,
  LogOut,
  ChevronLeft
} from 'lucide-react'

const menuItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Salons',
    href: '/admin/salons',
    icon: Briefcase,
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'Appointments',
    href: '/admin/appointments',
    icon: Calendar,
  },
  {
    title: 'Reports',
    href: '/admin/reports',
    icon: FileText,
  },
  {
    title: 'System Health',
    href: '/admin/health',
    icon: Activity,
  },
  {
    title: 'Security',
    href: '/admin/security',
    icon: Shield,
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
]

export async function AdminSidebar() {
  return (
    <aside className="w-64 border-r bg-muted/40 flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Admin Portal</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.href}
              variant="ghost"
              className="w-full justify-start gap-3"
              asChild
            >
              <a href={item.href}>
                <Icon className="h-4 w-4" />
                <span>{item.title}</span>
              </a>
            </Button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t space-y-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2"
          asChild
        >
          <a href="/business">
            <ChevronLeft className="h-4 w-4" />
            Back to Business Portal
          </a>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-destructive hover:text-destructive"
          asChild
        >
          <a href="/logout">
            <LogOut className="h-4 w-4" />
            Logout
          </a>
        </Button>
      </div>
    </aside>
  )
}
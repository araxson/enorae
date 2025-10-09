import {
  LayoutDashboard,
  Calendar,
  Users,
  Scissors,
  Package,
  Clock,
  MapPin,
  Settings,
  BarChart3,
  Ban,
  Building2,
  Home,
  Heart,
  Store,
  MessageSquare,
  Star,
  DollarSign,
  CalendarOff,
  LifeBuoy,
  HelpCircle,
} from 'lucide-react'

const NAV_ICONS = {
  layoutDashboard: LayoutDashboard,
  calendar: Calendar,
  users: Users,
  scissors: Scissors,
  package: Package,
  clock: Clock,
  mapPin: MapPin,
  settings: Settings,
  barChart3: BarChart3,
  ban: Ban,
  building2: Building2,
  home: Home,
  heart: Heart,
  store: Store,
  messageSquare: MessageSquare,
  star: Star,
  dollarSign: DollarSign,
  calendarOff: CalendarOff,
  lifeBuoy: LifeBuoy,
  helpCircle: HelpCircle,
} as const

export type IconName = keyof typeof NAV_ICONS

export function getNavIcon(name: IconName) {
  return NAV_ICONS[name]
}

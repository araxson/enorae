export interface RoleTemplate {
  id: string
  label: string
  description: string
  role: string
  permissions: string[]
}

export const ROLE_PERMISSION_TEMPLATES: RoleTemplate[] = [
  {
    id: 'salon-manager',
    label: 'Salon Manager',
    description: 'Full salon management access including staff.',
    role: 'salon_manager',
    permissions: [
      'appointments.manage',
      'staff.manage',
      'finance.view',
      'reports.view',
    ],
  },
  {
    id: 'front-desk',
    label: 'Front Desk',
    description: 'Bookings and customer support without financial access.',
    role: 'staff',
    permissions: ['appointments.manage', 'customers.view', 'messages.manage'],
  },
  {
    id: 'auditor',
    label: 'Platform Auditor',
    description: 'Read-only access to compliance and financial reports.',
    role: 'platform_admin',
    permissions: ['reports.view', 'compliance.view'],
  },
]

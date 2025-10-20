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
    description: 'Full salon management access including staff and inventory.',
    role: 'salon_manager',
    permissions: [
      'appointments.manage',
      'inventory.manage',
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
    id: 'inventory-specialist',
    label: 'Inventory Specialist',
    description: 'Can adjust stock levels and manage suppliers.',
    role: 'staff',
    permissions: ['inventory.manage', 'suppliers.view'],
  },
  {
    id: 'auditor',
    label: 'Platform Auditor',
    description: 'Read-only access to compliance and financial reports.',
    role: 'platform_admin',
    permissions: ['reports.view', 'compliance.view'],
  },
]

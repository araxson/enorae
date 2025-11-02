// Feature types
export type StaffMember = {
  id: string
  name: string
  email?: string
  role?: string
}

export type StaffFilters = {
  search?: string
  role?: string
  status?: string
}

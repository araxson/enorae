export type UserActionResult = { success?: boolean; error?: string }

export type UserActionsMenuProps = {
  userId: string
  userName: string
  isActive: boolean
  onSuspend: (formData: FormData) => Promise<UserActionResult>
  onReactivate: (formData: FormData) => Promise<UserActionResult>
  onTerminateSessions: (formData: FormData) => Promise<UserActionResult>
  onDelete?: (formData: FormData) => Promise<UserActionResult>
  onLoadingChange?: (loading: boolean, userId: string) => void
}

import 'server-only'

export const getFormValue = (formData: FormData, key: string): string | null => {
  const value = formData.get(key)
  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed.length > 0 ? trimmed : null
  }
  return null
}

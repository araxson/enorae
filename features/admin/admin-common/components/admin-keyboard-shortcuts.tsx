'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'

export function AdminKeyboardShortcuts() {
  const router = useRouter()

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()
      const hasMeta = event.metaKey || event.ctrlKey

      if (!hasMeta || !event.shiftKey) return

      if (key === 'r') {
        event.preventDefault()
        router.refresh()
        toast.message('Refreshing admin data…')
        return
      }

      if (key === 'f') {
        event.preventDefault()
        window.dispatchEvent(new CustomEvent('admin:toggleFilters'))
        toast.message('Toggling filters panel')
        return
      }

      if (key === 'c') {
        event.preventDefault()
        window.dispatchEvent(new CustomEvent('admin:clearFilters'))
        toast.success('Cleared all active filters')
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [router])

  return null
}

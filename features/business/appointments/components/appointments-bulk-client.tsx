'use client'

import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { BulkActionsMenu } from './bulk-actions-menu'

interface AppointmentsBulkClientProps {
  children: React.ReactNode
  totalCount: number
}

export function AppointmentsBulkClient({ children, totalCount }: AppointmentsBulkClientProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked)
    // In a real implementation, you would get all IDs and set them
    // For now, we'll just clear on uncheck
    if (!checked) {
      setSelectedIds([])
    }
  }

  const handleToggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const clearSelection = () => {
    setSelectedIds([])
    setSelectAll(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Checkbox
            checked={selectAll}
            onCheckedChange={handleSelectAll}
            id="select-all"
          />
          <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
            Select all ({totalCount})
          </label>
        </div>
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2">
            <BulkActionsMenu
              selectedIds={selectedIds}
              onClearSelection={clearSelection}
            />
            <Button variant="ghost" size="sm" onClick={clearSelection}>
              Clear
            </Button>
          </div>
        )}
      </div>
      {children}
    </div>
  )
}

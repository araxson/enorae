export type InventoryProductOption = {
  id: string
  name: string | null
  sku: string | null
}

export type InventoryLocationOption = {
  id: string
  name: string | null
}

export type MovementType =
  | 'in'
  | 'out'
  | 'adjustment'
  | 'transfer'
  | 'return'
  | 'damage'
  | 'theft'
  | 'other'

export type CreateMovementDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  products: InventoryProductOption[]
  locations: InventoryLocationOption[]
}

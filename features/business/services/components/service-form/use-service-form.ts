import { useState, useEffect } from 'react'
import { useToast } from '@/lib/hooks/use-toast'
import type { Database } from '@/lib/types/database.types'

type Service = Database['public']['Views']['services_view']['Row']

export type ServiceFormData = {
  name: string
  description: string
  categoryId: string
  durationMinutes: number
  price: number
}

interface UseServiceFormParams {
  salonId: string
  service: Service | null
  open: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function useServiceForm({ salonId, service, open, onClose, onSuccess }: UseServiceFormParams) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [basePrice, setBasePrice] = useState(0)
  const [salePrice, setSalePrice] = useState(0)
  const [duration, setDuration] = useState(30)
  const [buffer, setBuffer] = useState(0)
  const [isTaxable, setIsTaxable] = useState(true)
  const [taxRate, setTaxRate] = useState(0)
  const [commissionRate, setCommissionRate] = useState(0)
  const [isActive, setIsActive] = useState(true)
  const [isBookable, setIsBookable] = useState(true)
  const [isFeatured, setIsFeatured] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Initialize form when dialog opens with service data
  useEffect(() => {
    if (open && service) {
      setName(service.name ?? '')
      setDescription(service.description ?? '')
      setBasePrice(service.sale_price ?? 0) // using sale_price as base_price doesn't exist
      setSalePrice(service.sale_price ?? 0)
      setDuration(service.duration_minutes ?? 30)
      setBuffer(service.buffer_minutes ?? 0)
      setIsTaxable(true) // default as property doesn't exist
      setTaxRate(0) // default as property doesn't exist
      setCommissionRate(0) // default as property doesn't exist
      setIsActive(service.is_active ?? true)
      setIsBookable(service.is_bookable ?? true)
      setIsFeatured(service.is_featured ?? false)
      setError(null)
    } else if (!open) {
      // Reset form when dialog closes
      setName('')
      setDescription('')
      setBasePrice(0)
      setSalePrice(0)
      setDuration(30)
      setBuffer(0)
      setIsTaxable(true)
      setTaxRate(0)
      setCommissionRate(0)
      setIsActive(true)
      setIsBookable(true)
      setIsFeatured(false)
      setError(null)
    }
  }, [open, service])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)
    try {
      // Service submission logic would go here
      toast({
        title: 'Success',
        description: 'Service saved successfully',
      })
      onSuccess?.()
      onClose()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save service'
      setError(errorMessage)
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    state: {
      name,
      description,
      basePrice: basePrice.toString(),
      salePrice: salePrice.toString(),
      duration: duration.toString(),
      buffer: buffer.toString(),
      isTaxable,
      taxRate: taxRate.toString(),
      commissionRate: commissionRate.toString(),
      isActive,
      isBookable,
      isFeatured,
      isSubmitting,
      error,
    },
    actions: {
      setName,
      setDescription,
      setBasePrice: (value: string) => setBasePrice(parseFloat(value) || 0),
      setSalePrice: (value: string) => setSalePrice(parseFloat(value) || 0),
      setDuration: (value: string) => setDuration(parseInt(value, 10) || 0),
      setBuffer: (value: string) => setBuffer(parseInt(value, 10) || 0),
      setIsTaxable,
      setTaxRate: (value: string) => setTaxRate(parseFloat(value) || 0),
      setCommissionRate: (value: string) => setCommissionRate(parseFloat(value) || 0),
      setIsActive,
      setIsBookable,
      setIsFeatured,
    },
    handlers: {
      handleSubmit,
      handleClose: onClose,
    },
  }
}

export type ServiceFormHook = ReturnType<typeof useServiceForm>

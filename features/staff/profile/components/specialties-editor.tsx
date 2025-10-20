'use client'
import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Stack, Flex } from '@/components/layout'
import { updateStaffMetadata } from '../api/mutations'

interface SpecialtiesEditorProps {
  initialSpecialties?: string[]
}

export function SpecialtiesEditor({ initialSpecialties = [] }: SpecialtiesEditorProps) {
  const [specialties, setSpecialties] = useState<string[]>(initialSpecialties)
  const [newSpecialty, setNewSpecialty] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAdd = () => {
    if (!newSpecialty.trim()) return
    if (specialties.includes(newSpecialty.trim())) {
      setError('Specialty already added')
      return
    }

    const updated = [...specialties, newSpecialty.trim()]
    setSpecialties(updated)
    setNewSpecialty('')
    saveSpecialties(updated)
  }

  const handleRemove = (specialty: string) => {
    const updated = specialties.filter((s) => s !== specialty)
    setSpecialties(updated)
    saveSpecialties(updated)
  }

  const saveSpecialties = async (specs: string[]) => {
    try {
      setIsSaving(true)
      setError(null)

      const result = await updateStaffMetadata({ specialties: specs })

      if (!result.success) {
        setError(result.error)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save specialties')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className="p-6">
      <Stack gap="md">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Specialties & Skills</h3>

        <Flex gap="sm">
          <Input
            placeholder="Add specialty..."
            value={newSpecialty}
            onChange={(e) => setNewSpecialty(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAdd()
              }
            }}
            disabled={isSaving}
          />
          <Button
            type="button"
            onClick={handleAdd}
            disabled={!newSpecialty.trim() || isSaving}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </Flex>

        {specialties.length > 0 ? (
          <Flex wrap="wrap" gap="sm">
            {specialties.map((specialty) => (
              <Badge key={specialty} variant="outline">
                {specialty}
                <button
                  type="button"
                  onClick={() => handleRemove(specialty)}
                  className="ml-2 hover:text-destructive"
                  disabled={isSaving}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </Flex>
        ) : (
          <p className="text-sm text-muted-foreground">No specialties added yet</p>
        )}

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </Stack>
    </Card>
  )
}

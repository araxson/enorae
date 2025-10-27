'use client'
import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { updateStaffMetadata } from '@/features/staff/profile/api/mutations'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'

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
    <Card>
      <CardHeader>
        <CardTitle>Specialties & Skills</CardTitle>
        <CardDescription>Highlight the services you excel at.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <InputGroup>
            <InputGroupInput
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
            <InputGroupAddon align="inline-end">
              <Button type="button" onClick={handleAdd} disabled={!newSpecialty.trim() || isSaving} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </InputGroupAddon>
          </InputGroup>

          {specialties.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {specialties.map((specialty) => (
                <Badge key={specialty} variant="outline">
                  {specialty}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(specialty)}
                    disabled={isSaving}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          ) : (
            <CardDescription>No specialties added yet</CardDescription>
          )}

          {error ? (
            <Alert variant="destructive">
              <AlertTitle>Unable to save specialties</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}

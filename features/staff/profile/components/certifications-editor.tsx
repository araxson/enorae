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
import {
  Item,
  ItemContent,
  ItemGroup,
} from '@/components/ui/item'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'

interface CertificationsEditorProps {
  initialCertifications?: string[]
}

export function CertificationsEditor({ initialCertifications = [] }: CertificationsEditorProps) {
  const [certifications, setCertifications] = useState<string[]>(initialCertifications)
  const [newCert, setNewCert] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAdd = () => {
    if (!newCert.trim()) return
    if (certifications.includes(newCert.trim())) {
      setError('Certification already added')
      return
    }

    const updated = [...certifications, newCert.trim()]
    setCertifications(updated)
    setNewCert('')
    saveCertifications(updated)
  }

  const handleRemove = (cert: string) => {
    const updated = certifications.filter((c) => c !== cert)
    setCertifications(updated)
    saveCertifications(updated)
  }

  const saveCertifications = async (certs: string[]) => {
    try {
      setIsSaving(true)
      setError(null)

      const result = await updateStaffMetadata({ certifications: certs })

      if (!result.success) {
        setError(result.error)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save certifications')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <ItemGroup>
          <Item variant="muted" size="sm">
            <ItemContent>
              <CardTitle>Certifications & Licenses</CardTitle>
              <CardDescription>Keep your credentials current.</CardDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <InputGroup>
            <InputGroupInput
              placeholder="Add certification..."
              value={newCert}
              onChange={(e) => setNewCert(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAdd()
                }
              }}
              disabled={isSaving}
            />
            <InputGroupAddon align="inline-end">
              <Button type="button" onClick={handleAdd} disabled={!newCert.trim() || isSaving} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </InputGroupAddon>
          </InputGroup>

          {certifications.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {certifications.map((cert) => (
                <Badge key={cert} variant="secondary">
                  {cert}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(cert)}
                    disabled={isSaving}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>No certifications yet</EmptyTitle>
                <EmptyDescription>Add credentials to build trust with clients.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}

          {error ? (
            <Alert variant="destructive">
              <AlertTitle>Unable to save certifications</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}

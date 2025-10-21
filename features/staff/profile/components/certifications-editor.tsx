'use client'
import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { updateStaffMetadata } from '../api/mutations'

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
    <Card className="p-6">
      <div className="flex flex-col gap-4">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Certifications & Licenses</h3>

        <div className="flex gap-3">
          <Input
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
          <Button
            type="button"
            onClick={handleAdd}
            disabled={!newCert.trim() || isSaving}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {certifications.length > 0 ? (
          <div className="flex gap-3 flex-wrap">
            {certifications.map((cert) => (
              <Badge key={cert} variant="secondary">
                {cert}
                <button
                  type="button"
                  onClick={() => handleRemove(cert)}
                  className="ml-2 hover:text-destructive"
                  disabled={isSaving}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No certifications added yet</p>
        )}

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>
    </Card>
  )
}

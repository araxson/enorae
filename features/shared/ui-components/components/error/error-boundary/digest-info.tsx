'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Check, Copy } from 'lucide-react'
import { ButtonGroup } from '@/components/ui/button-group'

export function DigestInfo({ digest, details }: { digest: string; details: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(details)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Alert>
      <AlertDescription>
        <div className="flex items-center gap-6">
          <p className="font-mono">Error ID: {digest}</p>
          <ButtonGroup>
            <Button variant="ghost" size="sm" onClick={handleCopy} className="h-7 gap-1">
              {copied ? (
                <>
                  <Check className="h-3 w-3" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  Copy
                </>
              )}
            </Button>
          </ButtonGroup>
        </div>
      </AlertDescription>
    </Alert>
  )
}

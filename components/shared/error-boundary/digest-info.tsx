'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Check, Copy } from 'lucide-react'

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
        <div className="flex gap-6">
          <p className="text-sm text-muted-foreground font-mono text-xs">Error ID: {digest}</p>
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
        </div>
      </AlertDescription>
    </Alert>
  )
}

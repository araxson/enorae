import { Facebook, Instagram, Twitter } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { cn } from '@/lib/utils'

interface SocialLinksProps {
  facebookUrl?: string | null
  instagramUrl?: string | null
  twitterUrl?: string | null
  tiktokUrl?: string | null
  className?: string
  size?: 'sm' | 'default' | 'lg'
}

export function SocialLinks({
  facebookUrl,
  instagramUrl,
  twitterUrl,
  tiktokUrl,
  className,
  size = 'default',
}: SocialLinksProps) {
  const hasSocial = facebookUrl || instagramUrl || twitterUrl || tiktokUrl

  if (!hasSocial) {
    return null
  }

  return (
    <ButtonGroup aria-label="Social media links">
      {instagramUrl && (
        <Button variant="outline" size={size === 'sm' ? 'icon' : 'default'} asChild>
          <a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <Instagram className="size-4" />
            {size !== 'sm' && <span className="ml-2">Instagram</span>}
          </a>
        </Button>
      )}
      {facebookUrl && (
        <Button variant="outline" size={size === 'sm' ? 'icon' : 'default'} asChild>
          <a href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <Facebook className="size-4" />
            {size !== 'sm' && <span className="ml-2">Facebook</span>}
          </a>
        </Button>
      )}
      {twitterUrl && (
        <Button variant="outline" size={size === 'sm' ? 'icon' : 'default'} asChild>
          <a href={twitterUrl} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <Twitter className="size-4" />
            {size !== 'sm' && <span className="ml-2">Twitter</span>}
          </a>
        </Button>
      )}
      {tiktokUrl && (
        <Button variant="outline" size={size === 'sm' ? 'icon' : 'default'} asChild>
          <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" aria-label="TikTok">
            <svg
              className="size-4"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
            </svg>
            {size !== 'sm' && <span className="ml-2">TikTok</span>}
          </a>
        </Button>
      )}
    </ButtonGroup>
  )
}

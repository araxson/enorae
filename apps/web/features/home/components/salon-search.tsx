'use client'

import { Button } from '@enorae/ui'
import { Search, MapPin } from 'lucide-react'

export function SalonSearch() {
  return (
    <section className="container mx-auto px-4 -mt-8 relative z-10">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-lg bg-card p-6 shadow-lg">
          <form className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search for salons or services..."
                  className="w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="City or ZIP code"
                  className="w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <Button type="submit">Search</Button>
          </form>
        </div>
      </div>
    </section>
  )
}
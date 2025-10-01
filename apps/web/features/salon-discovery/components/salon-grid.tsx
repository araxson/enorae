import Link from 'next/link'
import { Star, MapPin, Clock } from 'lucide-react'

type Salon = {
  id: string
  name: string
  slug: string
  description: string | null
  address: string | null
  city: string | null
  rating: number | null
  review_count: number | null
}

export function SalonGrid({ salons }: { salons: Salon[] }) {
  if (salons.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No salons found in your area.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {salons.map((salon) => (
        <Link
          key={salon.id}
          href={`/salons/${salon.slug}`}
          className="group block rounded-lg border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                {salon.name}
              </h3>
              {salon.rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{salon.rating}</span>
                </div>
              )}
            </div>

            {salon.description && (
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {salon.description}
              </p>
            )}

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {salon.address && salon.city && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{salon.city}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>Open Now</span>
              </div>
            </div>

            {salon.review_count && salon.review_count > 0 && (
              <p className="mt-3 text-xs text-muted-foreground">
                {salon.review_count} reviews
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  )
}
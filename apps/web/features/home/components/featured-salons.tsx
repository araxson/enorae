import { Star } from 'lucide-react'
import Link from 'next/link'

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

export function FeaturedSalons({ salons }: { salons: Salon[] }) {
  if (salons.length === 0) {
    return null
  }

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-foreground">Featured Salons</h2>
        <p className="mt-4 text-muted-foreground">
          Discover top-rated salons in your area
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {salons.map((salon) => (
          <Link
            key={salon.id}
            href={`/salons/${salon.slug}`}
            className="group rounded-lg border border-border bg-card p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
              {salon.name}
            </h3>
            {salon.description && (
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {salon.description}
              </p>
            )}
            {salon.address && salon.city && (
              <p className="mt-3 text-sm text-muted-foreground">
                {salon.address}, {salon.city}
              </p>
            )}
            {salon.rating && (
              <div className="mt-4 flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{salon.rating}</span>
                {salon.review_count && (
                  <span className="text-sm text-muted-foreground">
                    ({salon.review_count} reviews)
                  </span>
                )}
              </div>
            )}
          </Link>
        ))}
      </div>
    </section>
  )
}
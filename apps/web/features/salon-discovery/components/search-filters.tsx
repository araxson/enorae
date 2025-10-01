'use client'

export function SearchFilters() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-3">Services</h3>
        <div className="space-y-2">
          {['Haircut', 'Coloring', 'Styling', 'Nails', 'Spa', 'Makeup'].map((service) => (
            <label key={service} className="flex items-center gap-2">
              <input type="checkbox" className="rounded border-border" />
              <span className="text-sm">{service}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Price Range</h3>
        <div className="space-y-2">
          {['$', '$$', '$$$', '$$$$'].map((price) => (
            <label key={price} className="flex items-center gap-2">
              <input type="checkbox" className="rounded border-border" />
              <span className="text-sm">{price}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Rating</h3>
        <div className="space-y-2">
          {['4+ Stars', '3+ Stars', '2+ Stars'].map((rating) => (
            <label key={rating} className="flex items-center gap-2">
              <input type="radio" name="rating" className="rounded-full border-border" />
              <span className="text-sm">{rating}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
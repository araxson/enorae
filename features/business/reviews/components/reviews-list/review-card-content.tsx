'use client'

import { memo } from 'react'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import { Field, FieldContent, FieldLabel } from '@/components/ui/field'

const STAR_INDICES = [0, 1, 2, 3, 4]

interface ReviewCardContentProps {
  title: string | null
  comment: string | null
  serviceQualityRating: number | null
  cleanlinessRating: number | null
  valueRating: number | null
  response: string | null
  respondedByName: string | null
  responseDate: string | null
  formatDate: (date: string | null) => string
}

function ReviewCardContentComponent({
  title,
  comment,
  serviceQualityRating,
  cleanlinessRating,
  valueRating,
  response,
  respondedByName,
  responseDate,
  formatDate,
}: ReviewCardContentProps) {
  return (
    <ItemContent>
      <div className="flex flex-col gap-4">
        {title ? <p className="font-medium leading-7">{title}</p> : null}
        {comment ? <p className="text-sm leading-7">{comment}</p> : null}

        {serviceQualityRating || cleanlinessRating || valueRating ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {serviceQualityRating ? (
              <RatingItem label="Service Quality" rating={serviceQualityRating} />
            ) : null}
            {cleanlinessRating ? (
              <RatingItem label="Cleanliness" rating={cleanlinessRating} />
            ) : null}
            {valueRating ? <RatingItem label="Value" rating={valueRating} /> : null}
          </div>
        ) : null}

        {response ? (
          <ItemGroup>
            <Item variant="muted" className="flex-col gap-3">
              <ItemHeader>
                <div className="flex w-full items-center justify-between gap-4">
                  <div>
                    <ItemTitle>Response from salon</ItemTitle>
                    {respondedByName ? <ItemDescription>By {respondedByName}</ItemDescription> : null}
                  </div>
                  <ItemDescription>{formatDate(responseDate)}</ItemDescription>
                </div>
              </ItemHeader>
              <ItemContent>
                <ItemDescription>{response}</ItemDescription>
              </ItemContent>
            </Item>
          </ItemGroup>
        ) : null}
      </div>
    </ItemContent>
  )
}

export const ReviewCardContent = ReviewCardContentComponent

interface RatingItemProps {
  label: string
  rating: number | null
}

const RatingItem = memo(function RatingItem({ label, rating }: RatingItemProps) {
  const stars = rating || 0
  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <FieldContent>
        <div className="flex gap-1" role="img" aria-label={`${label}: ${stars} out of 5 stars`}>
          {STAR_INDICES.map((index) => (
            <StarIcon key={index} filled={index < stars} />
          ))}
        </div>
      </FieldContent>
    </Field>
  )
})

interface StarIconProps {
  filled: boolean
}

const StarIcon = memo(function StarIcon({ filled }: StarIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`size-4 ${filled ? 'fill-accent text-accent' : 'text-muted-foreground/30'}`}
      aria-hidden="true"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
})

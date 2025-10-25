'use server'

import { flagReview as flagReviewAction } from './mutations/flag-review.mutation'
import { unflagReview as unflagReviewAction } from './mutations/unflag-review.mutation'
import { respondToReview as respondToReviewAction } from './mutations/respond-to-review.mutation'
import { deleteReview as deleteReviewAction } from './mutations/delete-review.mutation'
import { featureReview as featureReviewAction } from './mutations/feature-review.mutation'
import { hideReview as hideReviewAction } from './mutations/hide-review.mutation'
import { approveReview as approveReviewAction } from './mutations/approve-review.mutation'
import { banReviewAuthor as banReviewAuthorAction } from './mutations/ban-review-author.mutation'

type ServerAction<T extends (...args: never[]) => Promise<unknown>> = (
  ...args: Parameters<T>
) => ReturnType<T>

function createServerActionProxy<T extends (...args: never[]) => Promise<unknown>>(
  action: T
): ServerAction<T> {
  return (...args) => action(...args)
}

export const flagReview = createServerActionProxy(flagReviewAction)
export const unflagReview = createServerActionProxy(unflagReviewAction)
export const respondToReview = createServerActionProxy(respondToReviewAction)
export const deleteReview = createServerActionProxy(deleteReviewAction)
export const featureReview = createServerActionProxy(featureReviewAction)
export const hideReview = createServerActionProxy(hideReviewAction)
export const approveReview = createServerActionProxy(approveReviewAction)
export const banReviewAuthor = createServerActionProxy(banReviewAuthorAction)

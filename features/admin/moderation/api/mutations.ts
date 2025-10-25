'use server'

import { flagReview as flagReviewAction } from './mutations/flag-review.mutation'
import { unflagReview as unflagReviewAction } from './mutations/unflag-review.mutation'
import { respondToReview as respondToReviewAction } from './mutations/respond-to-review.mutation'
import { deleteReview as deleteReviewAction } from './mutations/delete-review.mutation'
import { featureReview as featureReviewAction } from './mutations/feature-review.mutation'
import { hideReview as hideReviewAction } from './mutations/hide-review.mutation'
import { approveReview as approveReviewAction } from './mutations/approve-review.mutation'
import { banReviewAuthor as banReviewAuthorAction } from './mutations/ban-review-author.mutation'

export const flagReview = flagReviewAction
export const unflagReview = unflagReviewAction
export const respondToReview = respondToReviewAction
export const deleteReview = deleteReviewAction
export const featureReview = featureReviewAction
export const hideReview = hideReviewAction
export const approveReview = approveReviewAction
export const banReviewAuthor = banReviewAuthorAction

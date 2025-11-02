'use server'

import { flagReview as flagReviewAction } from './mutations/flag-review'
import { unflagReview as unflagReviewAction } from './mutations/unflag-review'
import { respondToReview as respondToReviewAction } from './mutations/respond-to-review'
import { deleteReview as deleteReviewAction } from './mutations/delete-review'
import { featureReview as featureReviewAction } from './mutations/feature-review'
import { hideReview as hideReviewAction } from './mutations/hide-review'
import { approveReview as approveReviewAction } from './mutations/approve-review'
import { banReviewAuthor as banReviewAuthorAction } from './mutations/ban-review-author'

export const flagReview = flagReviewAction
export const unflagReview = unflagReviewAction
export const respondToReview = respondToReviewAction
export const deleteReview = deleteReviewAction
export const featureReview = featureReviewAction
export const hideReview = hideReviewAction
export const approveReview = approveReviewAction
export const banReviewAuthor = banReviewAuthorAction

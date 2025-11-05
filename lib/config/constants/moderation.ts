/**
 * Review and Moderation Configuration
 *
 * Thresholds and scoring for review quality and moderation.
 */

/**
 * Review and Moderation Scoring Thresholds
 */
export const MODERATION_THRESHOLDS = {
  /** Base reputation score for new reviewers with no history */
  DEFAULT_REPUTATION_SCORE: 50,
  /** Minimum reviews before full reputation calculation */
  MIN_REVIEWS_FOR_REPUTATION: 3,
  /** Reputation score penalty for low review count */
  LOW_REVIEW_COUNT_PENALTY: 10,
  /** Reputation score threshold for trusted status */
  TRUSTED_REPUTATION_THRESHOLD: 70,
  /** Reputation score threshold for risky status */
  RISKY_REPUTATION_THRESHOLD: 40,
  /** Initial base reputation score calculation */
  REPUTATION_BASE_SCORE: 80,

  /** Base quality score for reviews */
  BASE_QUALITY_SCORE: 60,
  /** Quality score bonus for detailed reviews (>200 chars) */
  DETAILED_REVIEW_BONUS: 10,
  /** Quality score penalty for short reviews (<40 chars) */
  SHORT_REVIEW_PENALTY: 15,
  /** Review length threshold for detailed bonus */
  DETAILED_REVIEW_LENGTH: 200,
  /** Review length threshold for short penalty */
  SHORT_REVIEW_LENGTH: 40,
  /** Quality score bonus for highly helpful reviews (>3 votes) */
  HELPFUL_REVIEW_BONUS: 10,
  /** Helpful vote threshold for bonus */
  HELPFUL_VOTE_THRESHOLD: 3,
  /** Quality score penalty for unhelpful reviews (0 votes) */
  UNHELPFUL_REVIEW_PENALTY: 5,
  /** Quality score bonus for responded reviews */
  RESPONDED_REVIEW_BONUS: 5,
  /** Quality score penalty for flagged reviews */
  FLAGGED_REVIEW_PENALTY: 20,
  /** Sentiment score multiplier for quality calculation */
  SENTIMENT_SCORE_MULTIPLIER: 10,
  /** High quality score threshold */
  HIGH_QUALITY_THRESHOLD: 75,
  /** Medium quality score threshold */
  MEDIUM_QUALITY_THRESHOLD: 50,
} as const

export type ReviewActions = {
  loadingId: string | null
  flag: (reviewId: string) => Promise<void>
  unflag: (reviewId: string) => Promise<void>
  toggleFeature: (reviewId: string, isFeatured: boolean) => Promise<void>
  remove: (reviewId: string) => Promise<void>
}

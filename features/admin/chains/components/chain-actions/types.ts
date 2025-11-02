/**
 * Chain action types
 */
export type ChainActionType = 'verify' | 'unverify' | 'activate' | 'deactivate' | 'delete' | null

/**
 * Chain actions component props
 */
export interface ChainActionsProps {
  chainId: string
  chainName: string
  isVerified: boolean
  isActive: boolean
  subscriptionTier: string | null
}

/**
 * Action text configuration
 */
export interface ActionTextConfig {
  title: string
  description: string
}

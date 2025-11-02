import { getCurrentUserMetadata } from './api/queries'
import { MetadataForm } from './components'

export async function ProfileMetadata() {
  const metadata = await getCurrentUserMetadata()
  return <MetadataForm metadata={metadata} />
}

export { getCurrentUserMetadata, getProfileMetadata } from './api/queries'
export {
  updateProfileMetadata,
  uploadAvatarAction as uploadAvatar,
  uploadCoverImageAction as uploadCoverImage
} from './api/mutations'
export { MetadataForm } from './components'
export * from './types'

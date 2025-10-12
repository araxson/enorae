import { getCurrentUserMetadata } from './api/queries'
import { MetadataForm } from './components/metadata-form'

export async function ProfileMetadata() {
  const metadata = await getCurrentUserMetadata()
  return <MetadataForm metadata={metadata} />
}

export { getCurrentUserMetadata, getProfileMetadata } from './api/queries'
export { updateProfileMetadata, uploadAvatar, uploadCoverImage } from './api/mutations'
export { MetadataForm } from './components/metadata-form'

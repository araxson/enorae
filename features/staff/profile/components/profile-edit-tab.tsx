import { StaffInfoForm } from './staff-info-form'
import { MetadataForm } from '@/features/shared/profile-metadata/components'
import { UsernameForm } from '@/features/shared/profile/components'
import { ProfilePhotoUpload } from './profile-photo-upload'
import { CertificationsEditor } from './certifications-editor'
import { SpecialtiesEditor } from './specialties-editor'
import { PortfolioGallery } from './portfolio-gallery'
import type { Database } from '@/lib/types/database.types'

type StaffProfile = Database['public']['Views']['staff_enriched_view']['Row']
type ProfileMetadata = Database['identity']['Tables']['profiles_metadata']['Row'] | null

interface ProfileEditTabProps {
  profile: StaffProfile
  metadata: ProfileMetadata
  username: string | null
}

export function ProfileEditTab({ profile, metadata, username }: ProfileEditTabProps) {
  return (
    <div className="space-y-6">
      <ProfilePhotoUpload
        currentPhotoUrl={metadata?.avatar_url || profile.avatar}
        userName={profile.name || undefined}
      />
      <UsernameForm currentUsername={username} />
      <StaffInfoForm profile={profile} />
      <SpecialtiesEditor
        initialSpecialties={metadata?.tags?.filter((tag: string) => !tag.includes('certification:')) || []}
      />
      <CertificationsEditor
        initialCertifications={metadata?.tags?.filter((tag: string) => tag.includes('certification:'))?.map((tag: string) => tag.replace('certification:', '')) || []}
      />
      <PortfolioGallery portfolioImages={[]} />
      <MetadataForm metadata={metadata} />
    </div>
  )
}

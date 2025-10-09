export const SOCIAL_PROFILE_FIELDS = [
  {
    key: 'facebook',
    label: 'Facebook',
    placeholder: 'https://facebook.com/yourprofile',
  },
  {
    key: 'instagram',
    label: 'Instagram',
    placeholder: 'https://instagram.com/yourprofile',
  },
  {
    key: 'twitter',
    label: 'Twitter/X',
    placeholder: 'https://twitter.com/yourprofile',
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    placeholder: 'https://linkedin.com/in/yourprofile',
  },
  {
    key: 'tiktok',
    label: 'TikTok',
    placeholder: 'https://tiktok.com/@yourprofile',
  },
  {
    key: 'youtube',
    label: 'YouTube',
    placeholder: 'https://youtube.com/@yourprofile',
  },
] as const

export type SocialProfileKey = (typeof SOCIAL_PROFILE_FIELDS)[number]['key']

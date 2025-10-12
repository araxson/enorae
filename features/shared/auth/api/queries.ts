import 'server-only'

export async function getAuthProviders() {
  return ['email', 'otp']
}
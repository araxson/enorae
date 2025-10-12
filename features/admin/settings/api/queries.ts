import 'server-only'

export async function getAdminSettingsOverview() {
  return {
    sections: ['security', 'email', 'notifications', 'database', 'general']
  }
}
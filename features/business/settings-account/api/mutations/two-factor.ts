'use server'

import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'

/**
 * Enable/disable two-factor authentication
 */
export async function updateTwoFactorAuth(enabled: boolean) {
  await requireAuth()
  const supabase = await createClient()

  if (enabled) {
    // Enroll in MFA
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
    })

    if (error) throw error

    return {
      success: true,
      qrCode: data.totp.qr_code,
      secret: data.totp.secret,
      id: data.id,
    }
  } else {
    // Get enrolled factors
    const { data: factors } = await supabase.auth.mfa.listFactors()

    // Type guard: Check if TOTP factors exist and have at least one entry
    const totpFactors = factors?.totp
    if (Array.isArray(totpFactors) && totpFactors.length > 0 && totpFactors[0]) {
      // Unenroll from MFA
      const { error } = await supabase.auth.mfa.unenroll({
        factorId: totpFactors[0].id,
      })

      if (error) throw error
    }

    return { success: true }
  }
}

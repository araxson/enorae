import { createClient } from '@/lib/supabase/server'

export async function uploadAvatar(file: File, userId: string): Promise<{ url?: string; error?: string }> {
  try {
    const supabase = await createClient()
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}-${Date.now()}.${fileExt}`
    const filePath = `avatars/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('profiles')
      .upload(filePath, file, {
        upsert: true,
      })

    if (uploadError) {
      return { error: uploadError.message }
    }

    const { data } = supabase.storage.from('profiles').getPublicUrl(filePath)

    return { url: data.publicUrl }
  } catch (error: unknown) {
    return { error: 'Failed to upload avatar' }
  }
}

export async function uploadCoverImage(file: File, entityId: string, type: 'salon' | 'service'): Promise<{ url?: string; error?: string }> {
  try {
    const supabase = await createClient()
    const fileExt = file.name.split('.').pop()
    const fileName = `${entityId}-${Date.now()}.${fileExt}`
    const filePath = `${type}-covers/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, file, {
        upsert: true,
      })

    if (uploadError) {
      return { error: uploadError.message }
    }

    const { data } = supabase.storage.from('media').getPublicUrl(filePath)

    return { url: data.publicUrl }
  } catch (error: unknown) {
    return { error: 'Failed to upload cover image' }
  }
}

export async function deleteFile(bucket: string, filePath: string): Promise<{ error?: string }> {
  try {
    const supabase = await createClient()

    const { error } = await supabase.storage.from(bucket).remove([filePath])

    if (error) {
      return { error: error.message }
    }

    return {}
  } catch (error: unknown) {
    return { error: 'Failed to delete file' }
  }
}

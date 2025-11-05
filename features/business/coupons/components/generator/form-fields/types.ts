'use client'

import type { Ref } from 'react'

export interface FieldProps {
  errors?: Record<string, string[]>
  ref?: Ref<HTMLInputElement>
}

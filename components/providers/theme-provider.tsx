'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ReactElement } from 'react'

export function ThemeProvider({ children }: { children: React.ReactNode }): ReactElement {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </NextThemesProvider>
  )
}

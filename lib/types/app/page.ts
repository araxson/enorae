export interface PageProps<T = Record<string, string>> {
  params: Promise<T>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export interface LayoutProps<T = Record<string, string>> {
  children: React.ReactNode
  params?: Promise<T>
}
import type React from 'react'

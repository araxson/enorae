import { useState, useEffect } from 'react'
import { UI_TIMEOUTS, STRING_LIMITS, TIME_MS } from '@/lib/config/constants'

type Suggestion = {
  name: string
  slug: string
}

export function useSearchSuggestions(searchTerm: string) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (searchTerm.length < STRING_LIMITS.MIN_SEARCH) {
      setSuggestions([])
      return
    }

    let isMounted = true
    setIsLoading(true)

    // ASYNC FIX: Add AbortController for cancellable fetch
    const controller = new AbortController()

    const fetchSuggestions = async () => {
      try {
        const timeoutSignal = AbortSignal.timeout(TIME_MS.API_REQUEST_TIMEOUT)
        const response = await fetch(
          `/api/salons/suggestions?q=${encodeURIComponent(searchTerm)}`,
          { signal: AbortSignal.any([controller.signal, timeoutSignal]) }
        )

        if (response.ok) {
          const data = await response.json()
          if (isMounted) {
            setSuggestions(data)
          }
        }
      } catch (error) {
        // ASYNC FIX: Ignore AbortError when request is cancelled
        if (error instanceof Error && error.name === 'AbortError') {
          return
        }
        console.error('Failed to fetch suggestions:', error)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    const debounceTimer = setTimeout(fetchSuggestions, UI_TIMEOUTS.SEARCH_DEBOUNCE)

    return () => {
      isMounted = false
      clearTimeout(debounceTimer)
      controller.abort()
    }
  }, [searchTerm])

  return { suggestions, isLoading }
}

import { useState, useEffect } from 'react'

type Suggestion = {
  name: string
  slug: string
}

export function useSearchSuggestions(searchTerm: string) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (searchTerm.length < 2) {
      setSuggestions([])
      return
    }

    let isMounted = true
    setIsLoading(true)

    // ASYNC FIX: Add AbortController for cancellable fetch
    const controller = new AbortController()

    const fetchSuggestions = async () => {
      try {
        const response = await fetch(
          `/api/salons/suggestions?q=${encodeURIComponent(searchTerm)}`,
          { signal: controller.signal }
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

    const debounceTimer = setTimeout(fetchSuggestions, 300)

    return () => {
      isMounted = false
      clearTimeout(debounceTimer)
      controller.abort()
    }
  }, [searchTerm])

  return { suggestions, isLoading }
}

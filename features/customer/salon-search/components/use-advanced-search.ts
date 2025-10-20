import { useState, useEffect, useCallback, useId } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface UseAdvancedSearchOptions {
  onSearchStart?: () => void
  onSearchComplete?: () => void
}

export function useAdvancedSearch(options: UseAdvancedSearchOptions = {}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '')
  const [city, setCity] = useState(searchParams.get('city') || '')
  const [state, setState] = useState(searchParams.get('state') || '')
  const [verifiedOnly, setVerifiedOnly] = useState(searchParams.get('verified') === 'true')
  const [minRating, setMinRating] = useState(searchParams.get('rating') || '')
  const [suggestions, setSuggestions] = useState<{ name: string; slug: string }[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const suggestionsListId = useId()

  // Fetch suggestions as user types
  useEffect(() => {
    const controller = new AbortController()

    const fetchSuggestions = async () => {
      if (searchTerm.length < 2) {
        setSuggestions([])
        setFocusedIndex(-1)
        return
      }

      try {
        const response = await fetch(
          `/api/salons/suggestions?q=${encodeURIComponent(searchTerm)}`,
          { signal: controller.signal },
        )
        if (!controller.signal.aborted && response.ok) {
          const data = await response.json()
          setSuggestions(data)
          setFocusedIndex(-1)
        }
      } catch (error) {
        if (!(error instanceof Error) || error.name !== 'AbortError') {
          console.error('[AdvancedSearch] suggestion fetch failed', error)
        }
      }
    }

    const debounceTimer = setTimeout(fetchSuggestions, 300)
    return () => {
      controller.abort()
      clearTimeout(debounceTimer)
    }
  }, [searchTerm])

  const handleSearch = useCallback(() => {
    setIsSearching(true)
    options.onSearchStart?.()

    const params = new URLSearchParams()
    if (searchTerm) params.set('q', searchTerm)
    if (city) params.set('city', city)
    if (state) params.set('state', state)
    if (verifiedOnly) params.set('verified', 'true')
    if (minRating) params.set('rating', minRating)

    router.push(`/customer/search?${params.toString()}`)

    // Reset searching state after navigation
    setTimeout(() => {
      setIsSearching(false)
      options.onSearchComplete?.()
    }, 500)
  }, [searchTerm, city, state, verifiedOnly, minRating, router, options])

  const handleInputKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && suggestions.length === 0) {
        return
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault()
        setFocusedIndex((prev) => {
          const nextIndex = prev + 1
          return nextIndex >= suggestions.length ? 0 : nextIndex
        })
        return
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault()
        setFocusedIndex((prev) => {
          if (prev <= 0) {
            return suggestions.length > 0 ? suggestions.length - 1 : -1
          }
          return prev - 1
        })
        return
      }

      if (event.key === 'Enter') {
        if (focusedIndex >= 0 && suggestions[focusedIndex]) {
          event.preventDefault()
          router.push(`/customer/salons/${suggestions[focusedIndex].slug}`)
          return
        }
        handleSearch()
        return
      }

      if (event.key === 'Escape') {
        if (suggestions.length > 0) {
          event.preventDefault()
          setSuggestions([])
          setFocusedIndex(-1)
        }
      }
    },
    [suggestions, focusedIndex, handleSearch, router],
  )

  return {
    searchTerm,
    setSearchTerm,
    city,
    setCity,
    state,
    setState,
    verifiedOnly,
    setVerifiedOnly,
    minRating,
    setMinRating,
    suggestions,
    setSuggestions,
    isSearching,
    focusedIndex,
    setFocusedIndex,
    suggestionsListId,
    handleSearch,
    handleInputKeyDown,
  }
}

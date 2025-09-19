import { useState, useEffect, useCallback } from 'react'

/**
 * SSR-safe localStorage hook that prevents hydration mismatches
 *
 * @param key - The localStorage key
 * @param defaultValue - Default value to use before hydration
 * @returns [value, setValue, isHydrated] tuple
 */
export function useClientStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
    const stored = localStorage.getItem(key)
    if (stored) {
      try {
        setValue(JSON.parse(stored))
      } catch (error) {
        console.error(`Error parsing stored ${key}:`, error)
        localStorage.removeItem(key)
      }
    }
  }, [key])

  const setStoredValue = useCallback(
    (newValue: T) => {
      setValue(newValue)
      if (isHydrated) {
        try {
          localStorage.setItem(key, JSON.stringify(newValue))
        } catch (error) {
          console.error(`Error storing ${key}:`, error)
        }
      }
    },
    [key, isHydrated],
  )

  const removeStoredValue = useCallback(() => {
    setValue(defaultValue)
    if (isHydrated) {
      try {
        localStorage.removeItem(key)
      } catch (error) {
        console.error(`Error removing ${key}:`, error)
      }
    }
  }, [key, isHydrated, defaultValue])

  return [value, setStoredValue, removeStoredValue, isHydrated] as const
}

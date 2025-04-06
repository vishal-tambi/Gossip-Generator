"use client"

import { useState, useEffect } from "react"

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // State to store our value - start with initialValue always
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  // Add a state to track if we've loaded from localStorage
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize the state only on client side
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key)
      // Parse stored json or if none return initialValue
      if (item) {
        setStoredValue(JSON.parse(item))
      }
      // Mark as initialized
      setIsInitialized(true)
    } catch (error) {
      console.error(error)
      setIsInitialized(true)
    }
  }, [key, initialValue])

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      // Save state
      setStoredValue(valueToStore)
      // Save to local storage only on client side
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue]
}


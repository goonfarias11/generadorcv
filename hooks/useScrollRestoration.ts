/**
 * useScrollRestoration Hook
 * Saves and restores scroll position per builder section
 */

'use client'

import { useEffect, useRef } from 'react'

const STORAGE_KEY = 'builder-scroll-position'

export function useScrollRestoration(sectionId: string, enabled = true) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!enabled || !containerRef.current) return

    const container = containerRef.current

    // Restore scroll position
    const savedPositions = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '{}'
    )
    
    if (savedPositions[sectionId]) {
      container.scrollTop = savedPositions[sectionId]
    }

    // Save scroll position on scroll
    const handleScroll = () => {
      const positions = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || '{}'
      )
      positions[sectionId] = container.scrollTop
      localStorage.setItem(STORAGE_KEY, JSON.stringify(positions))
    }

    container.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      container.removeEventListener('scroll', handleScroll)
    }
  }, [sectionId, enabled])

  return containerRef
}

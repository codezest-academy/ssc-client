'use client'

import { useEffect } from 'react'
import { usePostHog } from 'posthog-js/react'

export function PyqLandingTracker({ 
  subjectSlug, 
  chapterId, 
  chapterName 
}: { 
  subjectSlug: string
  chapterId: string
  chapterName: string
}) {
  const posthog = usePostHog()

  useEffect(() => {
    posthog?.capture('pyq_landing_viewed', {
      subjectSlug,
      chapterId,
      chapterName
    })
  }, [posthog, subjectSlug, chapterId, chapterName])

  return null
}

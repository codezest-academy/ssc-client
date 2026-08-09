'use client'

import posthog from 'posthog-js'
import { PostHogProvider as Provider } from 'posthog-js/react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'

function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname
      if (searchParams?.toString()) {
        url = url + `?${searchParams.toString()}`
      }
      posthog.capture('$pageview', {
        $current_url: url,
      })
    }
  }, [pathname, searchParams])
  
  return null
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  // Check if we are running on the client side
  if (typeof window !== 'undefined') {
    return (
      <Provider client={posthog}>
        <Suspense fallback={null}>
          <PostHogPageView />
        </Suspense>
        {children}
      </Provider>
    )
  }

  // Server side render
  return <>{children}</>
}

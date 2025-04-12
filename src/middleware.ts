import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { env } from './env'

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)', 
  '/sign-up(.*)', 
  "/api/stripe-webhook",
  "/api/razorpay-webhook",
  "/api/socket/io"
])

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect()
  }
  // Dev-only override
  if (process.env.NODE_ENV === 'development') {
    const headers = new Headers(request.headers)
    headers.set('origin', env.NEXT_PUBLIC_BASE_URL)
    headers.set('x-forwarded-host', env.NEXT_PUBLIC_BASE_URL.replace(/^https?:\/\//, ''))

    const response = NextResponse.next({
      request: {
        headers,
      },
    })

    return response
  }

  // Default behavior
  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
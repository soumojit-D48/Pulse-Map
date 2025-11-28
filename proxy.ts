

// proxy.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Public routes
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/',
  '/api/webhooks(.*)',
]);

// Routes requiring profile check
const requiresProfileCheck = createRouteMatcher([
  '/home(.*)',
  '/donors(.*)',
  '/requests(.*)',
  '/donation-history(.*)',
  '/profile(.*)',
  '/nearby-requests(.*)',
  '/responses(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return NextResponse.next();

  const { userId } = await auth();

  if (!userId) {
    const signIn = new URL('/sign-in', req.url);
    signIn.searchParams.set('redirect_url', req.url);
    return NextResponse.redirect(signIn);
  }

  await auth.protect();

  const pathname = req.nextUrl.pathname;
  const needsCheck =
    requiresProfileCheck(req) ||
    pathname.startsWith('/profile/complete');

  if (needsCheck) {
    try {
      const apiUrl = new URL('/api/profile', req.url);

      const response = await fetch(apiUrl.toString(), {
        headers: {
          cookie: req.headers.get('cookie') || '',
        },
      });

      if (!response.ok) {
        if (pathname.startsWith('/profile/complete'))
          return NextResponse.next();

        return NextResponse.redirect(
          new URL('/profile/complete', req.url)
        );
      }

      const { profile } = await response.json();

      // Already completed: redirect away from complete page
      if (pathname.startsWith('/profile/complete')) {
        if (profile?.profileCompleted) {
          return NextResponse.redirect(
            new URL('/home', req.url)
          );
        }
        return NextResponse.next();
      }

      // Needs completion
      if (!profile?.profileCompleted) {
        return NextResponse.redirect(
          new URL('/profile/complete', req.url)
        );
      }
    } catch (err) {
      return NextResponse.redirect(
        new URL('/profile/complete', req.url)
      );
    }
  }

  return NextResponse.next();
});

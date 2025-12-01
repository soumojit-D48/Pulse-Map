

// // proxy.ts
// import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
// import { NextResponse } from 'next/server';

// // Public routes
// const isPublicRoute = createRouteMatcher([
//   '/sign-in(.*)',
//   '/sign-up(.*)',
//   '/',
//   '/api/webhooks(.*)',
// ]);

// // Routes requiring profile check
// const requiresProfileCheck = createRouteMatcher([
//   '/Home(.*)',
//   '/donors(.*)',
//   '/requests(.*)',
//   '/donation-history(.*)',
//   '/profile(.*)',
//   '/nearby-requests(.*)',
//   '/responses(.*)'
// ]);

// export default clerkMiddleware(async (auth, req) => {
//   if (isPublicRoute(req)) return NextResponse.next();

//   const { userId } = await auth();

//   if (!userId) {
//     const signIn = new URL('/sign-in', req.url);
//     signIn.searchParams.set('redirect_url', req.url);
//     return NextResponse.redirect(signIn);
//   }

//   await auth.protect();

//   const pathname = req.nextUrl.pathname;
//   const needsCheck =
//     requiresProfileCheck(req) ||
//     pathname.startsWith('/profile/complete');

//   if (needsCheck) {
//     try {
//       const apiUrl = new URL('/api/profile', req.url);

//       const response = await fetch(apiUrl.toString(), {
//         headers: {
//           cookie: req.headers.get('cookie') || '',
//         },
//       });

//       if (!response.ok) {
//         if (pathname.startsWith('/profile/complete'))
//           return NextResponse.next();

//         return NextResponse.redirect(
//           new URL('/profile/complete', req.url)
//         );
//       }

//       const { profile } = await response.json();

//       // Already completed: redirect away from complete page
//       if (pathname.startsWith('/profile/complete')) {
//         if (profile?.profileCompleted) {
//           return NextResponse.redirect(
//             new URL('/Home', req.url)
//           );
//         }
//         return NextResponse.next();
//       }

//       // Needs completion
//       if (!profile?.profileCompleted) {
//         return NextResponse.redirect(
//           new URL('/profile/complete', req.url)
//         );
//       }
//     } catch (err) {
//       return NextResponse.redirect(
//         new URL('/profile/complete', req.url)
//       );
//     }
//   }

//   return NextResponse.next();
// });



// import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
// import { NextResponse } from 'next/server';

// const isPublicRoute = createRouteMatcher([
//   '/sign-in(.*)',
//   '/sign-up(.*)',
//   '/',
//   '/api/webhooks(.*)',
// ]);

// const requiresProfileCheck = createRouteMatcher([
//   '/Home(.*)',
//   '/donors(.*)',
//   '/requests(.*)',
//   '/donation-history(.*)',
//   '/profile(.*)',
//   '/nearby-requests(.*)',
//   '/responses(.*)'
// ]);

// export default clerkMiddleware(async (auth, req) => {
//   const pathname = req.nextUrl.pathname;

//   // IMPORTANT: Skip static files and API routes from auth check
//   if (
//     pathname.startsWith('/_next/') ||
//     pathname.startsWith('/api/') ||
//     pathname.includes('.')  // Skip files with extensions
//   ) {
//     return NextResponse.next();
//   }

//   if (isPublicRoute(req)) return NextResponse.next();

//   const { userId } = await auth();

//   if (!userId) {
//     const signIn = new URL('/sign-in', req.url);
//     signIn.searchParams.set('redirect_url', req.url);
//     return NextResponse.redirect(signIn);
//   }

//   await auth.protect();

//   // Remove the fetch logic for now - it's causing issues
//   // Handle profile completion check in your pages instead

//   return NextResponse.next();
// });

// export const config = {
//   matcher: [
//     // Skip all internal Next.js paths and static files
//     '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api/webhooks).*)',
//   ],
// };














import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from './lib/prisma'; // Adjust path to your prisma instance

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/',
  '/api/webhooks(.*)',
]);

const requiresProfileCheck = createRouteMatcher([
  '/Home(.*)',
  '/donors(.*)',
  '/requests(.*)',
  '/donation-history(.*)',
  '/profile(.*)',
  '/nearby-requests(.*)',
  '/responses(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  const pathname = req.nextUrl.pathname;

  // CRITICAL: Skip static files, Next.js internals, and assets
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.match(/\.(js|css|jpg|jpeg|png|gif|svg|ico|woff|woff2|ttf|eot)$/i)
  ) {
    return NextResponse.next();
  }

  if (isPublicRoute(req)) return NextResponse.next();

  const { userId } = await auth();

  if (!userId) {
    const signIn = new URL('/sign-in', req.url);
    signIn.searchParams.set('redirect_url', req.url);
    return NextResponse.redirect(signIn);
  }

  await auth.protect();

  // Already on profile complete page - allow access
  if (pathname.startsWith('/profile/complete')) {
    return NextResponse.next();
  }

  // Check if profile completion is needed
  if (requiresProfileCheck(req)) {
    try {
      // Direct database check instead of fetch
      const user = await prisma.profile.findUnique({
        where: { clerkId: userId },
        select: { profileCompleted: true }
      });

      // Profile not complete - redirect to complete page
      if (!user || !user.profileCompleted) {
        return NextResponse.redirect(
          new URL('/profile/complete', req.url)
        );
      }
    } catch (err) {
      console.error('Profile check error:', err);
      // On error, redirect to complete profile to be safe
      return NextResponse.redirect(
        new URL('/profile/complete', req.url)
      );
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Match all paths except static files and internal Next.js paths
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
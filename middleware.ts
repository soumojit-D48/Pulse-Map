


// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/',
  '/api/webhooks(.*)',
]);

// Routes that need profile completion check
const requiresProfileCheck = createRouteMatcher([
  '/home(.*)',
  '/donors(.*)',
  '/requests(.*)',
  '/donations(.*)',
  '/profile/edit(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  
  // Allow public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Require authentication for non-public routes
  if (!userId) {
    const signInUrl = new URL('/sign-in', req.url);
    signInUrl.searchParams.set('redirect_url', req.url);
    return NextResponse.redirect(signInUrl);
  }

  // Check profile status for protected routes OR profile completion page
  const needsProfileCheck = requiresProfileCheck(req) || req.nextUrl.pathname.startsWith('/profile/complete');
  
  if (needsProfileCheck) {
    try {
      const apiUrl = new URL('/api/profile', req.url);
      const response = await fetch(apiUrl.toString(), {
        headers: {
          cookie: req.headers.get("cookie") || "",
        },
      });

      if (!response.ok) {
        // Profile doesn't exist - allow access to complete profile page only
        if (req.nextUrl.pathname.startsWith('/profile/complete')) {
          return NextResponse.next();
        }
        return NextResponse.redirect(new URL('/profile/complete', req.url));
      }

      const { profile } = await response.json();
      console.log(profile, "sdhckjhdjfhk");
      

      // If accessing /profile/complete but already completed
      if (req.nextUrl.pathname.startsWith('/profile/complete')) {
        if (profile && profile.profileCompleted) {
          return NextResponse.redirect(new URL('/dashboard', req.url));
        }
        return NextResponse.next();
      }

      // If accessing other protected routes but profile not completed
      if (!profile || !profile.profileCompleted) {
        return NextResponse.redirect(new URL('/profile/complete', req.url));
      }

    } catch (error) {
      console.error('Error checking profile:', error);
      return NextResponse.redirect(new URL('/profile/complete', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};








// import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
// import { NextResponse } from 'next/server';
// import { prisma } from '@/lib/prisma';

// // Define public routes that don't require authentication
// const isPublicRoute = createRouteMatcher([
//   '/sign-in(.*)',
//   '/sign-up(.*)',
//   '/',
//   '/about',
// ]);

// // Routes that require profile completion
// const requiresProfile = createRouteMatcher([
//   '/dashboard(.*)',
//   '/donors(.*)',
//   '/requests(.*)',
//   '/donations(.*)',
//   '/profile/edit(.*)',
// ]);

// export default clerkMiddleware(async (auth, req) => {
//   const { userId } = await auth();

//   // Allow public routes
//   if (isPublicRoute(req)) {
//     return NextResponse.next();
//   }

//   // Require authentication for non-public routes
//   if (!userId) {
//     const signInUrl = new URL('/sign-in', req.url);
//     signInUrl.searchParams.set('redirect_url', req.url);
//     return NextResponse.redirect(signInUrl);
//   }

//   // Check profile completion for protected routes
//   if (requiresProfile(req)) {
//     try {
//       const profile = await prisma.profile.findUnique({
//         where: { clerkId: userId },
//         select: { profileCompleted: true },
//       });

//       // If no profile or not completed, redirect to profile completion
//       if (!profile || !profile.profileCompleted) {
//         const profileUrl = new URL('/profile/complete', req.url);
//         return NextResponse.redirect(profileUrl);
//       }
//     } catch (error) {
//       console.error('Error checking profile:', error);
//     }
//   }

//   return NextResponse.next();
// });

// export const config = {
//   matcher: [
//     // Skip Next.js internals and static files
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     // Always run for API routes
//     '/(api|trpc)(.*)',
//   ],
// };











// // middleware.ts
// import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
// import { NextResponse } from 'next/server';
// import prisma from '@/lib/prisma';

// // Define public routes that don't require authentication
// const isPublicRoute = createRouteMatcher([
//   '/sign-in(.*)',
//   '/sign-up(.*)',
//   '/',
//   '/api/webhooks(.*)',
// ]);

// // Routes that need profile completion check
// const requiresProfileCheck = createRouteMatcher([
//   '/dashboard(.*)',
//   '/donors(.*)',
//   '/requests(.*)',
//   '/donations(.*)',
//   '/profile/edit(.*)',
// ]);

// export default clerkMiddleware(async (auth, req) => {
//   const { userId } = await auth();
  
//   // Allow public routes
//   if (isPublicRoute(req)) {
//     return NextResponse.next();
//   }

//   // Require authentication for non-public routes
//   if (!userId) {
//     const signInUrl = new URL('/sign-in', req.url);
//     signInUrl.searchParams.set('redirect_url', req.url);
//     return NextResponse.redirect(signInUrl);
//   }

//   // Check if user is trying to access profile completion page
//   // if (req.nextUrl.pathname.startsWith('/profile/complete')) {
//   //   return NextResponse.next();
//   // }

//   // Check if user is trying to access profile completion page
// if (req.nextUrl.pathname.startsWith('/profile/complete')) {
//   try {
//     const apiUrl = new URL('/api/profile', req.url);
//     const response = await fetch(apiUrl.toString(), {
//       headers: {
//         cookie: req.headers.get("cookie") || "",
//       },
//     });

//     if (response.ok) {
//       const { profile } = await response.json();
      
//       // If profile exists and is completed, redirect to dashboard
//       if (profile && profile.profileCompleted) {
//         return NextResponse.redirect(new URL('/dashboard', req.url));
//       }
//     }
//   } catch (error) {
//     console.error('Error checking profile:', error);
//   }
  
//   // Allow access to complete profile page if not completed
//   return NextResponse.next();
// }

//   // For routes that require a completed profile

//   // if (requiresProfileCheck(req)) {
//   //   try {
//   //     // Check if profile exists and is completed
//   //     // const profile = await prisma.profile.findUnique({
//   //     //   where: { clerkId: userId },
//   //     //   select: { profileCompleted: true }
//   //     // });

//   //     // // Redirect to profile completion if profile doesn't exist or isn't completed
//   //     // if (!profile || !profile.profileCompleted) {
//   //     //   const completeProfileUrl = new URL('/profile/complete', req.url);
//   //     //   return NextResponse.redirect(completeProfileUrl);
//   //     // }
//   //   } catch (error) {
//   //     console.error('Error checking profile:', error);
//   //     // On error, redirect to profile completion to be safe
//   //     return NextResponse.redirect(new URL('/profile/complete', req.url));
//   //   }
//   // }


// if (requiresProfileCheck(req)) {
//   try {
//     // Call your API route instead of prisma
//     const apiUrl = new URL('/api/profile', req.url);

//     const response = await fetch(apiUrl.toString(), {
//       headers: {
//         cookie: req.headers.get("cookie") || "",
//       },
//     });

//     if (!response.ok) {
//       return NextResponse.redirect(new URL('/profile/complete', req.url));
//     }

//     const { profile } = await response.json();

//     if (!profile || !profile.profileCompleted) {
//       return NextResponse.redirect(new URL('/profile/complete', req.url));
//     }
//   } catch (err) {
//     return NextResponse.redirect(new URL('/profile/complete', req.url));
//   }
// }


//   return NextResponse.next();
// }

// );

// export const config = {
//   matcher: [
//     // Skip Next.js internals and static files
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     // Always run for API routes
//     '/(api|trpc)(.*)',
//   ],
// };







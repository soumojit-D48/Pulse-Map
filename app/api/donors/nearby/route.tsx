




// app/api/donors/nearby/route.ts
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma';

// Haversine formula to calculate distance between two points
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Check if donor is eligible (3 months since last donation)
function isEligibleToDonate(lastDonationDate: Date | null): boolean {
  if (!lastDonationDate) return true;

  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  return lastDonationDate <= threeMonthsAgo;
}

// Format last active time
function formatLastActive(updatedAt: Date): string {
  const now = new Date();
  const diff = now.getTime() - updatedAt.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `Active ${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  if (hours < 24) return `Active ${hours} hour${hours !== 1 ? 's' : ''} ago`;
  return `Active ${days} day${days !== 1 ? 's' : ''} ago`;
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current user's profile
    const userProfile = await prisma.profile.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
        latitude: true,
        longitude: true,
      },
    });

    if (!userProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Check if user has location data
    if (!userProfile.latitude || !userProfile.longitude) {
      return NextResponse.json(
        { error: 'Please complete your profile with location information first' },
        { status: 400 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const bloodGroup = searchParams.get('bloodGroup') || 'ALL';
    const radius = parseFloat(searchParams.get('radius') || '20');
    const availableOnly = searchParams.get('availableOnly') !== 'false';

    // Build where clause
    const whereClause: any = {
      id: { not: userProfile.id }, // Exclude current user
    };

    if (availableOnly) {
      whereClause.available = true;
    }

    if (bloodGroup !== 'ALL') {
      whereClause.bloodGroup = bloodGroup;
    }

    // Fetch all potential donors
    const allDonors = await prisma.profile.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        bloodGroup: true,
        available: true,
        latitude: true,
        longitude: true,
        city: true,
        state: true,
        locationName: true,
        phone: true,
        lastDonationDate: true,
        updatedAt: true,
        avatarUrl: true,
      },
    });

    // Calculate distances and filter by radius
    const donorsWithDistance = allDonors
      .map((donor) => {
        const distance = calculateDistance(
          userProfile.latitude,
          userProfile.longitude,
          donor.latitude,
          donor.longitude
        );

        return {
          ...donor,
          distance,
          distanceText: `${distance} km`,
          lastActive: formatLastActive(donor.updatedAt),
          eligible: isEligibleToDonate(donor.lastDonationDate),
        };
      })
      .filter((donor) => donor.distance <= radius)
      .sort((a, b) => a.distance - b.distance); // Sort by nearest first

    return NextResponse.json({
      success: true,
      donors: donorsWithDistance,
      totalFound: donorsWithDistance.length,
      filters: {
        bloodGroup,
        radius,
        availableOnly,
      },
      userLocation: {
        latitude: userProfile.latitude,
        longitude: userProfile.longitude,
      },
    });
  } catch (error) {
    console.error('Nearby donors error:', error);
    
    // Log detailed error for debugging
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}















// // app/api/donors/nearby/route.ts
// import { auth } from '@clerk/nextjs/server';
// import { NextResponse } from 'next/server';
// import {prisma} from '@/lib/prisma';

// // Haversine formula to calculate distance between two points
// function calculateDistance(
//   lat1: number,
//   lon1: number,
//   lat2: number,
//   lon2: number
// ): number {
//   const R = 6371; // Earth's radius in kilometers
//   const dLat = toRadians(lat2 - lat1);
//   const dLon = toRadians(lon2 - lon1);

//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(toRadians(lat1)) *
//       Math.cos(toRadians(lat2)) *
//       Math.sin(dLon / 2) *
//       Math.sin(dLon / 2);

//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   const distance = R * c;

//   return Math.round(distance * 10) / 10; // Round to 1 decimal place
// }

// function toRadians(degrees: number): number {
//   return degrees * (Math.PI / 180);
// }

// // Check if donor is eligible (3 months since last donation)
// function isEligibleToDonate(lastDonationDate: Date | null): boolean {
//   if (!lastDonationDate) return true;

//   const threeMonthsAgo = new Date();
//   threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

//   return lastDonationDate <= threeMonthsAgo;
// }

// // Format last active time
// function formatLastActive(updatedAt: Date): string {
//   const now = new Date();
//   const diff = now.getTime() - updatedAt.getTime();
  
//   const minutes = Math.floor(diff / 60000);
//   const hours = Math.floor(diff / 3600000);
//   const days = Math.floor(diff / 86400000);

//   if (minutes < 60) return `Active ${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
//   if (hours < 24) return `Active ${hours} hour${hours !== 1 ? 's' : ''} ago`;
//   return `Active ${days} day${days !== 1 ? 's' : ''} ago`;
// }

// export async function GET(req: Request) {
//   try {
//     const { userId } = await auth();

//     if (!userId) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     // Get current user's profile
//     const userProfile = await prisma.profile.findUnique({
//       where: { clerkId: userId },
//       select: {
//         id: true,
//         latitude: true,
//         longitude: true,
//       },
//     });

//     if (!userProfile) {
//       return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
//     }

//     // Parse query parameters
//     const { searchParams } = new URL(req.url);
//     const bloodGroup = searchParams.get('bloodGroup') || 'ALL';
//     const radius = parseFloat(searchParams.get('radius') || '20');
//     const availableOnly = searchParams.get('availableOnly') !== 'false';

//     // Build where clause
//     const whereClause: any = {
//       id: { not: userProfile.id }, // Exclude current user
//     };

//     if (availableOnly) {
//       whereClause.available = true;
//     }

//     if (bloodGroup !== 'ALL') {
//       whereClause.bloodGroup = bloodGroup;
//     }

//     // Fetch all potential donors
//     const allDonors = await prisma.profile.findMany({
//       where: whereClause,
//       select: {
//         id: true,
//         name: true,
//         bloodGroup: true,
//         available: true,
//         latitude: true,
//         longitude: true,
//         city: true,
//         state: true,
//         locationName: true,
//         phone: true,
//         lastDonationDate: true,
//         updatedAt: true,
//         avatarUrl: true,
//       },
//     });

//     // Calculate distances and filter by radius
//     const donorsWithDistance = allDonors
//       .map((donor) => {
//         const distance = calculateDistance(
//           userProfile.latitude,
//           userProfile.longitude,
//           donor.latitude,
//           donor.longitude
//         );

//         return {
//           ...donor,
//           distance,
//           distanceText: `${distance} km`,
//           lastActive: formatLastActive(donor.updatedAt),
//           eligible: isEligibleToDonate(donor.lastDonationDate),
//         };
//       })
//       .filter((donor) => donor.distance <= radius)
//       .sort((a, b) => a.distance - b.distance); // Sort by nearest first

//     return NextResponse.json({
//       success: true,
//       donors: donorsWithDistance,
//       totalFound: donorsWithDistance.length,
//       filters: {
//         bloodGroup,
//         radius,
//         availableOnly,
//       },
//       userLocation: {
//         latitude: userProfile.latitude,
//         longitude: userProfile.longitude,
//       },
//     });
//   } catch (error) {
//     console.error('Nearby donors error:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }



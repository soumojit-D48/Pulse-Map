

// // app/api/responses/[id]/route.ts
// import { auth } from '@clerk/nextjs/server';
// import { NextResponse } from 'next/server';
// import  prisma  from '@/lib/prisma';

// // PATCH - Update response status (accept/decline)
// export async function PATCH(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const { userId } = await auth();

//     if (!userId) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const profile = await prisma.profile.findUnique({
//       where: { clerkId: userId },
//       select: { id: true, gender: true },
//     });

//     if (!profile) {
//       return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
//     }

//     const body = await req.json();
//     const { status } = body;

//     if (!['ACCEPTED', 'DECLINED'].includes(status)) {
//       return NextResponse.json(
//         { error: 'Invalid status. Must be ACCEPTED or DECLINED' },
//         { status: 400 }
//       );
//     }

//     // Get response with request info
//     const response = await prisma.response.findUnique({
//       where: { id: params.id },
//       include: {
//         request: {
//           select: {
//             createdById: true,
//             patientName: true,
//           },
//         },
//         donor: {
//           select: {
//             id: true,
//           },
//         },
//       },
//     });

//     if (!response) {
//       return NextResponse.json({ error: 'Response not found' }, { status: 404 });
//     }

//     // Only request creator can accept/decline
//     if (response.request.createdById !== profile.id) {
//       return NextResponse.json(
//         { error: 'Only the request creator can update response status' },
//         { status: 403 }
//       );
//     }

//     // Update response status
//     const updatedResponse = await prisma.response.update({
//       where: { id: params.id },
//       data: { status },
//     });

//     // If accepted, update donor's last donation date
//     if (status === 'ACCEPTED') {
//       await prisma.profile.update({
//         where: { id: response.donor.id },
//         data: {
//           lastDonationDate: new Date(),
//         },
//       });

//       // Optionally create a donation record
//       await prisma.donation.create({
//         data: {
//           donorId: response.donor.id,
//           requestId: response.requestId,
//           donationDate: new Date(),
//           unitsDonated: 1, // Default to 1, can be updated later
//         },
//       });
//     }

//     return NextResponse.json({
//       success: true,
//       message: `Response ${status.toLowerCase()}`,
//       response: updatedResponse,
//     });
//   } catch (error) {
//     console.error('Update response error:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

// // DELETE - Donor cancels their response
// export async function DELETE(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const { userId } = await auth();

//     if (!userId) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const profile = await prisma.profile.findUnique({
//       where: { clerkId: userId },
//       select: { id: true },
//     });

//     if (!profile) {
//       return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
//     }

//     const response = await prisma.response.findUnique({
//       where: { id: params.id },
//       select: { donorId: true },
//     });

//     if (!response) {
//       return NextResponse.json({ error: 'Response not found' }, { status: 404 });
//     }

//     // Only the donor can delete their own response
//     if (response.donorId !== profile.id) {
//       return NextResponse.json(
//         { error: 'You can only delete your own responses' },
//         { status: 403 }
//       );
//     }

//     await prisma.response.delete({
//       where: { id: params.id },
//     });

//     return NextResponse.json({
//       success: true,
//       message: 'Response cancelled',
//     });
//   } catch (error) {
//     console.error('Delete response error:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }




























// // app/api/responses/[id]/route.ts
// import { auth } from '@clerk/nextjs/server';
// import { NextResponse } from 'next/server';
// import  prisma  from '@/lib/prisma';

// // PATCH - Update response status (accept/decline)
// export async function PATCH(
//   req: Request,
//   // { params }: { params: { id: string } }
//   ctx: {params: Promise<{id: string}>}
// ) {

//   const { id } = await ctx.params;

//   if (!id) {
//     return NextResponse.json({ error: "Missing request ID" }, { status: 400 });
//   }
//   try {
//     const { userId } = await auth();

//     if (!userId) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const profile = await prisma.profile.findUnique({
//       where: { clerkId: userId },
//       select: { id: true, gender: true },
//     });

//     if (!profile) {
//       return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
//     }

//     const body = await req.json();
//     const { status } = body;

//     if (!['ACCEPTED', 'DECLINED'].includes(status)) {
//       return NextResponse.json(
//         { error: 'Invalid status. Must be ACCEPTED or DECLINED' },
//         { status: 400 }
//       );
//     }

//     // Get response with request info
//     const response = await prisma.response.findUnique({
//       where: { id },
//       include: {
//         request: {
//           select: {
//             id: true,
//             createdById: true,
//             patientName: true,
//             status: true,
//           },
//         },
//         donor: {
//           select: {
//             id: true,
//             name: true,
//           },
//         },
//       },
//     });

//     if (!response) {
//       return NextResponse.json({ error: 'Response not found' }, { status: 404 });
//     }

//     // Only request creator can accept/decline
//     if (response.request.createdById !== profile.id) {
//       return NextResponse.json(
//         { error: 'Only the request creator can update response status' },
//         { status: 403 }
//       );
//     }

//     // Check if request is still active
//     if (response.request.status !== 'ACTIVE') {
//       return NextResponse.json(
//         { error: 'This request is no longer active' },
//         { status: 400 }
//       );
//     }

//     // Start transaction for accept flow
//     if (status === 'ACCEPTED') {
//       await prisma.$transaction(async (tx) => {
//         // 1. Update response status to ACCEPTED
//         await tx.response.update({
//           // where: { id: params.id },
//           where: { id },
//           data: { status: 'ACCEPTED' },
//         });

//         // 2. Update donor's last donation date
//         await tx.profile.update({
//           where: { id: response.donor.id },
//           data: {
//             lastDonationDate: new Date(),
//           },
//         });

//         // 3. Create donation record
//         await tx.donation.create({
//           data: {
//             donorId: response.donor.id,
//             requestId: response.request.id,
//             donationDate: new Date(),
//             unitsDonated: 1, // Default to 1 unit
//           },
//         });

//         // 4. Mark request as FULFILLED
//         await tx.request.update({
//           where: { id: response.request.id },
//           data: {
//             status: 'FULFILLED',
//             fulfilledAt: new Date(),
//           },
//         });

//         // 5. Decline all other pending responses
//         await tx.response.updateMany({
//           where: {
//             requestId: response.request.id,
//             id: { not: params.id },
//             status: 'PENDING',
//           },
//           data: {
//             status: 'DECLINED',
//           },
//         });
//       });

//       return NextResponse.json({
//         success: true,
//         message: `Response accepted. Request fulfilled by ${response.donor.name}.`,
//         response: {
//           id: response.id,
//           status: 'ACCEPTED',
//           donorName: response.donor.name,
//         },
//       });
//     }

//     // For DECLINED status (simpler flow)
//     const updatedResponse = await prisma.response.update({
//       where: { id: params.id },
//       data: { status: 'DECLINED' },
//     });

//     return NextResponse.json({
//       success: true,
//       message: 'Response declined',
//       response: updatedResponse,
//     });
//   } catch (error) {
//     console.error('Update response error:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }















// // app/api/responses/[id]/route.ts
// import { auth } from '@clerk/nextjs/server';
// import { NextResponse } from 'next/server';
// import prisma from '@/lib/prisma';

// export async function PATCH(
//   req: Request,
//   ctx: { params: Promise<{ id: string }> }
// ) {
//   // Extract ID from dynamic route
//   const { id } = await ctx.params;

//   if (!id) {
//     return NextResponse.json({ error: "Missing request ID" }, { status: 400 });
//   }

//   try {
//     const { userId } = await auth();

//     if (!userId) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const profile = await prisma.profile.findUnique({
//       where: { clerkId: userId },
//       select: { id: true, gender: true },
//     });

//     if (!profile) {
//       return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
//     }

//     // Body
//     const body = await req.json();
//     const { status } = body;

//     if (!['ACCEPTED', 'DECLINED'].includes(status)) {
//       return NextResponse.json(
//         { error: 'Invalid status. Must be ACCEPTED or DECLINED' },
//         { status: 400 }
//       );
//     }

//     // Fetch current response + related request + donor
//     const response = await prisma.response.findUnique({
//       where: { id },
//       include: {
//         request: {
//           select: {
//             id: true,
//             createdById: true,
//             patientName: true,
//             status: true,
//           },
//         },
//         donor: {
//           select: {
//             id: true,
//             name: true,
//           },
//         },
//       },
//     });

//     if (!response) {
//       return NextResponse.json({ error: 'Response not found' }, { status: 404 });
//     }

//     // Verify user is the request creator
//     if (response.request.createdById !== profile.id) {
//       return NextResponse.json(
//         { error: 'Only the request creator can update response status' },
//         { status: 403 }
//       );
//     }

//     // Request must be active
//     if (response.request.status !== 'ACTIVE') {
//       return NextResponse.json(
//         { error: 'This request is no longer active' },
//         { status: 400 }
//       );
//     }

//     // ACCEPT FLOW
//     if (status === 'ACCEPTED') {
//       await prisma.$transaction(async (tx) => {
//         // 1. Accept selected response
//         await tx.response.update({
//           where: { id },
//           data: { status: 'ACCEPTED' },
//         });

//         // 2. Update donor last donation
//         await tx.profile.update({
//           where: { id: response.donor.id },
//           data: { lastDonationDate: new Date() },
//         });

//         // 3. Create donation record
//         await tx.donation.create({
//           data: {
//             donorId: response.donor.id,
//             requestId: response.request.id,
//             donationDate: new Date(),
//             unitsDonated: 1,
//           },
//         });

//         // 4. Fulfill request
//         await tx.request.update({
//           where: { id: response.request.id },
//           data: { status: 'FULFILLED', fulfilledAt: new Date() },
//         });

//         // 5. Decline all other pending responses
//         await tx.response.updateMany({
//           where: {
//             requestId: response.request.id,
//             id: { not: id },
//             status: 'PENDING',
//           },
//           data: { status: 'DECLINED' },
//         });
//       });

//       return NextResponse.json({
//         success: true,
//         message: `Response accepted. Request fulfilled by ${response.donor.name}.`,
//         response: {
//           id: response.id,
//           status: 'ACCEPTED',
//           donorName: response.donor.name,
//         },
//       });
//     }

//     // DECLINE FLOW
//     const updatedResponse = await prisma.response.update({
//       where: { id },
//       data: { status: 'DECLINED' },
//     });

//     return NextResponse.json({
//       success: true,
//       message: 'Response declined',
//       response: updatedResponse,
//     });
//   } catch (error) {
//     console.error('Update response error:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }







// export async function DELETE(
//   req: Request,
//   ctx: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id } = await ctx.params;

//     if (!id) {
//       return NextResponse.json({ error: "Missing response ID" }, { status: 400 });
//     }

//     const { userId } = await auth();

//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const profile = await prisma.profile.findUnique({
//       where: { clerkId: userId },
//       select: { id: true },
//     });

//     if (!profile) {
//       return NextResponse.json({ error: "Profile not found" }, { status: 404 });
//     }

//     const response = await prisma.response.findUnique({
//       where: { id },
//       select: {
//         donorId: true,
//         status: true,
//       },
//     });

//     if (!response) {
//       return NextResponse.json({ error: "Response not found" }, { status: 404 });
//     }

//     // Only the donor can delete their own response
//     if (response.donorId !== profile.id) {
//       return NextResponse.json(
//         { error: "You can only delete your own responses" },
//         { status: 403 }
//       );
//     }

//     // Cannot delete accepted responses
//     if (response.status === "ACCEPTED") {
//       return NextResponse.json(
//         { error: "Cannot cancel an accepted response" },
//         { status: 400 }
//       );
//     }

//     await prisma.response.delete({
//       where: { id },
//     });

//     return NextResponse.json({
//       success: true,
//       message: "Response cancelled",
//     });
//   } catch (error) {
//     console.error("Delete response error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }





























// app/api/responses/[id]/route.ts
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  // Extract ID from dynamic route
  const { id } = await ctx.params;

  if (!id) {
    return NextResponse.json({ error: "Missing request ID" }, { status: 400 });
  }

  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: { clerkId: userId },
      select: { id: true, gender: true },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Body
    const body = await req.json();
    const { status } = body;

    if (!['ACCEPTED', 'DECLINED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be ACCEPTED or DECLINED' },
        { status: 400 }
      );
    }

    // Fetch current response + related request + donor
    const response = await prisma.response.findUnique({
      where: { id },
      include: {
        request: {
          select: {
            id: true,
            createdById: true,
            patientName: true,
            status: true,
            unitsNeeded: true, // ✅ ADDED: Get units needed from request
          },
        },
        donor: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!response) {
      return NextResponse.json({ error: 'Response not found' }, { status: 404 });
    }

    // Verify user is the request creator
    if (response.request.createdById !== profile.id) {
      return NextResponse.json(
        { error: 'Only the request creator can update response status' },
        { status: 403 }
      );
    }

    // Request must be active
    if (response.request.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'This request is no longer active' },
        { status: 400 }
      );
    }

    // ACCEPT FLOW
    if (status === 'ACCEPTED') {
      await prisma.$transaction(async (tx) => {
        // 1. Accept selected response
        await tx.response.update({
          where: { id },
          data: { status: 'ACCEPTED' },
        });

        // 2. Update donor last donation
        await tx.profile.update({
          where: { id: response.donor.id },
          data: { lastDonationDate: new Date() },
        });

        // 3. Create donation record with ACTUAL units needed
        // ✅ FIXED: Use unitsNeeded from the request instead of hardcoded 1
        await tx.donation.create({
          data: {
            donorId: response.donor.id,
            requestId: response.request.id,
            donationDate: new Date(),
            unitsDonated: response.request.unitsNeeded, // ✅ Dynamic units!
          },
        });

        // 4. Fulfill request
        await tx.request.update({
          where: { id: response.request.id },
          data: { status: 'FULFILLED', fulfilledAt: new Date() },
        });

        // 5. Decline all other pending responses
        await tx.response.updateMany({
          where: {
            requestId: response.request.id,
            id: { not: id },
            status: 'PENDING',
          },
          data: { status: 'DECLINED' },
        });
      });

      return NextResponse.json({
        success: true,
        message: `Response accepted. Request fulfilled by ${response.donor.name}.`,
        response: {
          id: response.id,
          status: 'ACCEPTED',
          donorName: response.donor.name,
          unitsDonated: response.request.unitsNeeded, // ✅ Include units in response
        },
      });
    }

    // DECLINE FLOW
    const updatedResponse = await prisma.response.update({
      where: { id },
      data: { status: 'DECLINED' },
    });

    return NextResponse.json({
      success: true,
      message: 'Response declined',
      response: updatedResponse,
    });
  } catch (error) {
    console.error('Update response error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


export async function DELETE(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;

    if (!id) {
      return NextResponse.json({ error: "Missing response ID" }, { status: 400 });
    }

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const response = await prisma.response.findUnique({
      where: { id },
      select: {
        donorId: true,
        status: true,
      },
    });

    if (!response) {
      return NextResponse.json({ error: "Response not found" }, { status: 404 });
    }

    // Only the donor can delete their own response
    if (response.donorId !== profile.id) {
      return NextResponse.json(
        { error: "You can only delete your own responses" },
        { status: 403 }
      );
    }

    // Cannot delete accepted responses
    if (response.status === "ACCEPTED") {
      return NextResponse.json(
        { error: "Cannot cancel an accepted response" },
        { status: 400 }
      );
    }

    await prisma.response.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Response cancelled",
    });
  } catch (error) {
    console.error("Delete response error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
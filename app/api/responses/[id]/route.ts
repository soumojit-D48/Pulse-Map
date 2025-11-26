

// app/api/responses/[id]/route.ts
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


// PATCH - Accept/Decline response (for request creator)
export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
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

    const body = await req.json();
    const { status } = body;

    if (!['ACCEPTED', 'DECLINED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be ACCEPTED or DECLINED' },
        { status: 400 }
      );
    }

    const response = await prisma.response.findUnique({
      where: { id },
      include: {
        request: {
          select: {
            id: true,
            createdById: true,
            patientName: true,
            status: true,
            unitsNeeded: true,
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
        await tx.response.update({
          where: { id },
          data: { status: 'ACCEPTED' },
        });

        await tx.profile.update({
          where: { id: response.donor.id },
          data: { lastDonationDate: new Date() },
        });

        await tx.donation.create({
          data: {
            donorId: response.donor.id,
            requestId: response.request.id,
            donationDate: new Date(),
            unitsDonated: response.request.unitsNeeded,
          },
        });

        await tx.request.update({
          where: { id: response.request.id },
          data: { status: 'FULFILLED', fulfilledAt: new Date() },
        });

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
          unitsDonated: response.request.unitsNeeded,
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


// PUT - Edit response message (for donor)
export async function PUT(
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

    const body = await req.json();
    const { message } = body;

    if (message === undefined) {
      return NextResponse.json(
        { error: "Message field is required" },
        { status: 400 }
      );
    }

    // Validate message length (optional)
    if (message && message.length > 500) {
      return NextResponse.json(
        { error: "Message is too long (max 500 characters)" },
        { status: 400 }
      );
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

    // Only the donor can edit their own response
    if (response.donorId !== profile.id) {
      return NextResponse.json(
        { error: "You can only edit your own responses" },
        { status: 403 }
      );
    }

    // Cannot edit accepted responses
    if (response.status === "ACCEPTED") {
      return NextResponse.json(
        { error: "Cannot edit an accepted response" },
        { status: 400 }
      );
    }

    // Update the message
    const updatedResponse = await prisma.response.update({
      where: { id },
      data: { message },
    });

    return NextResponse.json({
      success: true,
      message: "Response message updated successfully",
      response: updatedResponse,
    });
  } catch (error) {
    console.error("Edit response error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


// DELETE - Cancel response (for donor)
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
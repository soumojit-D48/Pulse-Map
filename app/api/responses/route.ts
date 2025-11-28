

// app/api/responses/route.ts
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import  {prisma}  from '@/lib/prisma';
import { z } from 'zod';
import { sendEmail } from '@/lib/services/emailService';

const createResponseSchema = z.object({
  requestId: z.string(),
  message: z.string().max(500).optional(),
});

// POST - Create response (donor responds to request)
export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: { clerkId: userId },
      select: { 
        id: true,
        name: true,
        bloodGroup: true,
      },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const body = await req.json();
    const { requestId, message } = createResponseSchema.parse(body);

    // Check if request exists and is active
    const request = await prisma.request.findUnique({
      where: { id: requestId },
      select: {
        id: true,
        status: true,
        createdById: true,
        patientName: true,
        bloodGroup: true,
        createdBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!request) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    if (request.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'This request is no longer active' },
        { status: 400 }
      );
    }

    // Check if user is trying to respond to their own request
    if (request.createdById === profile.id) {
      return NextResponse.json(
        { error: 'You cannot respond to your own request' },
        { status: 400 }
      );
    }

    // Check if user has already responded
    const existingResponse = await prisma.response.findUnique({
      where: {
        requestId_donorId: {
          requestId,
          donorId: profile.id,
        },
      },
    });

    if (existingResponse) {
      return NextResponse.json(
        { error: 'You have already responded to this request' },
        { status: 400 }
      );
    }

    // Create response
    const response = await prisma.response.create({
      data: {
        requestId,
        donorId: profile.id,
        message: message || null,
        status: 'PENDING',
      },
      include: {
        donor: {
          select: {
            name: true,
            bloodGroup: true,
            phone: true,
          },
        },
      },
    });
    
    // notification to request creator
    if (request.createdBy.email) {
      sendEmail({
        to: request.createdBy.email,
        type: 'REQUEST_RESPONSE',
        data: {
          userName: request.createdBy.name,
          patientName: request.patientName,
          donorName: profile.name,
          bloodGroup: request.bloodGroup,
          responseMessage: message,
          requestId: request.id,
        },
      }).catch((error) => {
        console.error('Failed to send email notification:', error);
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Response submitted successfully',
        response: {
          id: response.id,
          donorName: response.donor.name,
          bloodGroup: response.donor.bloodGroup,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create response error:', error);

    // if (error instanceof z.ZodError) {
    //   return NextResponse.json(
    //     { error: 'Invalid data', details: error.errors },
    //     { status: 400 }
    //   );
    // }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Get user's responses
export async function GET() { 
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const responses = await prisma.response.findMany({
      where: { donorId: profile.id },
      include: {
        request: {
          include: {
            createdBy: {
              select: {
                name: true,
                phone: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ responses });
  } catch (error) {
    console.error('Fetch responses error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}




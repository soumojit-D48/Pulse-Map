



// app/api/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { completeProfileSchema } from '@/lib/validations/profile';
import { z } from 'zod';

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await req.json();

    // Validate data
    const validatedData = completeProfileSchema.parse({
      name: body.name,
      phone: body.phone,
      age: body.age,
      gender: body.gender,
      bloodGroup: body.bloodGroup,
      lastDonationDate: body.lastDonationDate ? new Date(body.lastDonationDate) : null,
      state: body.state,
      city: body.city,
      latitude: body.latitude,
      longitude: body.longitude,
      locationName: body.locationName,
      available: body.available,
    });

    // Check if profile already exists
    const existingProfile = await prisma.profile.findUnique({
      where: { clerkId: userId },
    });

    if (existingProfile) {
      return NextResponse.json(
        { error: 'Profile already exists' },
        { status: 400 }
      );
    }

    // Create profile
    const profile = await prisma.profile.create({
      data: {
        clerkId: userId,
        email: body.email,
        name: validatedData.name,
        phone: validatedData.phone,
        bloodGroup: validatedData.bloodGroup,
        age: validatedData.age,
        gender: validatedData.gender,
        state: validatedData.state,
        city: validatedData.city,
        latitude: validatedData.latitude,
        longitude: validatedData.longitude,
        locationName: validatedData.locationName,
        available: validatedData.available,
        lastDonationDate: validatedData.lastDonationDate,
        profileCompleted: true,
      },
    });

    return NextResponse.json(
      { 
        message: 'Profile created successfully',
        profile: {
          id: profile.id,
          name: profile.name,
          bloodGroup: profile.bloodGroup,
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Profile creation error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation error',
          details: error.issues 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch user profile
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const profile = await prisma.profile.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        bloodGroup: true,
        age: true,
        gender: true,
        state: true,
        city: true,
        locationName: true,
        available: true,
        lastDonationDate: true,
        profileCompleted: true,
        createdAt: true,
      },
    });

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ profile });

  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
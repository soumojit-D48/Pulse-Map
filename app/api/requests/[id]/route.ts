
// app/api/requests/[id]/route.ts
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';



// export async function GET(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   console.log("PARAM ID:", params.id); // Should print your ID

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;  // REQUIRED in Next.js 15+  
  console.log("PARAM ID:", id);

  if (!id) {
    return NextResponse.json({ error: "Missing request ID" }, { status: 400 });
  }
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    })

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const request = await prisma.request.findUnique({
      // where: { id: params?.id },
      where: { id },
      // where: { id: "cmi8lmvr40001wxyghpfrex8o" },
      // where:{id: "cmi8lmvr40001wxyghpfrex8o"},
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        },
        responses: {
          include: {
            donor: {
              select: {
                id: true,
                name: true,
                phone: true,
                bloodGroup: true,

              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    console.log(request, "jsahdhb");
    

    if (!request) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }


    // Check if user is the creator or a responder
    const isCreator = request.createdById === profile.id;
    const hasResponded = request.responses.some(
      (response) => response.donorId === profile.id
    );

    // if (!isCreator && !hasResponded) {
    //   // User can still view if they want to respond
    //   // Don't restrict viewing for now
    // }
    return NextResponse.json({
      request,
      isCreator,
      hasResponded,
    });




  } catch (error) {
    console.error('Fetch request error:', error);
    console.error("GET /requests/[id] ERROR:", error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );

  }
}



export async function PATCH(
  req: Request,
  ctx: {params: Promise<{id: string}>}
) {
  const {id} = await ctx.params
  console.log(id, "patchhhh");

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
      select: { id: true },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const body = await req.json();
    const { status } = body;

    // Verify ownership
    const request = await prisma.request.findUnique({
      where: { id },
      select: { createdById: true },
    });

    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    if (request.createdById !== profile.id) {
      return NextResponse.json(
        { error: "You can only update your own requests" },
        { status: 403 }
      );
    }

    const updatedRequest = await prisma.request.update({
      where: { id },
      data: {
        status,
        fulfilledAt: status === "FULFILLED" ? new Date() : null,
      },
    });

    return NextResponse.json({
      success: true,
      request: updatedRequest,
    });
  } catch (error) {
    console.error("PATCH /requests/[id] ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}








// DELETE - Delete request
export async function DELETE(
  req: Request,
  ctx: {params: Promise<{id: string}>}
) {

  const {id} = await ctx.params
    // console.log(id, "deleteee");

    if(!id) {
    return NextResponse.json({ error: "Missing request ID" }, { status: 400 });

    }
  try {

    const {userId} = await auth();

    if(!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const profile = await prisma.profile.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Verify ownership
    const request = await prisma.request.findUnique({
      where: { id },
      select: { createdById: true },
    });

    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    if (request.createdById !== profile.id) {
      return NextResponse.json(
        { error: "You can only delete your own requests" },
        { status: 403 }
      );
    }

    await prisma.request.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Request deleted",
    });
  } catch (error) {
    console.error("DELETE /requests/[id] ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

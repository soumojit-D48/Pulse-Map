

import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import Sidebar from '@/components/layoutComp/Sidebar';
import Header from '@/components/dashboard/Header';
import MobileNav from '@/components/layoutComp/MobileNav';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Fetch user profile
  const profile = await prisma.profile.findUnique({
    where: { clerkId: userId },
    select: {
      id: true,
      name: true,
      bloodGroup: true,
      available: true,
      avatarUrl: true,
      profileCompleted: true,
    },
  });

  if (!profile || !profile.profileCompleted) {
    redirect('/profile/complete');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <Sidebar profile={profile} />

      {/* Main Content Area */}
      <div className="lg:pl-64">
        {/* Header */}
        <Header profile={profile} />

        {/* Page Content */}
        <main className="py-6 px-4 sm:px-6 lg:px-8 pb-20 lg:pb-6">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
}









// components/dashboard/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, FileText, Heart, User, Menu, X, Plus } from 'lucide-react';
import { useState } from 'react';
import BloodGroupBadge from '../dashboard/BloodGroupBadge';

interface SidebarProps {
  profile: {
    name: string;
    bloodGroup: string;
    available: boolean;
    avatarUrl?: string | null;
  };
}

const navigation = [
  { name: 'Dashboard', href: '/home', icon: Home },
  { name: 'Find Donors', href: '/donors', icon: Users },
  { name: 'My Requests', href: '/requests', icon: FileText },
  { name: 'Donations', href: '/donation-history', icon: Heart },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Create Request', href: '/requests/new', icon: Plus },

];

export default function Sidebar({ profile }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-card shadow-soft"
      >
        {mobileOpen ? <X size={22} /> : <Menu size={24} />}
      </button>

      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border 
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-glow">
                <Heart className="w-5 h-5 text-primary-foreground fill-current" />
              </div>
              <span className="text-xl font-bold text-card-foreground">Pulse Map</span>
            </div>
          </div>

          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-primary font-semibold text-lg">
                    {profile.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-card-foreground truncate">
                  {profile.name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <BloodGroupBadge bloodGroup={profile.bloodGroup} size="sm" />
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${profile.available
                        ? 'bg-accent/10 text-accent'
                        : 'bg-muted text-muted-foreground'
                      }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${profile.available ? 'bg-accent' : 'bg-muted-foreground'
                        }`}
                    />
                    {profile.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                    transition-colors duration-150
                    ${isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }
                  `}
                >
                  <item.icon
                    size={20}
                    className={isActive ? 'text-primary' : 'text-muted-foreground'}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-border">
            <div className="bg-primary/10 rounded-lg p-3">
              <p className="text-xs font-medium text-primary mb-1">
                🩸 Save Lives Today
              </p>
              <p className="text-xs text-primary">
                Your donation can save up to 3 lives
              </p>
            </div>
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-30"
        />
      )}
    </>
  );
}












// // components/dashboard/Sidebar.tsx
// 'use client';

// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { Home, Users, FileText, Heart, User, Menu, X } from 'lucide-react';
// import { useState } from 'react';
// import BloodGroupBadge from '../dashboard/BloodGroupBadge';

// interface SidebarProps {
//   profile: {
//     name: string;
//     bloodGroup: string;
//     available: boolean;
//     avatarUrl?: string | null;
//   };
// }

// const navigation = [
//   { name: 'Dashboard', href: '/home', icon: Home },
//   { name: 'Find Donors', href: '/donors', icon: Users },
//   { name: 'My Requests', href: '/requests', icon: FileText },
//   { name: 'Donations', href: '/donations', icon: Heart },
//   { name: 'Profile', href: '/profile', icon: User },
// ];

// export default function Sidebar({ profile }: SidebarProps) {
//   const pathname = usePathname();
//   const [mobileOpen, setMobileOpen] = useState(false);

//   return (
//     <>
//       {/* Mobile menu button */}
//       <button
//         onClick={() => setMobileOpen(!mobileOpen)}
//         className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg"
//       >
//         {mobileOpen ? <X size={22} /> : <Menu size={24} />}
//       </button>

//       {/* Sidebar */}
//       <aside
//         className={`
//           fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 
//           transform transition-transform duration-300 ease-in-out
//           lg:translate-x-0
//           ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
//         `}
//       >
//         <div className="flex flex-col h-full">
//           {/* Logo */}
//           <div className="flex items-center justify-center h-16 border-b border-gray-200">
//             <div className="flex items-center gap-2">
//               <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
//                 <Heart className="w-5 h-5 text-white fill-current" />
//               </div>
//               <span className="text-xl font-bold text-gray-900">Pulse Map</span>
//             </div>
//           </div>

//           {/* User Info */}
//           <div className="p-4 border-b border-gray-200">
//             <div className="flex items-center gap-3">
//               <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
//                 {profile.avatarUrl ? (
//                   <img
//                     src={profile.avatarUrl}
//                     alt={profile.name}
//                     className="w-12 h-12 rounded-full object-cover"
//                   />
//                 ) : (
//                   <span className="text-red-600 font-semibold text-lg">
//                     {profile.name.charAt(0).toUpperCase()}
//                   </span>
//                 )}
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-medium text-gray-900 truncate">
//                   {profile.name}
//                 </p>
//                 <div className="flex items-center gap-2 mt-1">
//                   <BloodGroupBadge bloodGroup={profile.bloodGroup} size="sm" />
//                   <span
//                     className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${profile.available
//                         ? 'bg-green-100 text-green-800'
//                         : 'bg-gray-100 text-gray-800'
//                       }`}
//                   >
//                     <span
//                       className={`w-1.5 h-1.5 rounded-full ${profile.available ? 'bg-green-600' : 'bg-gray-600'
//                         }`}
//                     />
//                     {profile.available ? 'Available' : 'Unavailable'}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Navigation */}
//           <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
//             {navigation.map((item) => {
//               const isActive = pathname === item.href;
//               return (
//                 <Link
//                   key={item.name}
//                   href={item.href}
//                   onClick={() => setMobileOpen(false)}
//                   className={`
//                     flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
//                     transition-colors duration-150
//                     ${isActive
//                       ? 'bg-red-50 text-red-600'
//                       : 'text-gray-700 hover:bg-gray-100'
//                     }
//                   `}
//                 >
//                   <item.icon
//                     size={20}
//                     className={isActive ? 'text-red-600' : 'text-gray-500'}
//                   />
//                   {item.name}
//                 </Link>
//               );
//             })}
//           </nav>

//           {/* Footer */}
//           <div className="p-4 border-t border-gray-200">
//             <div className="bg-red-50 rounded-lg p-3">
//               <p className="text-xs font-medium text-red-900 mb-1">
//                 🩸 Save Lives Today
//               </p>
//               <p className="text-xs text-red-700">
//                 Your donation can save up to 3 lives
//               </p>
//             </div>
//           </div>
//         </div>
//       </aside>

//       {/* Mobile overlay */}
//       {mobileOpen && (
//         <div
//           onClick={() => setMobileOpen(false)}
//           className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
//         />
//       )}
//     </>
//   );
// }







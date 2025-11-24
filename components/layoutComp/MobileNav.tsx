

// // components/dashboard/MobileNav.tsx
// 'use client';

// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { Home, Users, FileText, Heart, User } from 'lucide-react';

// const navigation = [
//   { name: 'Home', href: '/home', icon: Home },
//   { name: 'Donors', href: '/donors', icon: Users },
//   { name: 'Requests', href: '/requests', icon: FileText },
//   { name: 'Donations', href: '/donations', icon: Heart },
//   { name: 'Profile', href: '/profile', icon: User },
// ];

// export default function MobileNav() {
//   const pathname = usePathname();

//   return (
//     <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
//       <div className="grid grid-cols-5 h-16">
//         {navigation.map((item) => {
//           const isActive = pathname === item.href;
//           return (
//             <Link
//               key={item.name}
//               href={item.href}
//               className={`
//                 flex flex-col items-center justify-center gap-1
//                 transition-colors duration-150
//                 ${isActive ? 'text-red-600' : 'text-gray-600'}
//               `}
//             >
//               <item.icon
//                 size={22}
//                 className={isActive ? 'text-red-600' : 'text-gray-500'}
//               />
//               <span className="text-xs font-medium">{item.name}</span>
//             </Link>
//           );
//         })}
//       </div>
//     </nav>
//   );
// }
























// components/dashboard/MobileNav.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, FileText, Heart, User, Plus } from 'lucide-react';

const navigation = [
  { name: 'Home', href: '/home', icon: Home },
  { name: 'Donors', href: '/donors', icon: Users },
  { name: 'Create ', href: '/requests/new', icon: Plus },
  { name: 'Requests', href: '/requests', icon: FileText },
  { name: 'Donations', href: '/donation-history', icon: Heart },
  { name: 'Profile', href: '/profile', icon: User },
    
  
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40 backdrop-blur-md">
      <div className="grid grid-cols-6 h-16">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex flex-col items-center justify-center gap-1
                transition-all duration-150
                ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}
              `}
            >
              <item.icon
                size={14}
                className={`transition-transform ${isActive ? 'scale-110' : ''}`}
              />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
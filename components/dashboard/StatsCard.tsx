
// // components/dashboard/StatsCard.tsx
// import { LucideIcon } from 'lucide-react';

// interface StatsCardProps {
//   title: string;
//   value: string | number;
//   icon: LucideIcon;
//   iconBgColor: string;
//   iconColor: string;
//   trend?: {
//     value: string;
//     positive: boolean;
//   };
// }

// export default function StatsCard({
//   title,
//   value,
//   icon: Icon,
//   iconBgColor,
//   iconColor,
//   trend,
// }: StatsCardProps) {
//   return (
//     <div className="bg-white rounded-lg shadow p-6">
//       <div className="flex items-center justify-between">
//         <div className="flex-1">
//           <p className="text-sm font-medium text-gray-600">{title}</p>
//           <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
//           {trend && (
//             <p
//               className={`text-sm mt-2 ${
//                 trend.positive ? 'text-green-600' : 'text-red-600'
//               }`}
//             >
//               {trend.positive ? '↑' : '↓'} {trend.value}
//             </p>
//           )}
//         </div>
//         <div
//           className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconBgColor}`}
//         >
//           <Icon size={24} className={iconColor} />
//         </div>
//       </div>
//     </div>
//   );
// }














// // components/dashboard/StatsCard.tsx
// import { LucideIcon } from 'lucide-react';

// interface StatsCardProps {
//   title: string;
//   value: string | number;
//   icon: LucideIcon;
//   iconBgColor: string;
//   iconColor: string;
//   trend?: {
//     value: string;
//     positive: boolean;
//   };
// }

// export default function StatsCard({
//   title,
//   value,
//   icon: Icon,
//   iconBgColor,
//   iconColor,
//   trend,
// }: StatsCardProps) {
//   return (
//     <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-200">
//       <div className="flex items-center justify-between">
//         <div className="flex-1">
//           <p className="text-sm font-medium text-gray-600">{title}</p>
//           <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
//           {trend && (
//             <p
//               className={`text-sm mt-2 font-medium ${
//                 trend.positive ? 'text-green-600' : 'text-red-600'
//               }`}
//             >
//               {trend.positive ? '↑' : '↓'} {trend.value}
//             </p>
//           )}
//         </div>
//         <div
//           className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconBgColor} shrink-0`}
//         >
//           <Icon size={24} className={iconColor} />
//         </div>
//       </div>
//     </div>
//   );
// }














// components/dashboard/StatsCard.tsx
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  trend?: {
    value: string;
    positive: boolean;
  };
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  iconBgColor,
  iconColor,
  trend,
}: StatsCardProps) {
  return (
    <div className="bg-card rounded-lg shadow-soft p-6 hover:shadow-glow transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-card-foreground mt-2">{value}</p>
          {trend && (
            <p
              className={`text-sm mt-2 font-medium ${
                trend.positive ? 'text-accent' : 'text-destructive'
              }`}
            >
              {trend.positive ? '↑' : '↓'} {trend.value}
            </p>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconBgColor} shrink-0`}
        >
          <Icon size={24} className={iconColor} />
        </div>
      </div>
    </div>
  );
}

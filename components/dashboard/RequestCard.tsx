

// // components/dashboard/RequestCard.tsx
// import Link from 'next/link';
// import BloodGroupBadge from './BloodGroupBadge'
// import UrgencyBadge from './UrgencyBadge';
// import { MapPin, Clock, Phone } from 'lucide-react';
// import { formatDistance } from '@/lib/utils/distance';

// interface RequestCardProps {
//   request: {
//     id: string;
//     patientName: string;
//     bloodGroup: string;
//     urgency: string;
//     unitsNeeded: number;
//     hospitalName?: string | null;
//     patientLocationName: string;
//     distance: number;
//     createdAt: Date;
//     responseCount: number;
//     canUserDonate: boolean;
//   };
// }

// export default function RequestCard({ request }: RequestCardProps) {
//   const timeAgo = getTimeAgo(new Date(request.createdAt));

//   return (
//     <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
//       <div className="flex items-start justify-between mb-3">
//         <div className="flex items-center gap-3">
//           <BloodGroupBadge bloodGroup={request.bloodGroup} size="lg" />
//           <div>
//             <h3 className="font-semibold text-gray-900">{request.patientName}</h3>
//             <p className="text-sm text-gray-600">
//               {request.unitsNeeded} {request.unitsNeeded === 1 ? 'unit' : 'units'} needed
//             </p>
//           </div>
//         </div>
//         <UrgencyBadge urgency={request.urgency} />
//       </div>

//       <div className="space-y-2 mb-4">
//         {request.hospitalName && (
//           <div className="flex items-center gap-2 text-sm text-gray-600">
//             <span className="text-lg">🏥</span>
//             <span>{request.hospitalName}</span>
//           </div>
//         )}

//         <div className="flex items-center gap-2 text-sm text-gray-600">
//           <MapPin size={16} />
//           <span>{request.patientLocationName}</span>
//           <span className="text-red-600 font-medium">
//             • {formatDistance(request.distance)} away
//           </span>
//         </div>

//         <div className="flex items-center gap-2 text-sm text-gray-500">
//           <Clock size={16} />
//           <span>{timeAgo}</span>
//           {request.responseCount > 0 && (
//             <span className="ml-auto text-green-600 font-medium">
//               {request.responseCount} {request.responseCount === 1 ? 'response' : 'responses'}
//             </span>
//           )}
//         </div>
//       </div>

//       <div className="flex gap-2">
//         <Link
//           href={`/requests/${request.id}`}
//           className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 text-center rounded-lg font-medium hover:bg-gray-200 transition"
//         >
//           View Details
//         </Link>
//         {request.canUserDonate && (
//           <Link
//             href={`/requests/${request.id}`}
//             className="flex-1 px-4 py-2 bg-red-600 text-white text-center rounded-lg font-medium hover:bg-red-700 transition"
//           >
//             I Can Donate
//           </Link>
//         )}
//       </div>
//     </div>
//   );
// }

// function getTimeAgo(date: Date): string {
//   const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

//   if (seconds < 60) return 'Just now';
//   if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
//   if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
//   return `${Math.floor(seconds / 86400)} days ago`;
// }















// // components/dashboard/RequestCard.tsx
// import Link from 'next/link';
// import BloodGroupBadge from './BloodGroupBadge'
// import UrgencyBadge from './UrgencyBadge';
// import { MapPin, Clock } from 'lucide-react';
// import { formatDistance } from '@/lib/utils/distance';

// interface RequestCardProps {
//   request: {
//     id: string;
//     patientName: string;
//     bloodGroup: string;
//     urgency: string;
//     unitsNeeded: number;
//     hospitalName?: string | null;
//     patientLocationName: string;
//     distance: number;
//     createdAt: Date;
//     responseCount: number;
//     canUserDonate: boolean;
//   };
// }

// export default function RequestCard({ request }: RequestCardProps) {
//   const timeAgo = getTimeAgo(new Date(request.createdAt));

//   return (
//     <div className="bg-card border border-border rounded-lg p-4 hover:shadow-soft transition">
//       <div className="flex items-start justify-between mb-3">
//         <div className="flex items-center gap-3">
//           <BloodGroupBadge bloodGroup={request.bloodGroup} size="lg" />
//           <div>
//             <h3 className="font-semibold text-card-foreground">{request.patientName}</h3>
//             <p className="text-sm text-muted-foreground">
//               {request.unitsNeeded} {request.unitsNeeded === 1 ? 'unit' : 'units'} needed
//             </p>
//           </div>
//         </div>
//         <UrgencyBadge urgency={request.urgency} />
//       </div>

//       <div className="space-y-2 mb-4">
//         {request.hospitalName && (
//           <div className="flex items-center gap-2 text-sm text-muted-foreground">
//             <span className="text-lg">🏥</span>
//             <span>{request.hospitalName}</span>
//           </div>
//         )}

//         <div className="flex items-center gap-2 text-sm text-muted-foreground">
//           <MapPin size={16} />
//           <span>{request.patientLocationName}</span>
//           <span className="text-primary font-medium">
//             • {formatDistance(request.distance)} away
//           </span>
//         </div>

//         <div className="flex items-center gap-2 text-sm text-muted-foreground">
//           <Clock size={16} />
//           <span>{timeAgo}</span>
//           {request.responseCount > 0 && (
//             <span className="ml-auto text-accent font-medium">
//               {request.responseCount} {request.responseCount === 1 ? 'response' : 'responses'}
//             </span>
//           )}
//         </div>
//       </div>

//       <div className="flex gap-2">
//         <Link
//           href={`/requests/${request.id}`}
//           className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground text-center rounded-lg font-medium hover:bg-muted transition"
//         >
//           View Details
//         </Link>
//         {request.canUserDonate && (
//           <Link
//             href={`/requests/${request.id}`}
//             className="flex-1 px-4 py-2 bg-primary text-primary-foreground text-center rounded-lg font-medium hover:opacity-90 transition shadow-glow"
//           >
//             I Can Donate
//           </Link>
//         )}
//       </div>
//     </div>
//   );
// }

// function getTimeAgo(date: Date): string {
//   const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

//   if (seconds < 60) return 'Just now';
//   if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
//   if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
//   return `${Math.floor(seconds / 86400)} days ago`;
// }






















// // components/dashboard/RequestCard.tsx
// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import BloodGroupBadge from './BloodGroupBadge';
// import UrgencyBadge from './UrgencyBadge';
// import { MapPin, Clock, Heart } from 'lucide-react';
// import { formatDistance } from '@/lib/utils/distance';
// import QuickDonateModal from '@/components/requests/QuickDonateModal'

// interface RequestCardProps {
//   request: {
//     id: string;
//     patientName: string;
//     bloodGroup: string;
//     urgency: string;
//     unitsNeeded: number;
//     hospitalName?: string | null;
//     patientLocationName: string;
//     distance: number;
//     createdAt: Date;
//     responseCount: number;
//     canUserDonate: boolean;
//   };
//   onResponseSuccess?: () => void;
// }

// export default function RequestCard({ request, onResponseSuccess }: RequestCardProps) {
//   const [showModal, setShowModal] = useState(false);
//   const timeAgo = getTimeAgo(new Date(request.createdAt));

//   const handleModalSuccess = () => {
//     onResponseSuccess?.();
//   };

//   return (
//     <>
//       <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
//         <div className="flex items-start justify-between mb-3">
//           <div className="flex items-center gap-3">
//             <BloodGroupBadge bloodGroup={request.bloodGroup} size="lg" />
//             <div>
//               <h3 className="font-semibold text-gray-900">{request.patientName}</h3>
//               <p className="text-sm text-gray-600">
//                 {request.unitsNeeded} {request.unitsNeeded === 1 ? 'unit' : 'units'} needed
//               </p>
//             </div>
//           </div>
//           <UrgencyBadge urgency={request.urgency} />
//         </div>

//         <div className="space-y-2 mb-4">
//           {request.hospitalName && (
//             <div className="flex items-center gap-2 text-sm text-gray-600">
//               <span className="text-lg">🏥</span>
//               <span>{request.hospitalName}</span>
//             </div>
//           )}
          
//           <div className="flex items-center gap-2 text-sm text-gray-600">
//             <MapPin size={16} />
//             <span className="flex-1 truncate">{request.patientLocationName}</span>
//             <span className="text-red-600 font-medium shrink-0">
//               • {formatDistance(request.distance)} away
//             </span>
//           </div>

//           <div className="flex items-center gap-2 text-sm text-gray-500">
//             <Clock size={16} />
//             <span>{timeAgo}</span>
//             {request.responseCount > 0 && (
//               <span className="ml-auto text-green-600 font-medium">
//                 {request.responseCount} {request.responseCount === 1 ? 'response' : 'responses'}
//               </span>
//             )}
//           </div>
//         </div>

//         <div className="flex gap-2">
//           <Link
//             href={`/requests/${request.id}`}
//             className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 text-center rounded-lg font-medium hover:bg-gray-200 transition"
//           >
//             View Details
//           </Link>
//           {request.canUserDonate && (
//             <button
//               onClick={() => setShowModal(true)}
//               className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
//             >
//               <Heart size={16} className="fill-current" />
//               Quick Donate
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Quick Donate Modal */}
//       {request.canUserDonate && (
//         <QuickDonateModal
//           request={request}
//           isOpen={showModal}
//           onClose={() => setShowModal(false)}
//           onSuccess={handleModalSuccess}
//         />
//       )}
//     </>
//   );
// }

// function getTimeAgo(date: Date): string {
//   const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
//   if (seconds < 60) return 'Just now';
//   if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
//   if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
//   return `${Math.floor(seconds / 86400)} days ago`;
// }





















// components/dashboard/RequestCard.tsx
import Link from 'next/link';
import BloodGroupBadge from './BloodGroupBadge'
import UrgencyBadge from './UrgencyBadge';
import { MapPin, Clock } from 'lucide-react';
import { formatDistance } from '@/lib/utils/distance';
import { useState } from 'react';
import QuickDonateModal from '@/components/requests/QuickDonateModal';

interface RequestCardProps {
  request: {
    id: string;
    patientName: string;
    bloodGroup: string;
    urgency: string;
    unitsNeeded: number;
    hospitalName?: string | null;
    patientLocationName: string;
    distance: number;
    createdAt: Date;
    responseCount: number;
    canUserDonate: boolean;
  };
  onResponseSuccess?: () => void;
}

export default function RequestCard({ request, onResponseSuccess }: RequestCardProps) {
  const [showModal, setShowModal] = useState(false);
  const timeAgo = getTimeAgo(new Date(request.createdAt));

  const handleSuccess = () => {
    setShowModal(false);
    if (onResponseSuccess) {
      onResponseSuccess();
    }
  };

  return (
    <>
      <div className="group bg-card border border-border rounded-lg p-4 hover:shadow-hover hover:border-primary/50 transition-all duration-300">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <BloodGroupBadge bloodGroup={request.bloodGroup} size="lg" />
            <div>
              <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
                {request.patientName}
              </h3>
              <p className="text-sm text-muted-foreground">
                {request.unitsNeeded} {request.unitsNeeded === 1 ? 'unit' : 'units'} needed
              </p>
            </div>
          </div>
          <UrgencyBadge urgency={request.urgency} />
        </div>

        <div className="space-y-2 mb-4">
          {request.hospitalName && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="text-lg">🏥</span>
              <span>{request.hospitalName}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin size={16} />
            <span>{request.patientLocationName}</span>
            <span className="text-primary font-medium">
              • {formatDistance(request.distance)} away
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock size={16} />
            <span>{timeAgo}</span>
            {request.responseCount > 0 && (
              <span className="ml-auto text-success font-medium">
                {request.responseCount} {request.responseCount === 1 ? 'response' : 'responses'}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/requests/${request.id}`}
            className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground text-center rounded-lg font-medium hover:bg-muted transition-all"
          >
            View Details
          </Link>
          {request.canUserDonate && (
            <button
              onClick={() => setShowModal(true)}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground text-center rounded-lg font-medium hover:opacity-90 hover:shadow-glow transition-all shadow-glow"
            >
              I Can Donate
            </button>
          )}
        </div>
      </div>

      {showModal && (
        <QuickDonateModal
          request={request}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
}
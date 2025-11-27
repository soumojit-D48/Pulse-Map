


// components/profile/AvailabilityStep.tsx
'use client';

import { useState, useEffect } from 'react';
import { useProfileStore } from '@/store/profileStore';
import { Check, AlertCircle, Droplet, MapPin, User, Phone } from 'lucide-react';

export default function AvailabilityStep() {
  const { formData, updateFormData } = useProfileStore();
  const [available, setAvailable] = useState(formData.available || false);

  useEffect(() => {
    updateFormData({ available });
  }, [available, updateFormData]);

  const bloodGroupLabels: Record<string, string> = {
    A_POSITIVE: 'A+',
    A_NEGATIVE: 'A-',
    B_POSITIVE: 'B+',
    B_NEGATIVE: 'B-',
    AB_POSITIVE: 'AB+',
    AB_NEGATIVE: 'AB-',
    O_POSITIVE: 'O+',
    O_NEGATIVE: 'O-',
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Availability & Review</h2>
        <p className="text-muted-foreground mt-1">Set your availability and review your information</p>
      </div>

      {/* Availability Toggle */}
      <div className="p-6 bg-primary/10 border-2 border-primary/20 rounded-xl">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-foreground mb-2">
              Are you available to donate blood?
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Toggle this on to let people know you're ready to help. You can change this anytime.
            </p>
            
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setAvailable(!available)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all focus:outline-none focus:ring-2 ring-primary focus:ring-offset-2 ${
                  available ? 'bg-success' : 'bg-muted'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-card shadow-soft transition-transform ${
                    available ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${available ? 'text-success' : 'text-muted-foreground'}`}>
                {available ? 'Available to Donate' : 'Not Available'}
              </span>
            </div>
          </div>
          <Droplet className={`w-12 h-12 ${available ? 'text-primary' : 'text-muted-foreground'}`} />
        </div>

        {available && (
          <div className="mt-4 p-3 bg-success/10 border border-success rounded-lg">
            <div className="flex items-start gap-2">
              <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />
              <p className="text-sm text-success">
                Great! You'll receive notifications when someone nearby needs your blood group.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Profile Summary */}
      <div className="border-2 border-border rounded-xl overflow-hidden bg-card">
        <div className="bg-secondary px-6 py-4 border-b border-border">
          <h3 className="text-lg font-bold text-card-foreground">Profile Summary</h3>
          <p className="text-sm text-muted-foreground">Review your information before completing</p>
        </div>

        <div className="p-6 space-y-4">
          {/* Personal Info */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Personal Information</p>
              <p className="font-semibold text-card-foreground">{formData.name || 'Not provided'}</p>
              <p className="text-sm text-muted-foreground">
                {formData.age ? `${formData.age} years` : ''} • {formData.gender || 'Gender not selected'}
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5 text-success" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Contact Number</p>
              <p className="font-semibold text-card-foreground">
                {formData.phone ? `+91 ${formData.phone}` : 'Not provided'}
              </p>
            </div>
          </div>

          {/* Blood Group */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
              <Droplet className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Blood Group</p>
              <p className="font-semibold text-card-foreground text-xl">
                {formData.bloodGroup ? bloodGroupLabels[formData.bloodGroup] : 'Not selected'}
              </p>
              {formData.lastDonationDate && (
                <p className="text-sm text-muted-foreground">
                  Last donated: {new Date(formData.lastDonationDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Location</p>
              {formData.location ? (
                <>
                  <p className="font-semibold text-card-foreground">
                    {formData.location.city}, {formData.location.state}
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {formData.location.locationName}
                  </p>
                </>
              ) : (
                <p className="text-muted-foreground">Location not selected</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Important Notes */}
      <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <div className="text-sm text-destructive">
            <p className="font-medium mb-1">Before you complete:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Your contact number will be visible to people requesting blood</li>
              <li>Your exact location won't be shared, only approximate area</li>
              <li>You can update your availability anytime from your profile</li>
              <li>You'll only receive notifications for your blood group compatibility</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Next Steps Info */}
      <div className="p-4 bg-accent/10 border border-accent rounded-lg">
        <h4 className="font-semibold text-accent mb-2">What happens next?</h4>
        <ul className="text-sm text-accent space-y-1 list-disc list-inside">
          <li>You'll get access to the dashboard and all features</li>
          <li>You can search for blood donors in your area</li>
          <li>Create emergency blood requests when needed</li>
          <li>Track your donation history and impact</li>
        </ul>
      </div>
    </div>
  );
}










// // components/profile/AvailabilityStep.tsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { useProfileStore } from '@/store/profileStore';
// import { Check, AlertCircle, Droplet, MapPin, User, Phone } from 'lucide-react';

// export default function AvailabilityStep() {
//   const { formData, updateFormData } = useProfileStore();
//   const [available, setAvailable] = useState(formData.available || false);

//   useEffect(() => {
//     updateFormData({ available });
//   }, [available, updateFormData]);

//   const bloodGroupLabels: Record<string, string> = {
//     A_POSITIVE: 'A+',
//     A_NEGATIVE: 'A-',
//     B_POSITIVE: 'B+',
//     B_NEGATIVE: 'B-',
//     AB_POSITIVE: 'AB+',
//     AB_NEGATIVE: 'AB-',
//     O_POSITIVE: 'O+',
//     O_NEGATIVE: 'O-',
//   };

//   return (
//     <div className="space-y-6">
//       <div>
//         <h2 className="text-2xl font-bold text-gray-900">Availability & Review</h2>
//         <p className="text-gray-600 mt-1">Set your availability and review your information</p>
//       </div>

//       {/* Availability Toggle */}
//       <div className="p-6 bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 rounded-xl">
//         <div className="flex items-start justify-between">
//           <div className="flex-1">
//             <h3 className="text-lg font-bold text-gray-900 mb-2">
//               Are you available to donate blood?
//             </h3>
//             <p className="text-sm text-gray-600 mb-4">
//               Toggle this on to let people know you're ready to help. You can change this anytime.
//             </p>
            
//             <div className="flex items-center space-x-3">
//               <button
//                 type="button"
//                 onClick={() => setAvailable(!available)}
//                 className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
//                   available ? 'bg-green-600' : 'bg-gray-300'
//                 }`}
//               >
//                 <span
//                   className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${
//                     available ? 'translate-x-7' : 'translate-x-1'
//                   }`}
//                 />
//               </button>
//               <span className={`text-sm font-medium ${available ? 'text-green-700' : 'text-gray-600'}`}>
//                 {available ? 'Available to Donate' : 'Not Available'}
//               </span>
//             </div>
//           </div>
//           <Droplet className={`w-12 h-12 ${available ? 'text-red-500' : 'text-gray-400'}`} />
//         </div>

//         {available && (
//           <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
//             <div className="flex items-start gap-2">
//               <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
//               <p className="text-sm text-green-800">
//                 Great! You'll receive notifications when someone nearby needs your blood group.
//               </p>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Profile Summary */}
//       <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
//         <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
//           <h3 className="text-lg font-bold text-gray-900">Profile Summary</h3>
//           <p className="text-sm text-gray-600">Review your information before completing</p>
//         </div>

//         <div className="p-6 space-y-4">
//           {/* Personal Info */}
//           <div className="flex items-start gap-3">
//             <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
//               <User className="w-5 h-5 text-blue-600" />
//             </div>
//             <div className="flex-1">
//               <p className="text-sm text-gray-600">Personal Information</p>
//               <p className="font-semibold text-gray-900">{formData.name || 'Not provided'}</p>
//               <p className="text-sm text-gray-600">
//                 {formData.age ? `${formData.age} years` : ''} • {formData.gender || 'Gender not selected'}
//               </p>
//             </div>
//           </div>

//           {/* Contact */}
//           <div className="flex items-start gap-3">
//             <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
//               <Phone className="w-5 h-5 text-green-600" />
//             </div>
//             <div className="flex-1">
//               <p className="text-sm text-gray-600">Contact Number</p>
//               <p className="font-semibold text-gray-900">
//                 {formData.phone ? `+91 ${formData.phone}` : 'Not provided'}
//               </p>
//             </div>
//           </div>

//           {/* Blood Group */}
//           <div className="flex items-start gap-3">
//             <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
//               <Droplet className="w-5 h-5 text-red-600" />
//             </div>
//             <div className="flex-1">
//               <p className="text-sm text-gray-600">Blood Group</p>
//               <p className="font-semibold text-gray-900 text-xl">
//                 {formData.bloodGroup ? bloodGroupLabels[formData.bloodGroup] : 'Not selected'}
//               </p>
//               {formData.lastDonationDate && (
//                 <p className="text-sm text-gray-600">
//                   Last donated: {new Date(formData.lastDonationDate).toLocaleDateString()}
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Location */}
//           <div className="flex items-start gap-3">
//             <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
//               <MapPin className="w-5 h-5 text-purple-600" />
//             </div>
//             <div className="flex-1">
//               <p className="text-sm text-gray-600">Location</p>
//               {formData.location ? (
//                 <>
//                   <p className="font-semibold text-gray-900">
//                     {formData.location.city}, {formData.location.state}
//                   </p>
//                   <p className="text-sm text-gray-600 line-clamp-2">
//                     {formData.location.locationName}
//                   </p>
//                 </>
//               ) : (
//                 <p className="text-gray-500">Location not selected</p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Important Notes */}
//       <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
//         <div className="flex items-start gap-2">
//           <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
//           <div className="text-sm text-amber-800">
//             <p className="font-medium mb-1">Before you complete:</p>
//             <ul className="list-disc list-inside space-y-1 ml-2">
//               <li>Your contact number will be visible to people requesting blood</li>
//               <li>Your exact location won't be shared, only approximate area</li>
//               <li>You can update your availability anytime from your profile</li>
//               <li>You'll only receive notifications for your blood group compatibility</li>
//             </ul>
//           </div>
//         </div>
//       </div>

//       {/* Next Steps Info */}
//       <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
//         <h4 className="font-semibold text-blue-900 mb-2">What happens next?</h4>
//         <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
//           <li>You'll get access to the dashboard and all features</li>
//           <li>You can search for blood donors in your area</li>
//           <li>Create emergency blood requests when needed</li>
//           <li>Track your donation history and impact</li>
//         </ul>
//       </div>
//     </div>
//   );
// }
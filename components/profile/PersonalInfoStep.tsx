

// // components/profile/PersonalInfoStep.tsx
// 'use client';

// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { personalInfoSchema, PersonalInfoFormData } from '@/lib/validations/profile';
// import { useProfileStore } from '@/store/profileStore';
// import { useEffect } from 'react';

// export default function PersonalInfoStep() {
//   const { formData, updateFormData, nextStep } = useProfileStore();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     setValue,
//   } = useForm<PersonalInfoFormData>({
//     resolver: zodResolver(personalInfoSchema),
//     defaultValues: {
//       name: formData.name || '',
//       phone: formData.phone || '',
//       age: formData.age || undefined,
//       gender: formData.gender || undefined,
//     },
//   });

//   useEffect(() => {
//     if (formData.name) setValue('name', formData.name);
//     if (formData.phone) setValue('phone', formData.phone);
//     if (formData.age) setValue('age', formData.age);
//     if (formData.gender) setValue('gender', formData.gender);
//   }, [formData, setValue]);

//   const onSubmit = (data: PersonalInfoFormData) => {
//     updateFormData(data);
//     nextStep();
//     // console.log(data, "djbbhjkbkda");
//   };

//   return (
//     <div className="space-y-6">
//       <div>
//         <h2 className="text-2xl font-bold text-foreground">Personal Information</h2>
//         <p className="text-muted-foreground mt-1">Tell us about yourself</p>
//       </div>

//       <form id="personal-info-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
//         {/* Full Name */}
//         <div>
//           <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
//             Full Name <span className="text-destructive">*</span>
//           </label>
//           <input
//             id="name"
//             type="text"
//             {...register('name')}
//             className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 ring-primary focus:border-transparent"
//             placeholder="Enter your full name"
//           />
//           {errors.name && (
//             <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>
//           )}
//         </div>

//         {/* Phone Number */}
//         <div>
//           <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1">
//             Phone Number <span className="text-destructive">*</span>
//           </label>
//           <div className="relative">
//             <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">+91</span>
//             <input
//               id="phone"
//               type="tel"
//               {...register('phone')}
//               className="w-full pl-14 pr-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 ring-primary focus:border-transparent"
//               placeholder="9876543210"
//               maxLength={10}
//             />
//           </div>
//           {errors.phone && (
//             <p className="mt-1 text-sm text-destructive">{errors.phone.message}</p>
//           )}
//           <p className="mt-1 text-xs text-muted-foreground">10-digit Indian mobile number</p>
//         </div>

//         {/* Age */}
//         <div>
//           <label htmlFor="age" className="block text-sm font-medium text-foreground mb-1">
//             Age <span className="text-destructive">*</span>
//           </label>
//           <input
//             id="age"
//             type="number"
//             {...register('age', { valueAsNumber: true })}
//             className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 ring-primary focus:border-transparent"
//             placeholder="Enter your age"
//             min="18"
//             max="65"
//           />
//           {errors.age && (
//             <p className="mt-1 text-sm text-destructive">{errors.age.message}</p>
//           )}
//           <p className="mt-1 text-xs text-muted-foreground">Must be between 18-65 years to donate blood</p>
//         </div>

//         {/* Gender */}
//         <div>
//           <label className="block text-sm font-medium text-foreground mb-3">
//             Gender <span className="text-destructive">*</span>
//           </label>
//           <div className="grid grid-cols-3 gap-3">
//             <label className="flex items-center justify-center px-4 py-3 border-2 border-border rounded-lg cursor-pointer hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/10">
//               <input
//                 type="radio"
//                 value="MALE"
//                 {...register('gender')}
//                 className="sr-only"
//               />
//               <span className="text-sm font-medium text-foreground">Male</span>
//             </label>

//             <label className="flex items-center justify-center px-4 py-3 border-2 border-border rounded-lg cursor-pointer hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/10">
//               <input
//                 type="radio"
//                 value="FEMALE"
//                 {...register('gender')}
//                 className="sr-only"
//               />
//               <span className="text-sm font-medium text-foreground">Female</span>
//             </label>

//             <label className="flex items-center justify-center px-4 py-3 border-2 border-border rounded-lg cursor-pointer hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/10">
//               <input
//                 type="radio"
//                 value="OTHER"
//                 {...register('gender')}
//                 className="sr-only"
//               />
//               <span className="text-sm font-medium text-foreground">Other</span>
//             </label>
//           </div>
//           {errors.gender && (
//             <p className="mt-1 text-sm text-destructive">{errors.gender.message}</p>
//           )}
//         </div>
//       </form>
//     </div>
//   );
// }





// components/profile/PersonalInfoStep.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { personalInfoSchema, PersonalInfoFormData } from '@/lib/validations/profile';
import { useProfileStore } from '@/store/profileStore';
import { useEffect } from 'react';

export default function PersonalInfoStep() {
  const { formData, updateFormData,nextStep  } = useProfileStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      name: formData.name || '',
      phone: formData.phone || '',
      age: formData.age || undefined,
      gender: formData.gender || undefined,
    },
  });

  // Load saved data from store
  useEffect(() => {
    if (formData.name) setValue('name', formData.name);
    if (formData.phone) setValue('phone', formData.phone);
    if (formData.age) setValue('age', formData.age);
    if (formData.gender) setValue('gender', formData.gender);
  }, [formData, setValue]);

  const onSubmit = (data: PersonalInfoFormData) => {
    updateFormData(data);
    nextStep();
    console.log(data,"djbbhjkbkda");
    
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
        <p className="text-gray-600 mt-1">Tell us about yourself</p>
      </div>

      <form id="personal-info-form"  onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Full Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            {...register('name')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Enter your full name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">+91</span>
            <input
              id="phone"
              type="tel"
              {...register('phone')}
              className="w-full pl-14 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="9876543210"
              maxLength={10}
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">10-digit Indian mobile number</p>
        </div>

        {/* Age */}
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
            Age <span className="text-red-500">*</span>
          </label>
          <input
            id="age"
            type="number"
            {...register('age', { valueAsNumber: true })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Enter your age"
            min="18"
            max="65"
          />
          {errors.age && (
            <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">Must be between 18-65 years to donate blood</p>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Gender <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            <label className="flex items-center justify-center px-4 py-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-red-500 has-[:checked]:border-red-500 has-[:checked]:bg-red-50">
              <input
                type="radio"
                value="MALE"
                {...register('gender')}
                className="sr-only"
              />
              <span className="text-sm font-medium">Male</span>
            </label>

            <label className="flex items-center justify-center px-4 py-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-red-500 has-[:checked]:border-red-500 has-[:checked]:bg-red-50">
              <input
                type="radio"
                value="FEMALE"
                {...register('gender')}
                className="sr-only"
              />
              <span className="text-sm font-medium">Female</span>
            </label>

            <label className="flex items-center justify-center px-4 py-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-red-500 has-[:checked]:border-red-500 has-[:checked]:bg-red-50">
              <input
                type="radio"
                value="OTHER"
                {...register('gender')}
                className="sr-only"
              />
              <span className="text-sm font-medium">Other</span>
            </label>
          </div>
          {errors.gender && (
            <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
          )}
        </div>
      </form>
    </div>
  );
}
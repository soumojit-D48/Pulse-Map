


// components/profile/StepIndicator.tsx
'use client';

import { Check } from 'lucide-react';

interface Step {
  number: number;
  title: string;
  description: string;
}

const steps: Step[] = [
  { number: 1, title: 'Personal', description: 'Basic information' },
  { number: 2, title: 'Medical', description: 'Blood group details' },
  { number: 3, title: 'Location', description: 'Your area' },
  { number: 4, title: 'Review', description: 'Confirm details' },
];

interface StepIndicatorProps {
  currentStep: number;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;
          const isUpcoming = currentStep < step.number;

          return (
            <div key={step.number} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all
                    ${isCompleted ? 'bg-green-600 text-white' : ''}
                    ${isCurrent ? 'bg-red-600 text-white ring-4 ring-red-200' : ''}
                    ${isUpcoming ? 'bg-gray-200 text-gray-500' : ''}
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    step.number
                  )}
                </div>
                
                {/* Step Title */}
                <div className="mt-2 text-center">
                  <p
                    className={`
                      text-sm font-semibold
                      ${isCurrent ? 'text-red-600' : ''}
                      ${isCompleted ? 'text-green-600' : ''}
                      ${isUpcoming ? 'text-gray-500' : ''}
                    `}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500 hidden sm:block">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`
                    flex-1 h-1 mx-2 transition-all
                    ${currentStep > step.number ? 'bg-green-600' : 'bg-gray-200'}
                  `}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile Progress Bar */}
      <div className="mt-4 sm:hidden">
        <div className="bg-gray-200 rounded-full h-2">
          <div
            className="bg-red-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
        <p className="text-center text-sm text-gray-600 mt-2">
          Step {currentStep} of {steps.length}
        </p>
      </div>
    </div>
  );
}
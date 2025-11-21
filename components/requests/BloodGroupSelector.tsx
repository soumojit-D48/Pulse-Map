

// components/requests/BloodGroupSelector.tsx
'use client';

interface BloodGroupSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const bloodGroups = [
  { value: 'A_POSITIVE', label: 'A+', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  { value: 'A_NEGATIVE', label: 'A-', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  { value: 'B_POSITIVE', label: 'B+', color: 'bg-green-100 text-green-800 border-green-300' },
  { value: 'B_NEGATIVE', label: 'B-', color: 'bg-green-100 text-green-800 border-green-300' },
  { value: 'O_POSITIVE', label: 'O+', color: 'bg-red-100 text-red-800 border-red-300' },
  { value: 'O_NEGATIVE', label: 'O-', color: 'bg-red-100 text-red-800 border-red-300' },
  { value: 'AB_POSITIVE', label: 'AB+', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  { value: 'AB_NEGATIVE', label: 'AB-', color: 'bg-purple-100 text-purple-800 border-purple-300' },
];

export default function BloodGroupSelector({ value, onChange }: BloodGroupSelectorProps) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {bloodGroups.map((bg) => {
        const isSelected = value === bg.value;
        return (
          <button
            key={bg.value}
            type="button"
            onClick={() => onChange(bg.value)}
            className={`
              relative p-4 border-2 rounded-lg font-bold text-xl
              transition-all hover:scale-105
              ${bg.color}
              ${isSelected ? 'ring-4 ring-primary ring-offset-2 scale-105' : ''}
            `}
          >
            {bg.label}
            {isSelected && (
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
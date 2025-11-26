

'use client';

interface UrgencySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

// for the form /new
const urgencyOptions = [
  {
    value: 'CRITICAL',
    label: 'Critical',
    description: 'Life-threatening emergency',
    icon: '🚨',
    color: 'border-red-500 bg-red-50 text-red-900',
    selectedColor: 'border-red-600 bg-red-100',
  },
  {
    value: 'HIGH',
    label: 'High',
    description: 'Urgent, within hours',
    icon: '⚠️',
    color: 'border-orange-500 bg-orange-50 text-orange-900',
    selectedColor: 'border-orange-600 bg-orange-100',
  },
  {
    value: 'MEDIUM',
    label: 'Medium',
    description: 'Within 24 hours',
    icon: '📌',
    color: 'border-yellow-500 bg-yellow-50 text-yellow-900',
    selectedColor: 'border-yellow-600 bg-yellow-100',
  },
  {
    value: 'LOW',
    label: 'Low',
    description: 'Planned donation',
    icon: 'ℹ️',
    color: 'border-blue-500 bg-blue-50 text-blue-900',
    selectedColor: 'border-blue-600 bg-blue-100',
  },
];

export default function UrgencySelector({ value, onChange }: UrgencySelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {urgencyOptions.map((option) => {
        const isSelected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`
              p-4 border-2 rounded-lg text-left transition-all
              ${isSelected ? option.selectedColor : option.color}
              hover:shadow-md
            `}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{option.icon}</span>
              <div className="flex-1">
                <p className="font-semibold text-base">{option.label}</p>
                <p className="text-sm opacity-80 mt-1">{option.description}</p>
              </div>
              {isSelected && (
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
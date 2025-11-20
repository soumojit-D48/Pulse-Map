

// components/dashboard/UrgencyBadge.tsx
interface UrgencyBadgeProps {
  urgency: string;
  size?: 'sm' | 'md';
}

const urgencyConfig = {
  CRITICAL: {
    label: 'Critical',
    className: 'bg-red-100 text-red-800 border-red-200',
    icon: '🚨',
  },
  HIGH: {
    label: 'High',
    className: 'bg-orange-100 text-orange-800 border-orange-200',
    icon: '⚠️',
  },
  MEDIUM: {
    label: 'Medium',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: '📌',
  },
  LOW: {
    label: 'Low',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: 'ℹ️',
  },
};

export default function UrgencyBadge({ urgency, size = 'md' }: UrgencyBadgeProps) {
  const config = urgencyConfig[urgency as keyof typeof urgencyConfig] || urgencyConfig.MEDIUM;
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span
      className={`
        inline-flex items-center gap-1 font-medium rounded-full border
        ${config.className} ${sizeClass}
      `}
    >
      <span>{config.icon}</span>
      {config.label}
    </span>
  );
}


// components/responses/ResponseStatusBadge.tsx
interface ResponseStatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

const statusConfig = {
  PENDING: {
    label: 'Pending',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: '⏳',
  },
  ACCEPTED: {
    label: 'Accepted',
    className: 'bg-green-100 text-green-800 border-green-200',
    icon: '✅',
  },
  DECLINED: {
    label: 'Declined',
    className: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: '❌',
  },
};

// donor after response to a request
export default function ResponseStatusBadge({
  status,
  size = 'md',
}: ResponseStatusBadgeProps) {
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
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
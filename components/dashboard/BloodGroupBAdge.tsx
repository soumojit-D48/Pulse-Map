

// components/dashboard/BloodGroupBadge.tsx
interface BloodGroupBadgeProps {
  bloodGroup: string;
  size?: 'sm' | 'md' | 'lg';
}

const bloodGroupColors: Record<string, string> = {
  A_POSITIVE: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800',
  A_NEGATIVE: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800',
  B_POSITIVE: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800',
  B_NEGATIVE: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800',
  O_POSITIVE: 'bg-primary/10 text-primary border-primary/20',
  O_NEGATIVE: 'bg-primary/10 text-primary border-primary/20',
  AB_POSITIVE: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800',
  AB_NEGATIVE: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800',
};

const bloodGroupLabels: Record<string, string> = {
  A_POSITIVE: 'A+',
  A_NEGATIVE: 'A-',
  B_POSITIVE: 'B+',
  B_NEGATIVE: 'B-',
  O_POSITIVE: 'O+',
  O_NEGATIVE: 'O-',
  AB_POSITIVE: 'AB+',
  AB_NEGATIVE: 'AB-',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base',
};

export default function BloodGroupBadge({
  bloodGroup,
  size = 'md',
}: BloodGroupBadgeProps) {
  const colorClass = bloodGroupColors[bloodGroup] || 'bg-muted text-muted-foreground border-border';
  const label = bloodGroupLabels[bloodGroup] || bloodGroup;
  const sizeClass = sizeClasses[size];

  return (
    <span
      className={`
        inline-flex items-center justify-center font-semibold 
        rounded-full border ${colorClass} ${sizeClass}
      `}
    >
      {label}
    </span>
  );
}
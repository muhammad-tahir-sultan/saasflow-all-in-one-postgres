import { cn } from '@/lib/utils';

interface BadgeProps {
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
    size?: 'sm' | 'md';
    children: React.ReactNode;
    className?: string;
}

export function Badge({ variant = 'default', size = 'sm', children, className }: BadgeProps) {
    const variants = {
        default: 'bg-surface-100 text-surface-700 ring-surface-200',
        success: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
        warning: 'bg-amber-50 text-amber-700 ring-amber-200',
        danger: 'bg-red-50 text-red-700 ring-red-200',
        info: 'bg-blue-50 text-blue-700 ring-blue-200',
        purple: 'bg-brand-50 text-brand-700 ring-brand-200',
    };

    const sizes = {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-2.5 py-1',
    };

    return (
        <span
            className={cn(
                'inline-flex items-center font-medium rounded-lg ring-1 ring-inset',
                variants[variant],
                sizes[size],
                className,
            )}
        >
            {children}
        </span>
    );
}

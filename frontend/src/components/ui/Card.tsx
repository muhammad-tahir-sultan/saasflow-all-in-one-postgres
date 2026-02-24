import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
    padding?: 'sm' | 'md' | 'lg';
}

export function Card({ children, className, hover = false, padding = 'md' }: CardProps) {
    const paddings = {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    };

    return (
        <div
            className={cn(
                'rounded-2xl border border-surface-200 bg-white shadow-sm',
                hover && 'hover:shadow-md hover:border-surface-300 transition-all duration-200 cursor-pointer',
                paddings[padding],
                className,
            )}
        >
            {children}
        </div>
    );
}

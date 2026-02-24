import { cn } from '@/lib/utils';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export function Input({ label, error, icon, className, id, ...props }: InputProps) {
    const inputId = id || label?.toLowerCase().replace(/\s/g, '-');

    return (
        <div className="space-y-1.5">
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-surface-700"
                >
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400">
                        {icon}
                    </div>
                )}
                <input
                    id={inputId}
                    className={cn(
                        'w-full rounded-xl border border-surface-200 bg-white px-4 py-2.5 text-sm text-surface-900',
                        'placeholder:text-surface-400',
                        'focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20',
                        'transition-all duration-200',
                        'hover:border-surface-300',
                        icon && 'pl-10',
                        error && 'border-red-400 focus:border-red-500 focus:ring-red-500/20',
                        className,
                    )}
                    {...props}
                />
            </div>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
}

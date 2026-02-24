import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface TableProps {
    children: ReactNode;
    className?: string;
}

export function Table({ children, className }: TableProps) {
    return (
        <div className="overflow-x-auto rounded-xl border border-surface-200">
            <table className={cn('w-full text-sm', className)}>{children}</table>
        </div>
    );
}

export function TableHeader({ children }: { children: ReactNode }) {
    return (
        <thead className="bg-surface-50 border-b border-surface-200">
            {children}
        </thead>
    );
}

export function TableRow({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <tr className={cn('border-b border-surface-100 last:border-0 hover:bg-surface-50/50 transition-colors', className)}>
            {children}
        </tr>
    );
}

export function TableHead({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <th className={cn('px-4 py-3 text-left font-semibold text-surface-600 text-xs uppercase tracking-wider', className)}>
            {children}
        </th>
    );
}

export function TableCell({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <td className={cn('px-4 py-3.5 text-surface-700', className)}>{children}</td>
    );
}

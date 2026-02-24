'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useOrganization } from '@/hooks/useOrganization';
import { cn } from '@/lib/utils';

export function OrgSwitcher() {
    const { organizations } = useAuth();
    const { activeOrg, switchOrg } = useOrganization();
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-50 border border-surface-200 hover:border-surface-300 transition-all text-sm"
            >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold">
                    {activeOrg?.name?.charAt(0)}
                </div>
                <span className="font-medium text-surface-800 max-w-[140px] truncate">
                    {activeOrg?.name || 'Select Org'}
                </span>
                <svg className={cn('w-4 h-4 text-surface-400 transition-transform', isOpen && 'rotate-180')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 left-0 w-64 bg-white rounded-xl border border-surface-200 shadow-xl py-1 animate-fade-in z-50">
                    <div className="px-3 py-2 text-xs font-semibold text-surface-400 uppercase tracking-wider">
                        Organizations
                    </div>
                    {organizations.map((org) => (
                        <button
                            key={org.id}
                            onClick={() => {
                                switchOrg(org);
                                setIsOpen(false);
                                window.location.reload();
                            }}
                            className={cn(
                                'w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-surface-50 transition-colors text-left',
                                activeOrg?.id === org.id && 'bg-brand-50',
                            )}
                        >
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                                {org.name?.charAt(0)}
                            </div>
                            <div className="min-w-0">
                                <p className="font-medium text-surface-800 truncate">{org.name}</p>
                                <p className="text-xs text-surface-500">{org.role}</p>
                            </div>
                            {activeOrg?.id === org.id && (
                                <svg className="w-4 h-4 text-brand-600 ml-auto shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

'use client';

import { useAuthContext } from '@/providers/AuthProvider';
import type { MemberRole } from '@/types/user.types';

export function useAuth() {
    const context = useAuthContext();

    const activeOrgId = typeof window !== 'undefined' ? localStorage.getItem('activeOrgId') : null;
    const currentMembership = context.organizations.find((o) => o.id === activeOrgId);
    const role = (currentMembership?.role as MemberRole) || 'MEMBER';

    return {
        ...context,
        role,
        isAdmin: role === 'ADMIN',
        isManager: role === 'ADMIN' || role === 'MANAGER',
    };
}

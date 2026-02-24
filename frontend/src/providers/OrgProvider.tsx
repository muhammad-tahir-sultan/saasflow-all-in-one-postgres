'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { getActiveOrgId, setActiveOrgId as storeActiveOrgId } from '@/lib/auth';
import type { Organization } from '@/types/organization.types';
import { useAuthContext } from './AuthProvider';

interface OrgState {
    activeOrg: Organization | null;
    switchOrg: (org: Organization) => void;
}

const OrgContext = createContext<OrgState | undefined>(undefined);

export function OrgProvider({ children }: { children: ReactNode }) {
    const { organizations } = useAuthContext();

    const [activeOrg, setActiveOrg] = useState<Organization | null>(() => {
        const storedId = getActiveOrgId();
        if (storedId) {
            return organizations.find((o) => o.id === storedId) || organizations[0] || null;
        }
        return organizations[0] || null;
    });

    const switchOrg = useCallback((org: Organization) => {
        setActiveOrg(org);
        storeActiveOrgId(org.id);
    }, []);

    return (
        <OrgContext.Provider value={{ activeOrg, switchOrg }}>
            {children}
        </OrgContext.Provider>
    );
}

export function useOrgContext() {
    const context = useContext(OrgContext);
    if (!context) throw new Error('useOrgContext must be used within OrgProvider');
    return context;
}

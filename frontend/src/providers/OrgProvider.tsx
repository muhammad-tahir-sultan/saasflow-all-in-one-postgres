'use client';

import { createContext, useContext, useState, useCallback, type ReactNode, useEffect } from 'react';
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

    const [activeOrg, setActiveOrg] = useState<Organization | null>(null);

    // Sync activeOrg when organizations load from AuthProvider
    useEffect(() => {
        if (organizations.length === 0) {
            setActiveOrg(null);
            return;
        }

        const storedId = getActiveOrgId();
        const currentOrg = storedId
            ? organizations.find((o) => o.id === storedId)
            : null;

        if (currentOrg) {
            setActiveOrg(currentOrg);
        } else {
            // Default to first org if stored ID is invalid or missing
            setActiveOrg(organizations[0]);
            storeActiveOrgId(organizations[0].id);
        }
    }, [organizations]);

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

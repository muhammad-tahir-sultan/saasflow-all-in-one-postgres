'use client';

import { useOrgContext } from '@/providers/OrgProvider';

export function useOrganization() {
    return useOrgContext();
}

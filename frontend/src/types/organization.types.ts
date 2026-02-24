export interface Organization {
    id: string;
    name: string;
    slug: string;
    role?: string;
    createdAt?: string;
    members?: OrganizationMember[];
    _count?: {
        tasks: number;
        jobs: number;
    };
}

export interface OrganizationMember {
    id: string;
    userId: string;
    role: string;
    joinedAt: string;
    user: {
        id: string;
        email: string;
        name: string;
    };
}

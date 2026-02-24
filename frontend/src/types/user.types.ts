export interface User {
    id: string;
    email: string;
    name: string;
    createdAt: string;
    memberships?: UserMembership[];
}

export interface UserMembership {
    id: string;
    organizationId: string;
    role: MemberRole;
    organization: {
        id: string;
        name: string;
        slug: string;
    };
}

export type MemberRole = 'ADMIN' | 'MANAGER' | 'MEMBER';

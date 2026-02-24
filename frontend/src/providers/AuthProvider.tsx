'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import api from '@/lib/api';
import { storeTokens, clearTokens, getStoredToken } from '@/lib/auth';
import type { User } from '@/types/user.types';
import type { Organization } from '@/types/organization.types';

interface AuthState {
    user: User | null;
    organizations: Organization[];
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string, orgName?: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing session on mount
    useEffect(() => {
        const token = getStoredToken();
        if (token) {
            api
                .get('/users/me')
                .then((res) => {
                    const userData = res.data.data;
                    setUser(userData);
                    if (userData.memberships) {
                        setOrganizations(
                            userData.memberships.map((m: any) => ({
                                ...m.organization,
                                role: m.role,
                            })),
                        );
                    }
                })
                .catch(() => {
                    clearTokens();
                })
                .finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        const res = await api.post('/auth/login', { email, password });
        const { user: u, organizations: orgs, accessToken, refreshToken } = res.data.data;
        storeTokens(accessToken, refreshToken);
        setUser(u);
        setOrganizations(orgs);
        // Set first org as active
        if (orgs.length > 0) {
            localStorage.setItem('activeOrgId', orgs[0].id);
        }
    }, []);

    const register = useCallback(
        async (name: string, email: string, password: string, organizationName?: string) => {
            const res = await api.post('/auth/register', { name, email, password, organizationName });
            const { user: u, organization, accessToken, refreshToken } = res.data.data;
            storeTokens(accessToken, refreshToken);
            setUser(u);
            setOrganizations([organization]);
            localStorage.setItem('activeOrgId', organization.id);
        },
        [],
    );

    const logout = useCallback(() => {
        api.post('/auth/logout').catch(() => { });
        clearTokens();
        setUser(null);
        setOrganizations([]);
        window.location.href = '/login';
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                organizations,
                isAuthenticated: !!user,
                isLoading,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuthContext must be used within AuthProvider');
    return context;
}

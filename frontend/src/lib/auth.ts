export function getStoredToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
}

export function getStoredRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refreshToken');
}

export function storeTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
}

export function clearTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('activeOrgId');
}

export function getActiveOrgId(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('activeOrgId');
}

export function setActiveOrgId(orgId: string) {
    localStorage.setItem('activeOrgId', orgId);
}

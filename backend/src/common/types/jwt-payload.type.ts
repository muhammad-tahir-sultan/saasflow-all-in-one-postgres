export interface JwtPayload {
    userId: string;
    email: string;
}

export interface JwtRefreshPayload extends JwtPayload {
    refreshToken: string;
}

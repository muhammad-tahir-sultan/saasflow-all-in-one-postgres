export const jwtConfig = {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'change_this_access_secret_min_32_chars',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'change_this_refresh_secret_min_32_chars',
    accessExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
    refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
};

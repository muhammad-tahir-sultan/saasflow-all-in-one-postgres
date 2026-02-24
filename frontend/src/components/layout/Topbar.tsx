'use client';

import { useAuth } from '@/hooks/useAuth';
import { NotificationBell } from '../notifications/NotificationBell';

export function Topbar() {
    const { user, logout } = useAuth();

    return (
        <header className="fixed top-0 left-64 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-surface-200 flex items-center justify-between px-6 z-20">
            <div>
                <h2 className="text-sm font-medium text-surface-500">
                    Welcome back
                </h2>
                <p className="text-sm font-semibold text-surface-900">{user?.name}</p>
            </div>

            <div className="flex items-center gap-4">
                <NotificationBell />

                <div className="h-8 w-px bg-surface-200" />

                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <button
                        onClick={logout}
                        className="text-xs text-surface-500 hover:text-surface-700 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
}

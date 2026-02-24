import type { Metadata } from 'next';
import './globals.css';
import { QueryProvider } from '@/providers/QueryProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { OrgProvider } from '@/providers/OrgProvider';
import { ToastContainer } from '@/components/ui/Toast';

export const metadata: Metadata = {
    title: 'SaaSFlow — Multi-Tenant SaaS Platform',
    description: 'Production-ready SaaS platform powered entirely by PostgreSQL',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="antialiased">
            <body>
                <QueryProvider>
                    <AuthProvider>
                        <OrgProvider>
                            {children}
                            <ToastContainer />
                        </OrgProvider>
                    </AuthProvider>
                </QueryProvider>
            </body>
        </html>
    );
}

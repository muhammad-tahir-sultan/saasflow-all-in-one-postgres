'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from '@/components/ui/Toast';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await login(email, password);
            router.push('/dashboard');
        } catch {
            toast('error', 'Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left — Branding Panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-surface-950 via-brand-950 to-surface-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(99,102,241,0.15),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(129,140,248,0.1),transparent_50%)]" />
                <div className="relative z-10 flex flex-col justify-center px-16">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-2xl shadow-brand-500/30 mb-8">
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4">
                        Welcome to <span className="text-brand-400">SaaSFlow</span>
                    </h1>
                    <p className="text-lg text-surface-400 max-w-md leading-relaxed">
                        A multi-tenant SaaS platform proving PostgreSQL can replace Redis, MongoDB, Elasticsearch, and Kafka.
                    </p>
                    <div className="mt-12 grid grid-cols-2 gap-4 max-w-md">
                        {[
                            { icon: '⚡', label: 'Jobs Queue', sub: 'FOR UPDATE SKIP LOCKED' },
                            { icon: '🔍', label: 'Full-Text Search', sub: 'tsvector + GIN' },
                            { icon: '📄', label: 'Document Store', sub: 'JSONB + GIN' },
                            { icon: '📡', label: 'Real-Time', sub: 'LISTEN / NOTIFY' },
                        ].map((item) => (
                            <div key={item.label} className="p-3 rounded-xl bg-white/5 border border-white/10">
                                <span className="text-lg">{item.icon}</span>
                                <p className="text-sm font-medium text-white mt-1">{item.label}</p>
                                <p className="text-xs text-surface-500">{item.sub}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right — Login Form */}
            <div className="flex-1 flex items-center justify-center px-8">
                <div className="w-full max-w-md">
                    <div className="lg:hidden mb-8">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/30 mb-4">
                            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-surface-900">Sign in</h2>
                    <p className="text-sm text-surface-500 mt-1 mb-8">
                        Enter your credentials to access the dashboard
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@acme.com"
                            required
                        />
                        <Input
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                        <Button type="submit" isLoading={isLoading} className="w-full">
                            Sign In
                        </Button>
                    </form>

                    <p className="text-sm text-center text-surface-500 mt-6">
                        Don&#39;t have an account?{' '}
                        <Link href="/register" className="text-brand-600 font-medium hover:text-brand-700">
                            Sign up
                        </Link>
                    </p>

                    <div className="mt-8 p-4 rounded-xl bg-surface-50 border border-surface-200">
                        <p className="text-xs font-medium text-surface-600 mb-2">Demo Credentials</p>
                        <p className="text-xs text-surface-500">admin@acme.com / password123</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

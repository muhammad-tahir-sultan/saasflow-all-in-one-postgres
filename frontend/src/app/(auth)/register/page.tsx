'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from '@/components/ui/Toast';

export default function RegisterPage() {
    const router = useRouter();
    const { register } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [orgName, setOrgName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await register(name, email, password, orgName || undefined);
            router.push('/dashboard');
        } catch {
            toast('error', 'Registration failed. Email may already be in use.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left — Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-surface-950 via-brand-950 to-surface-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(99,102,241,0.15),transparent_50%)]" />
                <div className="relative z-10 flex flex-col justify-center px-16">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-2xl shadow-brand-500/30 mb-8">
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4">
                        Get Started with <span className="text-brand-400">SaaSFlow</span>
                    </h1>
                    <p className="text-lg text-surface-400 max-w-md leading-relaxed">
                        Create your organization and start managing tasks with the power of PostgreSQL.
                    </p>
                </div>
            </div>

            {/* Right — Register Form */}
            <div className="flex-1 flex items-center justify-center px-8">
                <div className="w-full max-w-md">
                    <h2 className="text-2xl font-bold text-surface-900">Create account</h2>
                    <p className="text-sm text-surface-500 mt-1 mb-8">
                        Set up your account and organization
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            label="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                            required
                        />
                        <Input
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="john@example.com"
                            required
                        />
                        <Input
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Min 8 characters"
                            required
                        />
                        <Input
                            label="Organization Name"
                            value={orgName}
                            onChange={(e) => setOrgName(e.target.value)}
                            placeholder="My Company (optional)"
                        />
                        <Button type="submit" isLoading={isLoading} className="w-full">
                            Create Account
                        </Button>
                    </form>

                    <p className="text-sm text-center text-surface-500 mt-6">
                        Already have an account?{' '}
                        <Link href="/login" className="text-brand-600 font-medium hover:text-brand-700">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

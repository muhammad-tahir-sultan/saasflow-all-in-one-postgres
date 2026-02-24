'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { useOrganization } from '@/hooks/useOrganization';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Table, TableHeader, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import type { OrganizationMember } from '@/types/organization.types';

export default function SettingsPage() {
    const { isAdmin, role } = useAuth();
    const { activeOrg } = useOrganization();

    const { data: org, isLoading } = useQuery({
        queryKey: ['organization', activeOrg?.id],
        queryFn: async () => {
            const res = await api.get(`/organizations/${activeOrg?.id}`);
            return res.data.data;
        },
        enabled: !!activeOrg?.id,
    });

    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-surface-900">Organization Settings</h1>
                <p className="text-sm text-surface-500 mt-1">
                    Manage members and roles · Your role: <Badge>{role}</Badge>
                </p>
            </div>

            {/* Org Info */}
            <Card>
                <div className="space-y-4">
                    <div>
                        <h3 className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Organization</h3>
                        <p className="text-lg font-bold text-surface-900 mt-1">{org?.name}</p>
                        <p className="text-sm text-surface-500">{org?.slug}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-surface-50">
                            <p className="text-2xl font-bold text-brand-600">{org?._count?.tasks || 0}</p>
                            <p className="text-xs text-surface-500">Total Tasks</p>
                        </div>
                        <div className="p-4 rounded-xl bg-surface-50">
                            <p className="text-2xl font-bold text-brand-600">{org?._count?.jobs || 0}</p>
                            <p className="text-xs text-surface-500">Total Jobs</p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Members */}
            <Card>
                <h3 className="text-sm font-semibold text-surface-700 mb-4">Members</h3>
                <Table>
                    <TableHeader>
                        <tr>
                            <TableHead>User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Joined</TableHead>
                        </tr>
                    </TableHeader>
                    <tbody>
                        {org?.members?.map((member: OrganizationMember) => (
                            <TableRow key={member.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                                            {member.user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-surface-900">{member.user.name}</p>
                                            <p className="text-xs text-surface-500">{member.user.email}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            member.role === 'ADMIN'
                                                ? 'danger'
                                                : member.role === 'MANAGER'
                                                    ? 'warning'
                                                    : 'default'
                                        }
                                    >
                                        {member.role}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm text-surface-500">
                                        {new Date(member.joinedAt).toLocaleDateString()}
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </tbody>
                </Table>
            </Card>
        </div>
    );
}

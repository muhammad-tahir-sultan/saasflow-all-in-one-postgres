'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { OrgSwitcher } from '@/components/layout/OrgSwitcher';
import { TasksPerWeekChart } from '@/components/analytics/TasksPerWeekChart';
import { TopUsersTable } from '@/components/analytics/TopUsersTable';
import { AvgCompletionCard } from '@/components/analytics/AvgCompletionCard';
import type { TasksPerWeek, TopUser, AvgCompletion } from '@/types/analytics.types';

export default function DashboardPage() {
    const tasksPerWeek = useQuery<TasksPerWeek[]>({
        queryKey: ['analytics', 'tasks-per-week'],
        queryFn: async () => {
            const res = await api.get('/analytics/tasks-per-week');
            return res.data.data;
        },
    });

    const topUsers = useQuery<TopUser[]>({
        queryKey: ['analytics', 'top-users'],
        queryFn: async () => {
            const res = await api.get('/analytics/top-users');
            return res.data.data;
        },
    });

    const avgCompletion = useQuery<AvgCompletion>({
        queryKey: ['analytics', 'avg-completion'],
        queryFn: async () => {
            const res = await api.get('/analytics/avg-completion');
            return res.data.data;
        },
    });

    const isLoading = tasksPerWeek.isLoading || topUsers.isLoading || avgCompletion.isLoading;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-surface-900">Dashboard</h1>
                    <p className="text-sm text-surface-500 mt-1">Analytics overview powered by raw PostgreSQL queries</p>
                </div>
                <OrgSwitcher />
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Spinner size="lg" />
                </div>
            ) : (
                <>
                    {/* Completion Time Stats */}
                    <div>
                        <h2 className="text-sm font-semibold text-surface-700 mb-3 uppercase tracking-wider">
                            Completion Time
                        </h2>
                        <AvgCompletionCard data={avgCompletion.data || { avg_hours: 0, min_hours: 0, max_hours: 0, completed_count: 0 }} />
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <h2 className="text-sm font-semibold text-surface-700 mb-4">Tasks Completed Per Week</h2>
                            <TasksPerWeekChart data={tasksPerWeek.data || []} />
                        </Card>

                        <Card>
                            <h2 className="text-sm font-semibold text-surface-700 mb-4">Top Performers</h2>
                            <TopUsersTable data={topUsers.data || []} />
                        </Card>
                    </div>

                    {/* Tech Showcase Footer */}
                    <Card className="bg-gradient-to-r from-surface-900 to-surface-800 border-0 text-white">
                        <h3 className="font-semibold mb-3">🐘 PostgreSQL Features in Action</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                            <div>
                                <p className="text-surface-400 text-xs">Replaces Redis</p>
                                <p className="font-medium">Jobs + SKIP LOCKED</p>
                            </div>
                            <div>
                                <p className="text-surface-400 text-xs">Replaces MongoDB</p>
                                <p className="font-medium">JSONB + GIN</p>
                            </div>
                            <div>
                                <p className="text-surface-400 text-xs">Replaces Elasticsearch</p>
                                <p className="font-medium">tsvector + FTS</p>
                            </div>
                            <div>
                                <p className="text-surface-400 text-xs">Replaces Kafka</p>
                                <p className="font-medium">LISTEN/NOTIFY</p>
                            </div>
                        </div>
                    </Card>
                </>
            )}
        </div>
    );
}

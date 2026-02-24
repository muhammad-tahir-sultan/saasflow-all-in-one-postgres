import { Table, TableHeader, TableRow, TableHead, TableCell } from '../ui/Table';
import { Badge } from '../ui/Badge';
import type { TopUser } from '@/types/analytics.types';

export function TopUsersTable({ data }: { data: TopUser[] }) {
    if (!data || data.length === 0) {
        return (
            <div className="text-center py-8 text-sm text-surface-500">
                No data available yet
            </div>
        );
    }

    return (
        <Table>
            <TableHeader>
                <tr>
                    <TableHead>Rank</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Tasks Completed</TableHead>
                </tr>
            </TableHeader>
            <tbody>
                {data.map((user) => (
                    <TableRow key={user.id}>
                        <TableCell>
                            <Badge variant={user.rank <= 3 ? 'warning' : 'default'}>
                                #{user.rank}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                                    {user.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-medium text-surface-900">{user.name}</p>
                                    <p className="text-xs text-surface-500">{user.email}</p>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>
                            <span className="font-semibold text-surface-900">{user.task_count}</span>
                        </TableCell>
                    </TableRow>
                ))}
            </tbody>
        </Table>
    );
}

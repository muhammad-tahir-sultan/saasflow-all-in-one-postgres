import { Card } from '../ui/Card';
import type { AvgCompletion } from '@/types/analytics.types';

export function AvgCompletionCard({ data }: { data: AvgCompletion }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="text-center">
                <p className="text-xs font-medium text-surface-500 uppercase tracking-wider">Average</p>
                <p className="text-3xl font-bold text-brand-600 mt-2">
                    {data.avg_hours ? Number(data.avg_hours).toFixed(1) : '—'}
                </p>
                <p className="text-xs text-surface-500 mt-1">hours</p>
            </Card>
            <Card className="text-center">
                <p className="text-xs font-medium text-surface-500 uppercase tracking-wider">Fastest</p>
                <p className="text-3xl font-bold text-emerald-600 mt-2">
                    {data.min_hours ? Number(data.min_hours).toFixed(1) : '—'}
                </p>
                <p className="text-xs text-surface-500 mt-1">hours</p>
            </Card>
            <Card className="text-center">
                <p className="text-xs font-medium text-surface-500 uppercase tracking-wider">Slowest</p>
                <p className="text-3xl font-bold text-amber-600 mt-2">
                    {data.max_hours ? Number(data.max_hours).toFixed(1) : '—'}
                </p>
                <p className="text-xs text-surface-500 mt-1">hours</p>
            </Card>
        </div>
    );
}

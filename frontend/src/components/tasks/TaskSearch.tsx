'use client';

import { useSearch } from '@/hooks/useSearch';
import { TaskCard } from './TaskCard';
import { Spinner } from '../ui/Spinner';

export function TaskSearch() {
    const { query, setQuery, searchResults, isSearching, isSearchMode, clearSearch } = useSearch();

    return (
        <div className="space-y-4">
            <div className="relative">
                <svg
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search tasks with full-text search..."
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-surface-200 bg-white text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                />
                {query && (
                    <button
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {isSearchMode && (
                <div>
                    {isSearching ? (
                        <Spinner className="py-8" />
                    ) : searchResults.length > 0 ? (
                        <div className="space-y-3">
                            <p className="text-xs text-surface-500 font-medium">
                                {searchResults.length} results for &quot;{query}&quot;
                            </p>
                            {searchResults.map((task) => (
                                <TaskCard key={task.id} task={task} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-sm text-surface-500">No results found</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

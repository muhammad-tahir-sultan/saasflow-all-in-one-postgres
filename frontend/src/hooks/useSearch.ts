'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Task } from '@/types/task.types';

export function useSearch() {
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    const searchResults = useQuery<Task[]>({
        queryKey: ['tasks', 'search', debouncedQuery],
        queryFn: async () => {
            const res = await api.get('/tasks/search', {
                params: { q: debouncedQuery },
            });
            return res.data.data;
        },
        enabled: debouncedQuery.length >= 2,
    });

    const clearSearch = useCallback(() => {
        setQuery('');
        setDebouncedQuery('');
    }, []);

    return {
        query,
        setQuery,
        searchResults: searchResults.data || [],
        isSearching: searchResults.isLoading,
        isSearchMode: debouncedQuery.length >= 2,
        clearSearch,
    };
}

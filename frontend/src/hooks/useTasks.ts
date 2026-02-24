'use client';

import { useQuery, useMutation, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Task, CreateTaskInput, UpdateTaskInput, PaginatedTasks } from '@/types/task.types';

export function useTasksList() {
    return useInfiniteQuery<PaginatedTasks>({
        queryKey: ['tasks'],
        queryFn: async ({ pageParam }) => {
            const params: Record<string, string> = { limit: '20' };
            if (pageParam) params.cursor = pageParam as string;
            const res = await api.get('/tasks', { params });
            return res.data.data;
        },
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (lastPage) =>
            lastPage.meta.hasNextPage ? lastPage.meta.nextCursor : undefined,
    });
}

export function useTask(id: string) {
    return useQuery<Task>({
        queryKey: ['tasks', id],
        queryFn: async () => {
            const res = await api.get(`/tasks/${id}`);
            return res.data.data;
        },
        enabled: !!id,
    });
}

export function useCreateTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: CreateTaskInput) => {
            const res = await api.post('/tasks', input);
            return res.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });
}

export function useUpdateTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...input }: UpdateTaskInput & { id: string }) => {
            const res = await api.patch(`/tasks/${id}`, input);
            return res.data.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            queryClient.invalidateQueries({ queryKey: ['tasks', variables.id] });
        },
    });
}

export function useDeleteTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/tasks/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });
}

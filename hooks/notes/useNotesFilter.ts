import { useState, useMemo, useCallback } from 'react';
import { ApiNote, SortOption } from '@/types';

interface UseNotesFilterReturn {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedTags: string[];
    setSelectedTags: (tags: string[]) => void;
    sortBy: SortOption;
    setSortBy: (sort: SortOption) => void;
    allTags: string[];
    filteredAndSortedNotes: ApiNote[];
    toggleTag: (tag: string) => void;
    clearFilters: () => void;
    hasFilters: boolean;
}

export const useNotesFilter = (notes: ApiNote[]): UseNotesFilterReturn => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState<SortOption>('createdAt');

    const allTags = useMemo(() => {
        const tags = new Set<string>();
        notes.forEach(note => note.tags.forEach(tag => tags.add(tag)));
        return Array.from(tags).sort();
    }, [notes]);

    const filteredAndSortedNotes = useMemo(() => {
        return notes
            .filter(note => {
                const matchesSearch = !searchTerm ||
                    note.note.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesTags = selectedTags.length === 0 ||
                    selectedTags.some(tag => note.tags.includes(tag));
                return matchesSearch && matchesTags;
            })
            .sort((a, b) => {
                if (sortBy === 'page') {
                    return (a.page || 0) - (b.page || 0);
                }
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
    }, [notes, searchTerm, selectedTags, sortBy]);

    const toggleTag = useCallback((tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    }, []);

    const clearFilters = useCallback(() => {
        setSearchTerm('');
        setSelectedTags([]);
    }, []);

    const hasFilters = useMemo(() => {
        return searchTerm.length > 0 || selectedTags.length > 0;
    }, [searchTerm, selectedTags]);

    return {
        searchTerm,
        setSearchTerm,
        selectedTags,
        setSelectedTags,
        sortBy,
        setSortBy,
        allTags,
        filteredAndSortedNotes,
        toggleTag,
        clearFilters,
        hasFilters,
    };
};
import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BookNoteType } from '@prisma/client';
import {NoteFormData, ApiNote, MoreInfoBook } from '@/types';
import { useBookNotes } from '@/hooks/notes/useBookNotes';
import { useNotesFilter } from '@/hooks/notes/useNotesFilter';
import { useUser } from '@/hooks/useUser';
import { NoteFormSchema } from '@/utils/zod';

interface UseBookNotesModalProps {
    book: MoreInfoBook;
    isOpen: boolean;
    userId: string;
}

interface UseBookNotesModalReturn {
    // States
    isCreating: boolean;
    editingNote: string | null;
    setIsCreating: (value: boolean) => void;
    setEditingNote: (noteId: string | null) => void;

    // Book notes hook
    notes: ApiNote[];
    loading: boolean;
    deleteLoading: string | null;

    // Filter hook
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedTags: string[];
    sortBy: 'createdAt' | 'page';
    setSortBy: (sort: 'createdAt' | 'page') => void;
    allTags: string[];
    filteredAndSortedNotes: ApiNote[];
    toggleTag: (tag: string) => void;
    clearFilters: () => void;
    hasFilters: boolean;

    // Forms
    createForm: ReturnType<typeof useForm<NoteFormData>>;
    editForm: ReturnType<typeof useForm<NoteFormData>>;

    // Actions
    handleCreateNote: () => void;
    handleCreateSubmit: (data: NoteFormData) => Promise<void>;
    handleCancelCreate: () => void;
    startEditing: (note: ApiNote) => void;
    handleEditSubmit: (data: NoteFormData) => Promise<void>;
    handleCancelEdit: () => void;
    handleDeleteNote: (noteId: string) => Promise<void>;
    handleSortChange: () => void;
}

export const useBookNotesModal = ({
                                      book,
                                      isOpen,
                                      userId
                                  }: UseBookNotesModalProps): UseBookNotesModalReturn => {
    const [isCreating, setIsCreating] = useState(false);
    const [editingNote, setEditingNote] = useState<string | null>(null);

    const { refreshUser } = useUser();

    const {
        notes,
        loading,
        deleteLoading,
        fetchNotes,
        createNote,
        updateNote,
        deleteNote,
    } = useBookNotes({ userId, bookId: book.id });

    const {
        searchTerm,
        setSearchTerm,
        selectedTags,
        sortBy,
        setSortBy,
        allTags,
        filteredAndSortedNotes,
        toggleTag,
        clearFilters,
        hasFilters,
    } = useNotesFilter(notes);

    const createForm = useForm<NoteFormData>({
        resolver: zodResolver(NoteFormSchema),
        defaultValues: {
            note: '',
            page: '',
            chapter: '',
            tags: '',
            type: BookNoteType.NOTE,
        },
    });

    const editForm = useForm<NoteFormData>({
        resolver: zodResolver(NoteFormSchema),
        defaultValues: {
            note: '',
            page: '',
            chapter: '',
            tags: '',
            type: BookNoteType.NOTE,
        },
    });

    // Fetch notes when modal opens or filters change
    useEffect(() => {
        if (isOpen && book.id) {
            const params = new URLSearchParams({
                sortBy,
                ...(searchTerm && { search: searchTerm }),
                ...(selectedTags.length > 0 && { tags: selectedTags.join(',') }),
            });
            fetchNotes(params);
        }
    }, [isOpen, book.id, fetchNotes, sortBy, searchTerm, selectedTags]);

    const handleCreateNote = useCallback(() => {
        setIsCreating(true);
    }, []);

    const handleCreateSubmit = useCallback(async (data: NoteFormData) => {
        try {
            await createNote(data);
            setIsCreating(false);
            createForm.reset();
            refreshUser();
        } catch (error) {
            console.error('Error creating note:', error);
        }
    }, [createNote, createForm, refreshUser]);

    const handleCancelCreate = useCallback(() => {
        setIsCreating(false);
        createForm.reset();
    }, [createForm]);

    const startEditing = useCallback((note: ApiNote) => {
        setEditingNote(note.id);
        editForm.reset({
            note: note.note,
            page: note.page?.toString() || '',
            chapter: note.chapter?.toString() || '',
            tags: note.tags.join(', '),
            type: note.type as BookNoteType || BookNoteType.NOTE,
        });
    }, [editForm]);

    const handleEditSubmit = useCallback(async (data: NoteFormData) => {
        if (!editingNote) return;

        try {
            await updateNote(editingNote, data);
            setEditingNote(null);
        } catch (error) {
            console.error('Error updating note:', error);
        }
    }, [editingNote, updateNote]);

    const handleCancelEdit = useCallback(() => {
        setEditingNote(null);
    }, []);

    const handleDeleteNote = useCallback(async (noteId: string) => {
        await deleteNote(noteId);
        refreshUser();
    }, [deleteNote, refreshUser]);

    const handleSortChange = useCallback(() => {
        setSortBy(sortBy === 'createdAt' ? 'page' : 'createdAt');
    }, [sortBy, setSortBy]);

    return {
        // States
        isCreating,
        setIsCreating,
        editingNote,
        setEditingNote,

        // Book notes hook
        notes,
        loading,
        deleteLoading,

        // Filter hook
        searchTerm,
        setSearchTerm,
        selectedTags,
        sortBy,
        setSortBy,
        allTags,
        filteredAndSortedNotes,
        toggleTag,
        clearFilters,
        hasFilters,

        // Forms
        createForm,
        editForm,

        // Actions
        handleCreateNote,
        handleCreateSubmit,
        handleCancelCreate,
        startEditing,
        handleEditSubmit,
        handleCancelEdit,
        handleDeleteNote,
        handleSortChange,
    };
};
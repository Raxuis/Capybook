import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ApiNote, NoteFormData, NotePayload } from '@/types';
import {BookNoteType} from "@prisma/client";

interface UseBookNotesProps {
    userId: string;
    bookId: string;
}

interface UseBookNotesReturn {
    notes: ApiNote[];
    loading: boolean;
    deleteLoading: string | null;
    fetchNotes: (params?: URLSearchParams) => Promise<void>;
    createNote: (noteData: NoteFormData) => Promise<ApiNote>;
    updateNote: (noteId: string, noteData: NoteFormData) => Promise<ApiNote>;
    deleteNote: (noteId: string) => Promise<void>;
}

export const useBookNotes = ({ userId, bookId }: UseBookNotesProps): UseBookNotesReturn => {
    const [notes, setNotes] = useState<ApiNote[]>([]);
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
    const { toast } = useToast();

    const createNotePayload = (noteData: NoteFormData): NotePayload => ({
        note: noteData.note,
        page: noteData.page ? parseInt(noteData.page, 10) : undefined,
        chapter: noteData.chapter || undefined,
        tags: noteData.tags ? noteData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
        type: noteData.type || BookNoteType.NOTE,
    });

    const fetchNotes = useCallback(async (params?: URLSearchParams) => {
        try {
            setLoading(true);
            const queryString = params ? `?${params}` : '';
            const response = await fetch(`/api/user/${userId}/book/${bookId}/notes${queryString}`);

            if (!response.ok) {
                throw new Error('Erreur lors du chargement des notes');
            }

            const data: ApiNote[] = await response.json();
            setNotes(data);
        } catch (error) {
            console.error('Erreur:', error);
            toast({
                title: "Erreur",
                description: "Impossible de charger les notes",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }, [userId, bookId, toast]);

    const createNote = useCallback(async (noteData: NoteFormData): Promise<ApiNote> => {
        try {
            setLoading(true);
            const payload = createNotePayload(noteData);
            const response = await fetch(`/api/user/${userId}/book/${bookId}/notes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la création de la note');
            }

            const newNote: ApiNote = await response.json();
            setNotes(prev => [newNote, ...prev]);

            toast({
                title: "Succès",
                description: "Note créée avec succès",
            });

            return newNote;
        } catch (error) {
            console.error('Erreur:', error);
            toast({
                title: "Erreur",
                description: "Impossible de créer la note",
                variant: "destructive",
            });
            throw error;
        } finally {
            setLoading(false);
        }
    }, [userId, bookId, toast]);

    const updateNote = useCallback(async (noteId: string, noteData: NoteFormData): Promise<ApiNote> => {
        try {
            setLoading(true);
            const payload = createNotePayload(noteData);
            const response = await fetch(`/api/user/${userId}/book/${bookId}/notes/${noteId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour de la note');
            }

            const updatedNote: ApiNote = await response.json();
            setNotes(prev => prev.map(note =>
                note.id === noteId ? updatedNote : note
            ));

            toast({
                title: "Succès",
                description: "Note mise à jour avec succès",
            });

            return updatedNote;
        } catch (error) {
            console.error('Erreur:', error);
            toast({
                title: "Erreur",
                description: "Impossible de mettre à jour la note",
                variant: "destructive",
            });
            throw error;
        } finally {
            setLoading(false);
        }
    }, [userId, bookId, toast]);

    const deleteNote = useCallback(async (noteId: string): Promise<void> => {
        try {
            setDeleteLoading(noteId);
            const response = await fetch(`/api/user/${userId}/book/${bookId}/notes/${noteId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ noteId, bookId }),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la suppression de la note');
            }

            setNotes(prev => prev.filter(note => note.id !== noteId));

            toast({
                title: "Succès",
                description: "Note supprimée avec succès",
            });
        } catch (error) {
            console.error('Erreur:', error);
            toast({
                title: "Erreur",
                description: "Impossible de supprimer la note",
                variant: "destructive",
            });
        } finally {
            setDeleteLoading(null);
        }
    }, [userId, bookId, toast]);

    return {
        notes,
        loading,
        deleteLoading,
        fetchNotes,
        createNote,
        updateNote,
        deleteNote,
    };
};
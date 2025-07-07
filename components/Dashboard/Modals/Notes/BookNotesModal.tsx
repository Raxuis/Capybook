import React, {memo, useEffect} from 'react';
import {motion, AnimatePresence} from 'motion/react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from '@/components/ui/dialog';
import {BookOpen, Loader2} from 'lucide-react';
import {BookNotesProps} from '@/types';
import {useBookNotesModal} from '@/hooks/notes/useBookNotesModal';
import {BookNotesToolbar} from './BookNotesToolbar';
import {TagsFilter} from './TagsFilter';
import {NoteForm} from './NoteForm';
import {BookNoteCard} from './BookNoteCard';
import {EmptyState} from './EmptyState';

const BookNotesModal = memo(({book, isOpen, setIsOpen, userId}: BookNotesProps) => {
    const {
        // States
        isCreating,
        editingNote,
        setIsCreating,
        setEditingNote,

        // Data
        loading,
        deleteLoading,

        // Filters
        searchTerm,
        setSearchTerm,
        selectedTags,
        sortBy,
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
    } = useBookNotesModal({book, isOpen, userId});

    useEffect(() => {
        // Reset state when modal opens
        if (isOpen && book.id) {
            createForm.reset();
            editForm.reset();
            setSearchTerm('');
            toggleTag('');
            setIsCreating(false);
            setEditingNote(null);
            clearFilters();
        }
    }, [isOpen, book.id, createForm, editForm, setSearchTerm, toggleTag, setIsCreating, setEditingNote, clearFilters]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent
                className="max-w-7xl w-[95vw] h-[90vh] max-h-[900px] overflow-hidden flex flex-col bg-gradient-to-br from-slate-50 to-white border-0 shadow-2xl"
            >
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5"/>
                        <span className="truncate">Notes - {book.title}</span>
                    </DialogTitle>
                    <DialogDescription className="mt-2 text-sm text-muted-foreground">
                        Gérez vos notes pour le livre <strong>{book.title}</strong>. Vous pouvez créer, modifier ou
                        supprimer des notes, ainsi que filtrer et trier vos notes.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-4">
                    <BookNotesToolbar
                        searchTerm={searchTerm}
                        sortBy={sortBy}
                        onSortChange={handleSortChange}
                        onCreateNote={handleCreateNote}
                        onSearchChange={setSearchTerm}
                        loading={loading}
                    />

                    <TagsFilter
                        allTags={allTags}
                        selectedTags={selectedTags}
                        onToggleTag={toggleTag}
                        onClearFilters={clearFilters}
                    />

                    <AnimatePresence>
                        {isCreating && (
                            <motion.div
                                key="create-note"
                                initial={{opacity: 0, y: 20}}
                                animate={{opacity: 1, y: 0}}
                                exit={{opacity: 0, y: 20}}
                                className="mb-4"
                            >
                                <NoteForm
                                    form={createForm}
                                    onSubmit={handleCreateSubmit}
                                    onCancel={handleCancelCreate}
                                    loading={loading}
                                    submitText="Création de la note"
                                    isEdit={false}
                                    title={book.title}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {editingNote && (
                            <motion.div
                                key="edit-note"
                                initial={{opacity: 0, y: 20}}
                                animate={{opacity: 1, y: 0}}
                                exit={{opacity: 0, y: 20}}
                                className="mb-4"
                            >
                                <NoteForm
                                    form={editForm}
                                    onSubmit={handleEditSubmit}
                                    onCancel={handleCancelEdit}
                                    isEdit={true}
                                    loading={loading}
                                    submitText="Modification de la note"
                                    title={book.title}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="h-6 w-6 animate-spin text-blue-500"/>
                        </div>
                    ) : filteredAndSortedNotes.length > 0 ? (
                        <motion.div
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: 20}}
                            transition={{duration: 0.3}}
                            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4"
                        >
                            <AnimatePresence
                                initial={false}
                            >
                                {
                                    filteredAndSortedNotes.map(note => (
                                        <BookNoteCard
                                            key={note.id}
                                            note={note}
                                            onEdit={() => startEditing(note)}
                                            onDelete={() => handleDeleteNote(note.id)}
                                            deleteLoading={deleteLoading}
                                            loading={loading}
                                        />
                                    ))
                                }
                            </AnimatePresence>
                        </motion.div>
                    ) : (
                        <EmptyState hasFilters={hasFilters} onCreateNote={handleCreateNote}/>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
        ;
});

BookNotesModal.displayName = 'NewBookNotesModal';

export default BookNotesModal;
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  StickyNote,
  Plus,
  Search,
  Trash2,
  Edit3,
  Save,
  X,
  BookOpen,
  Calendar,
  Tag,
  FileText,
  SortAsc,
  Quote
} from 'lucide-react';
import { BookNoteType, Note, MoreInfoBook } from "@/types";
import { BookNotesConstants } from "@/constants/books/notes";

interface BookNotesProps {
  book: MoreInfoBook;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const BookNotesModal = ({ book, isOpen, setIsOpen }: BookNotesProps) => {
  const [notes, setNotes] = useState<Note[]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'page' | 'title'>('date');
  const [isCreating, setIsCreating] = useState(false);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    page: '',
    chapter: '',
    tags: '',
    type: BookNotesConstants.note as BookNoteType
  });

  const filteredAndSortedNotes = useMemo(() => {
    const filtered = notes.filter(note => {
      const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTags = selectedTags.length === 0 ||
        selectedTags.some(tag => note.tags.includes(tag));
      return matchesSearch && matchesTags;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'page':
          return (a.page || 0) - (b.page || 0);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'date':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [notes, searchTerm, selectedTags, sortBy]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    notes.forEach(note => note.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags);
  }, [notes]);

  const createNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return;

    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      page: newNote.page ? parseInt(newNote.page) : undefined,
      chapter: newNote.chapter || undefined,
      tags: newNote.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      createdAt: "",
      updatedAt: "",
      type: newNote.type
    };

    setNotes(prev => [note, ...prev]);
    setNewNote({ title: '', content: '', page: '', chapter: '', tags: '', type: 'Note' });
    setIsCreating(false);
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  // const updateNote = (id: string, updates: Partial<Note>) => {
  //   setNotes(prev => prev.map(note =>
  //     note.id === id
  //       ? { ...note, ...updates, updatedAt: new Date() }
  //       : note
  //   ));
  // };

  const getTypeIcon = (type: BookNoteType) => {
    switch (type) {
      case BookNotesConstants.quote: // "Quote"
        return <Quote className="h-4 w-4" />;
      case BookNotesConstants.thought: // "Thought"
        return <Edit3 className="h-4 w-4" />;
      case BookNotesConstants.summary: // "Summary"
        return <BookOpen className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: BookNoteType) => {
    switch (type) {
      case BookNotesConstants.quote: // "Quote"
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case BookNotesConstants.thought: // "Thought"
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case BookNotesConstants.summary: // "Summary"
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <>
      {/* Modal des notes */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Notes - {book.title}
            </DialogTitle>
            <DialogDescription>
              Gérez vos notes, citations et réflexions pour ce livre
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-hidden flex flex-col gap-4">
            {/* Barre d'outils */}
            <div className="flex flex-col sm:flex-row gap-2 pb-2 border-b">
              <div className="flex-1 relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher dans les notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortBy(sortBy === 'date' ? 'page' : sortBy === 'page' ? 'title' : 'date')}
                >
                  <SortAsc className="h-4 w-4 mr-1" />
                  {sortBy === 'date' ? 'Date' : sortBy === 'page' ? 'Page' : 'Titre'}
                </Button>

                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setIsCreating(true)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Nouvelle note
                </Button>
              </div>
            </div>

            {/* Tags filter */}
            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer transition-colors"
                    onClick={() => {
                      setSelectedTags(prev =>
                        prev.includes(tag)
                          ? prev.filter(t => t !== tag)
                          : [...prev, tag]
                      );
                    }}
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
                {selectedTags.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTags([])}
                    className="h-6 px-2"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            )}

            {/* Liste des notes */}
            <div className="flex-1 overflow-y-auto space-y-3">
              <AnimatePresence>
                {/* Formulaire de création */}
                {isCreating && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <Card className="border-2 border-dashed border-primary/30">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Nouvelle note</CardTitle>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setIsCreating(false)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex gap-2 mb-3">
                          {Object.entries(BookNotesConstants).map(([key, value]) => (
                            <Button
                              key={key}
                              variant={newNote.type === value ? "default" : "outline"}
                              size="sm"
                              onClick={() => setNewNote(prev => ({
                                ...prev,
                                type: value
                              }))}
                            >
                              {getTypeIcon(value)}
                              <span className="ml-1">
                                {value}
                              </span>
                            </Button>
                          ))}
                        </div>

                        <Input
                          placeholder="Titre de la note"
                          value={newNote.title}
                          onChange={(e) => setNewNote(prev => ({
                            ...prev,
                            title: e.target.value
                          }))}
                        />

                        <Textarea
                          placeholder="Contenu de la note..."
                          value={newNote.content}
                          onChange={(e) => setNewNote(prev => ({
                            ...prev,
                            content: e.target.value
                          }))}
                          rows={4}
                        />

                        <div className="flex gap-2">
                          <Input
                            placeholder="Page (optionnel)"
                            value={newNote.page}
                            onChange={(e) => setNewNote(prev => ({
                              ...prev,
                              page: e.target.value
                            }))}
                            type="number"
                            className="w-24"
                          />
                          <Input
                            placeholder="Chapitre (optionnel)"
                            value={newNote.chapter}
                            onChange={(e) => setNewNote(prev => ({
                              ...prev,
                              chapter: e.target.value
                            }))}
                            className="flex-1"
                          />
                        </div>

                        <Input
                          placeholder="Tags (séparés par des virgules)"
                          value={newNote.tags}
                          onChange={(e) => setNewNote(prev => ({
                            ...prev,
                            tags: e.target.value
                          }))}
                        />

                        <Button onClick={createNote} className="w-full">
                          <Save className="h-4 w-4 mr-2" />
                          Sauvegarder
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Notes existantes */}
                {filteredAndSortedNotes.map((note) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    layout
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={`text-xs ${getTypeColor(note.type)}`}>
                                {getTypeIcon(note.type)}
                                <span className="ml-1">
                                  {note.type}
                                </span>
                              </Badge>
                              {note.page && (
                                <Badge variant="outline" className="text-xs">
                                  Page {note.page}
                                </Badge>
                              )}
                            </div>
                            <CardTitle className="text-lg">{note.title}</CardTitle>
                            {note.chapter && (
                              <p className="text-sm text-muted-foreground">{note.chapter}</p>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingNote(editingNote === note.id ? null : note.id)}
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNote(note.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {note.content}
                          </p>

                          {note.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {note.tags.map((tag, idx) => (
                                <Badge key={idx} variant="secondary"
                                  className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}

                          <div
                            className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            Créé le {new Date(note.createdAt).toLocaleDateString('fr-FR')}
                            {new Date(note.updatedAt).getTime() !== new Date(note.createdAt).getTime() && (
                              <span>• Modifié le {new Date(note.updatedAt).toLocaleDateString('fr-FR')}</span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredAndSortedNotes.length === 0 && !isCreating && (
                <div className="text-center py-8 text-muted-foreground">
                  <StickyNote className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>
                    {searchTerm || selectedTags.length > 0
                      ? "Aucune note ne correspond à vos critères"
                      : "Aucune note pour ce livre"}
                  </p>
                  <Button
                    variant="outline"
                    className="mt-3"
                    onClick={() => setIsCreating(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Créer votre première note
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BookNotesModal;

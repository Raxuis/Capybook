import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
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
  Quote,
  Loader2
} from 'lucide-react';
import { MoreInfoBook } from "@/types";
import { BookNoteType } from "@prisma/client";

// Schémas Zod pour les formulaires
const noteFormSchema = z.object({
  note: z.string().min(1, 'Le contenu de la note est requis'),
  page: z.string().optional(),
  chapter: z.string().optional(),
  tags: z.string().optional(),
  type: z.nativeEnum(BookNoteType).optional(),
});

type NoteFormData = z.infer<typeof noteFormSchema>;

// Interface pour les notes depuis l'API
interface ApiNote {
  id: string;
  note: string;
  page?: number;
  chapter?: number;
  tags: string[];
  type: BookNoteType;
  createdAt: string;
  updatedAt: string;
  User: {
    name: string;
    username: string;
  };
  Book: {
    title: string;
  };
}

interface BookNotesProps {
  book: MoreInfoBook;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  userId: string;
}

const BookNotesModal = ({ book, isOpen, setIsOpen, userId }: BookNotesProps) => {
  const [notes, setNotes] = useState<ApiNote[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'createdAt' | 'page'>('createdAt');
  const [isCreating, setIsCreating] = useState(false);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const { toast } = useToast();

  // Form pour créer une note
  const createForm = useForm<NoteFormData>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      note: '',
      page: '',
      chapter: '',
      tags: '',
      type: BookNoteType.NOTE,
    },
  });

  // Form pour éditer une note
  const editForm = useForm<NoteFormData>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      note: '',
      page: '',
      chapter: '',
      tags: '',
      type: BookNoteType.NOTE,
    },
  });

  useEffect(() => {
    if (isOpen && book.id) {
      fetchNotes();
    }
  }, [isOpen, book.id]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        sortBy,
        ...(searchTerm && { search: searchTerm }),
        ...(selectedTags.length > 0 && { tags: selectedTags.join(',') }),
      });

      const response = await fetch(`/api/user/${userId}/book/${book.id}/notes?${params}`);

      console.log(`Fetching notes with params: ${params.toString()}`);
      console.log("response", response);

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des notes');
      }

      const data = await response.json();
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
  };

  // Recharger les notes quand les filtres changent
  useEffect(() => {
    if (isOpen && book.id) {
      const debounceTimer = setTimeout(() => {
        fetchNotes();
      }, 300);

      return () => clearTimeout(debounceTimer);
    }
  }, [searchTerm, selectedTags, sortBy]);

  const filteredAndSortedNotes = useMemo(() => {
    return notes.filter(note => {
      const matchesSearch = !searchTerm ||
        note.note.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTags = selectedTags.length === 0 ||
        selectedTags.some(tag => note.tags.includes(tag));
      return matchesSearch && matchesTags;
    });
  }, [notes, searchTerm, selectedTags]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    notes.forEach(note => note.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags);
  }, [notes]);

  const onCreateSubmit = async (data: NoteFormData) => {
    try {
      setLoading(true);

      const payload = {
        note: data.note,
        page: data.page || undefined,
        chapter: data.chapter || undefined,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
        type: data.type || BookNoteType.NOTE,
      };

      const response = await fetch(`/api/user/${userId}/book/${book.id}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la note');
      }

      const newNote = await response.json();
      setNotes(prev => [newNote, ...prev]);
      setIsCreating(false);
      createForm.reset();

      toast({
        title: "Succès",
        description: "Note créée avec succès",
      });
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la note",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onEditSubmit = async (data: NoteFormData) => {
    if (!editingNote) return;

    try {
      setLoading(true);

      const payload = {
        note: data.note,
        page: data.page || undefined,
        chapter: data.chapter || undefined,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
        type: data.type || BookNoteType.NOTE,
      };

      const response = await fetch(`/api/user/${userId}/book/${book.id}/notes/${editingNote}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de la note');
      }

      const updatedNote = await response.json();
      setNotes(prev => prev.map(note =>
        note.id === editingNote ? updatedNote : note
      ));
      setEditingNote(null);

      toast({
        title: "Succès",
        description: "Note mise à jour avec succès",
      });
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la note",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      setDeleteLoading(noteId);

      const response = await fetch(`/api/user/${userId}/book/${book.id}/notes/${noteId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          noteId,
          bookId: book.id,
          userId: 'current-user-id', // À adapter selon votre système d'auth
        }),
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
  };

  const startEditing = (note: ApiNote) => {
    setEditingNote(note.id);
    editForm.reset({
      note: note.note,
      page: note.page?.toString() || '',
      chapter: note.chapter?.toString() || '',
      tags: note.tags.join(', '),
      type: note.type,
    });
  };

  const getTypeIcon = (type: BookNoteType) => {
    switch (type) {
      case BookNoteType.QUOTE:
        return <Quote className="h-4 w-4" />;
      case BookNoteType.THOUGHT:
        return <Edit3 className="h-4 w-4" />;
      case BookNoteType.SUMMARY:
        return <BookOpen className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: BookNoteType) => {
    switch (type) {
      case BookNoteType.QUOTE:
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case BookNoteType.THOUGHT:
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case BookNoteType.SUMMARY:
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
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
                onClick={() => setSortBy(sortBy === 'createdAt' ? 'page' : 'createdAt')}
              >
                <SortAsc className="h-4 w-4 mr-1" />
                {sortBy === 'createdAt' ? 'Date' : 'Page'}
              </Button>

              <Button
                variant="default"
                size="sm"
                onClick={() => setIsCreating(true)}
                disabled={loading}
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
            {loading && notes.length === 0 && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                Chargement des notes...
              </div>
            )}

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
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setIsCreating(false);
                            createForm.reset();
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Form {...createForm}>
                        <form onSubmit={createForm.handleSubmit(onCreateSubmit)}
                          className="space-y-4">
                          <FormField
                            control={createForm.control}
                            name="type"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Type de note</FormLabel>
                                <Select onValueChange={field.onChange}
                                  defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue
                                        placeholder="Sélectionnez un type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {Object.values(BookNoteType).map((type) => (
                                      <SelectItem key={type} value={type}>
                                        <div
                                          className="flex items-center gap-2">
                                          {getTypeIcon(type)}
                                          {type}
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={createForm.control}
                            name="note"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Contenu</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Écrivez votre note ici..."
                                    {...field}
                                    rows={4}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="flex gap-2">
                            <FormField
                              control={createForm.control}
                              name="page"
                              render={({ field }) => (
                                <FormItem className="w-24">
                                  <FormLabel>Page</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder="Page"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={createForm.control}
                              name="chapter"
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormLabel>Chapitre</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Nom du chapitre"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={createForm.control}
                            name="tags"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Tags</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Tags séparés par des virgules"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Création...
                              </>
                            ) : (
                              <>
                                <Save className="h-4 w-4 mr-2" />
                                Sauvegarder
                              </>
                            )}
                          </Button>
                        </form>
                      </Form>
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
                              <span className="ml-1">{note.type}</span>
                            </Badge>
                            {note.page && (
                              <Badge variant="outline" className="text-xs">
                                Page {note.page}
                              </Badge>
                            )}
                          </div>
                          {note.chapter && (
                            <p className="text-sm text-muted-foreground mb-2">{note.chapter}</p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditing(note)}
                            disabled={loading}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNote(note.id)}
                            className="text-destructive hover:text-destructive"
                            disabled={deleteLoading === note.id}
                          >
                            {deleteLoading === note.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {editingNote === note.id ? (
                        <Form {...editForm}>
                          <form onSubmit={editForm.handleSubmit(onEditSubmit)}
                            className="space-y-4">
                            <FormField
                              control={editForm.control}
                              name="type"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Type de note</FormLabel>
                                  <Select onValueChange={field.onChange}
                                    value={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {Object.values(BookNoteType).map((type) => (
                                        <SelectItem key={type} value={type}>
                                          <div
                                            className="flex items-center gap-2">
                                            {getTypeIcon(type)}
                                            {type}
                                          </div>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={editForm.control}
                              name="note"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Textarea {...field} rows={4} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="flex gap-2">
                              <FormField
                                control={editForm.control}
                                name="page"
                                render={({ field }) => (
                                  <FormItem className="w-24">
                                    <FormControl>
                                      <Input type="number"
                                        placeholder="Page" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={editForm.control}
                                name="chapter"
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormControl>
                                      <Input placeholder="Chapitre" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <FormField
                              control={editForm.control}
                              name="tags"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      placeholder="Tags séparés par des virgules" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="flex gap-2">
                              <Button type="submit" disabled={loading}>
                                {loading ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Mise à jour...
                                  </>
                                ) : (
                                  <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Sauvegarder
                                  </>
                                )}
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingNote(null)}
                              >
                                Annuler
                              </Button>
                            </div>
                          </form>
                        </Form>
                      ) : (
                        <div className="space-y-3">
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {note.note}
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
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredAndSortedNotes.length === 0 && !isCreating && !loading && (
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
  );
};

export default BookNotesModal;

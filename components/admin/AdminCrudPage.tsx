'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, Edit, Plus, User, Book, Tag, Award, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  getUsers, createUser, updateUser, deleteUser,
  getBooks, createBook, updateBook, deleteBook,
  getGenres, createGenre, updateGenre, deleteGenre,
  getBadges, createBadge, updateBadge, deleteBadge,
  getUserReadingGoals
} from '@/actions/admin/crud';

// Types
export type EntitySlug = 'users' | 'books' | 'genres' | 'badges' | 'goals';

// Schemas de validation (inchangés)
const userSchema = z.object({
  email: z.string().email('Email invalide'),
  username: z.string().min(3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères'),
  name: z.string().optional(),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères').optional(),
  favoriteColor: z.string().default('#3b82f6'),
  role: z.enum(['USER', 'ADMIN', 'MODERATOR']).default('USER')
});

const bookSchema = z.object({
  key: z.string().min(1, 'La clé est requise'),
  title: z.string().min(1, 'Le titre est requis'),
  authors: z.string().min(1, 'Au moins un auteur est requis'),
  cover: z.string().url('URL de couverture invalide').optional().or(z.literal('')),
  numberOfPages: z.coerce.number().positive('Le nombre de pages doit être positif').optional()
});

const genreSchema = z.object({
  name: z.string().min(1, 'Le nom du genre est requis')
});

const badgeSchema = z.object({
  name: z.string().min(1, 'Le nom du badge est requis'),
  ownerDescription: z.string().min(1, 'La description propriétaire est requise'),
  publicDescription: z.string().min(1, 'La description publique est requise'),
  category: z.enum(['BOOKS_READ', 'PAGES_READ', 'REVIEWS_WRITTEN', 'GOALS_COMPLETED', 'READING_STREAK', 'GENRE_EXPLORER', 'SPECIAL']),
  requirement: z.coerce.number().positive('Le requirement doit être positif'),
  icon: z.string().optional()
});

const goalSchema = z.object({
  target: z.coerce.number().positive('L\'objectif doit être positif'),
  type: z.enum(['BOOKS', 'PAGES', 'TIME']),
  deadline: z.string().min(1, 'La date limite est requise'),
  progress: z.coerce.number().min(0).default(0),
  userId: z.string().min(1, 'L\'utilisateur est requis')
});

// Configuration des entités
const entityConfig = {
  users: {
    title: 'Utilisateurs',
    icon: User,
    schema: userSchema,
    fields: [
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'username', label: 'Nom d\'utilisateur', type: 'text' },
      { name: 'password', label: 'Mot de passe', type: 'password' },
      { name: 'favoriteColor', label: 'Couleur favorite', type: 'color' },
      { name: 'role', label: 'Rôle', type: 'select', options: ['USER', 'ADMIN', 'MODERATOR'] }
    ],
    displayFields: ['email', 'username', 'role']
  },
  books: {
    title: 'Livres',
    icon: Book,
    schema: bookSchema,
    fields: [
      { name: 'key', label: 'Clé', type: 'text' },
      { name: 'title', label: 'Titre', type: 'text' },
      { name: 'authors', label: 'Auteurs (séparés par des virgules)', type: 'text' },
      { name: 'cover', label: 'URL de la couverture', type: 'url' },
      { name: 'numberOfPages', label: 'Nombre de pages', type: 'number' }
    ],
    displayFields: ['title', 'authors', 'numberOfPages']
  },
  genres: {
    title: 'Genres',
    icon: Tag,
    schema: genreSchema,
    fields: [
      { name: 'name', label: 'Nom du genre', type: 'text' }
    ],
    displayFields: ['name']
  },
  badges: {
    title: 'Badges',
    icon: Award,
    schema: badgeSchema,
    fields: [
      { name: 'name', label: 'Nom', type: 'text' },
      { name: 'ownerDescription', label: 'Description propriétaire', type: 'textarea' },
      { name: 'publicDescription', label: 'Description publique', type: 'textarea' },
      { name: 'category', label: 'Catégorie', type: 'select', options: ['BOOKS_READ', 'PAGES_READ', 'REVIEWS_WRITTEN', 'GOALS_COMPLETED', 'READING_STREAK', 'GENRE_EXPLORER', 'SPECIAL'] },
      { name: 'requirement', label: 'Requirement', type: 'number' },
      { name: 'icon', label: 'Icône', type: 'text' }
    ],
    displayFields: ['name', 'category', 'requirement']
  },
  goals: {
    title: 'Objectifs',
    icon: Target,
    schema: goalSchema,
    fields: [
      { name: 'target', label: 'Objectif', type: 'number' },
      { name: 'type', label: 'Type', type: 'select', options: ['BOOKS', 'PAGES', 'TIME'] },
      { name: 'deadline', label: 'Date limite', type: 'date' },
      { name: 'progress', label: 'Progrès', type: 'number' },
      { name: 'userId', label: 'ID Utilisateur', type: 'text' }
    ],
    displayFields: ['target', 'type', 'deadline', 'progress']
  }
};

// Mapping des server actions
const serverActions = {
  users: {
    get: getUsers,
    create: createUser,
    update: updateUser,
    delete: deleteUser
  },
  books: {
    get: getBooks,
    create: createBook,
    update: updateBook,
    delete: deleteBook
  },
  genres: {
    get: getGenres,
    create: createGenre,
    update: updateGenre,
    delete: deleteGenre
  },
  badges: {
    get: getBadges,
    create: createBadge,
    update: updateBadge,
    delete: deleteBadge
  },
  goals: {
    get: getUserReadingGoals, // Pour les goals, on utilise une fonction spécifique
    create: null, // À implémenter selon vos besoins
    update: null, // À implémenter selon vos besoins
    delete: null  // À implémenter selon vos besoins
  }
};

interface AdminCrudPageProps {
  slug: EntitySlug;
}

export default function AdminCrudPage({ slug }: AdminCrudPageProps) {
  const { toast } = useToast();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isPending, startTransition] = useTransition();

  const config = entityConfig[slug];
  const IconComponent = config.icon;
  const actions = serverActions[slug];

  const form = useForm({
    resolver: zodResolver(config.schema),
    defaultValues: getDefaultValues(slug)
  });

  const loadData = useCallback(async () => {
    if (!actions.get) {
      console.warn(`Pas d'action GET disponible pour ${slug}`);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      let result;
      if (slug === 'goals') {
        // Pour les goals, on a besoin d'un userId - vous devrez l'adapter selon votre logique
        const userId = 'default-user-id'; // À remplacer par la logique appropriée
        result = await actions.get(userId);
      } else {
        result = await actions.get();
      }
      setData(result || []);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les données',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [slug, toast, actions]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onSubmit = async (values: any) => {
    if (!actions.create || !actions.update) {
      toast({
        title: 'Erreur',
        description: 'Action non disponible pour cette entité',
        variant: 'destructive'
      });
      return;
    }

    startTransition(async () => {
      try {
        const processedValues = processFormValues(values, slug);

        if (editingItem) {
          await actions.update(editingItem.id, processedValues);
        } else {
          await actions.create(processedValues);
        }

        toast({
          title: 'Succès',
          description: `${config.title} ${editingItem ? 'modifié' : 'créé'} avec succès`
        });

        setDialogOpen(false);
        setEditingItem(null);
        form.reset();
        await loadData();
      } catch (error) {
        console.error('Erreur lors de la soumission du formulaire:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de sauvegarder',
          variant: 'destructive'
        });
      }
    });
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    const formValues = prepareFormValues(item, slug);
    form.reset(formValues);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!actions.delete) {
      toast({
        title: 'Erreur',
        description: 'Suppression non disponible pour cette entité',
        variant: 'destructive'
      });
      return;
    }

    startTransition(async () => {
      try {
        await actions.delete(id);
        toast({
          title: 'Succès',
          description: 'Élément supprimé avec succès'
        });
        await loadData();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de supprimer l\'élément',
          variant: 'destructive'
        });
      }
    });
  };

  const renderFormField = (field: any) => {
    return (
      <FormField
        key={field.name}
        control={form.control}
        name={field.name}
        render={({ field: formField }) => (
          <FormItem>
            <FormLabel>{field.label}</FormLabel>
            <FormControl>
              {field.type === 'textarea' ? (
                <Textarea {...formField} />
              ) : field.type === 'select' ? (
                <Select onValueChange={formField.onChange} value={formField.value}>
                  <SelectTrigger>
                    <SelectValue placeholder={`Sélectionner ${field.label.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options.map((option: string) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input {...formField} type={field.type} />
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  const renderTableCell = (item: any, field: string) => {
    const value = item[field];

    if (field === 'authors' && Array.isArray(value)) {
      return value.join(', ');
    }

    if (field === 'role') {
      return <Badge variant={value === 'ADMIN' ? 'destructive' : 'secondary'}>{value}</Badge>;
    }

    if (field === 'category') {
      return <Badge variant="outline">{value}</Badge>;
    }

    if (field === 'deadline') {
      return new Date(value).toLocaleDateString('fr-FR');
    }

    return value || '-';
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <IconComponent className="h-6 w-6" />
          <h1 className="text-3xl font-bold">{config.title}</h1>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingItem(null);
                form.reset(getDefaultValues(slug));
              }}
              disabled={!actions.create}
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Modifier' : 'Ajouter'} {config.title.slice(0, -1)}
              </DialogTitle>
              <DialogDescription>
                {editingItem ? 'Modifiez' : 'Ajoutez'} les informations ci-dessous
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {config.fields.map(renderFormField)}
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                    disabled={isPending}
                  >
                    Annuler
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? 'En cours...' : (editingItem ? 'Modifier' : 'Ajouter')}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des {config.title}</CardTitle>
          <CardDescription>
            Gérez vos {config.title.toLowerCase()} ici
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  {config.displayFields.map((field) => (
                    <TableHead key={field} className="capitalize">
                      {field}
                    </TableHead>
                  ))}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item) => (
                  <TableRow key={item.id}>
                    {config.displayFields.map((field) => (
                      <TableCell key={field}>
                        {renderTableCell(item, field)}
                      </TableCell>
                    ))}
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(item)}
                          disabled={!actions.update || isPending}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              disabled={!actions.delete || isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                              <AlertDialogDescription>
                                Cette action est irréversible. Cet élément sera définitivement supprimé.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(item.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                disabled={isPending}
                              >
                                {isPending ? 'Suppression...' : 'Supprimer'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Fonctions utilitaires (inchangées mais ajout du userId pour goals)
function getDefaultValues(slug: EntitySlug) {
  switch (slug) {
    case 'users':
      return { email: '', username: '', name: '', password: '', favoriteColor: '#3b82f6', role: 'USER' };
    case 'books':
      return { key: '', title: '', authors: '', cover: '', numberOfPages: undefined };
    case 'genres':
      return { name: '' };
    case 'badges':
      return { name: '', ownerDescription: '', publicDescription: '', category: 'BOOKS_READ', requirement: 1, icon: '' };
    case 'goals':
      return { target: 1, type: 'BOOKS', deadline: '', progress: 0, userId: '' };
    default:
      return {};
  }
}

function prepareFormValues(item: any, slug: EntitySlug) {
  switch (slug) {
    case 'books':
      return {
        ...item,
        authors: Array.isArray(item.authors) ? item.authors.join(', ') : item.authors
      };
    case 'goals':
      return {
        ...item,
        deadline: item.deadline ? new Date(item.deadline).toISOString().split('T')[0] : ''
      };
    default:
      return item;
  }
}

function processFormValues(values: any, slug: EntitySlug) {
  switch (slug) {
    case 'books':
      return {
        ...values,
        authors: values.authors.split(',').map((author: string) => author.trim()).filter(Boolean)
      };
    case 'goals':
      return {
        ...values,
        deadline: new Date(values.deadline).toISOString()
      };
    default:
      return values;
  }
}

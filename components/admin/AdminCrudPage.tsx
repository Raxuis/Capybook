'use client';

import {useState, useEffect, useCallback, useTransition} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Badge} from '@/components/ui/badge';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import {Trash2, Edit, Plus} from 'lucide-react';
import {useToast} from '@/hooks/use-toast';
import {z} from "zod";
import {
    serverActions,
    entityConfig
} from '@/constants/admin/crud';
import {
    EntitySlug,
    FormData,
    BookFormData,
    EntityData,
    GoalFormData,
    BadgeFormData,
    GenreFormData,
    UserFormData,
    FormFieldType,
    GenreEntity,
    BadgeEntity,
    GoalEntity,
    BookEntity,
    UserEntity
} from '@/types/admin/crud'

interface AdminCrudPageProps {
    slug: EntitySlug;
}

export default function AdminCrudPage({slug}: AdminCrudPageProps) {
    const {toast} = useToast();
    const [data, setData] = useState<EntityData[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<EntityData | null>(null);
    const [isPending, startTransition] = useTransition();

    const config = entityConfig[slug];
    const IconComponent = config.icon;
    const actions = serverActions[slug];

    // Hook form utilisé directement dans le composant pour éviter les erreurs de type
    const form = useForm<FormData>({
        resolver: zodResolver(config.schema as z.ZodType<FormData>),
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
            const genericAction = actions.get as () => Promise<EntityData[]>;
            const result = await genericAction();
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

    const onSubmit = async (values: FormData) => {
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
                    if (actions.update) {
                        await actions.update(editingItem.id, processedValues as Partial<FormData>);
                    }
                } else {
                    if (actions.create) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        await actions.create(processedValues as any);
                    }
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

    const handleEdit = (item: EntityData) => {
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
                if (actions.delete) {
                    await actions.delete(id);
                }
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

    const renderFormField = (field: FormFieldType) => {
        return (
            <FormField
                key={field.name}
                control={form.control}
                name={field.name as keyof FormData}
                render={({field: formField}) => (
                    <FormItem>
                        <FormLabel>{field.label}</FormLabel>
                        <FormControl>
                            {field.type === 'textarea' ? (
                                <Textarea {...formField} />
                            ) : field.type === 'select' ? (
                                <Select onValueChange={formField.onChange} value={formField.value as string}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={`Sélectionner ${field.label.toLowerCase()}`}/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {field.options?.map((option: string) => (
                                            <SelectItem key={option} value={option}>
                                                {option}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : (
                                <Input {...formField} type={field.type}/>
                            )}
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
            />
        );
    };

    const renderTableCell = (item: EntityData, field: string) => {
        const value = item[field];

        if (field === 'authors' && Array.isArray(value)) {
            return value.join(', ');
        }

        if (field === 'role') {
            const roleValue = value as string;
            return <Badge variant={roleValue === 'ADMIN' ? 'destructive' : 'secondary'}>{roleValue}</Badge>;
        }

        if (field === 'category') {
            return <Badge variant="outline">{value as string}</Badge>;
        }

        if (field === 'deadline') {
            const dateValue = value instanceof Date ? value : new Date(value as string);
            return dateValue.toLocaleDateString('fr-FR');
        }

        if (field === 'cover' && value === null) {
            return '-';
        }

        if (field === 'numberOfPages' && value === null) {
            return '-';
        }

        return (value as string | number) || '-';
    };

    return (
        <div className="container mx-auto py-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <IconComponent className="h-6 w-6"/>
                    <h1 className="text-3xl font-bold">{config.title}</h1>
                    {
                        loading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        ) : (
                            <span className="text-sm text-muted-foreground">
                ({data.length})
              </span>
                        )
                    }
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
                            <Plus className="h-4 w-4 mr-2"/>
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

            <div>
                {!actions.create && (
                    <span className="text-sm text-red-500 mb-4">
            Action de création non disponible
          </span>
                )}
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
                                        <TableHead key={field as string} className="capitalize">
                                            {field as string}
                                        </TableHead>
                                    ))}
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.map((item) => (
                                    <TableRow key={item.id}>
                                        {config.displayFields.map((field) => (
                                            <TableCell key={field as string}>
                                                {renderTableCell(item, field as string)}
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
                                                    <Edit className="h-4 w-4"/>
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            disabled={!actions.delete || isPending}
                                                        >
                                                            <Trash2 className="h-4 w-4"/>
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Confirmer la
                                                                suppression</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Cette action est irréversible. Cet élément sera
                                                                définitivement supprimé.
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

// Fonctions utilitaires avec types stricts
function getDefaultValues(slug: EntitySlug): FormData {
    switch (slug) {
        case 'users':
            return {
                email: '',
                username: '',
                name: '',
                password: '',
                favoriteColor: '#3b82f6',
                role: 'USER' as const
            } satisfies UserFormData;
        case 'books':
            return {
                key: '',
                title: '',
                authors: '',
                cover: '',
                numberOfPages: undefined
            } satisfies BookFormData;
        case 'genres':
            return {
                name: ''
            } satisfies GenreFormData;
        case 'badges':
            return {
                name: '',
                ownerDescription: '',
                publicDescription: '',
                category: 'BOOKS_READ' as const,
                requirement: 1,
                icon: ''
            } satisfies BadgeFormData;
        case 'goals':
            return {
                target: 1,
                type: 'BOOKS' as const,
                deadline: '',
                progress: 0,
                userId: ''
            } satisfies GoalFormData;
        default:
            throw new Error(`Entity slug ${slug} not supported`);
    }
}

function prepareFormValues(item: EntityData, slug: EntitySlug): FormData {
    switch (slug) {
        case 'books': {
            const bookItem = item as BookEntity;
            return {
                key: bookItem.key,
                title: bookItem.title,
                authors: Array.isArray(bookItem.authors) ? bookItem.authors.join(', ') : bookItem.authors,
                cover: bookItem.cover || '',
                numberOfPages: bookItem.numberOfPages || undefined
            } satisfies BookFormData;
        }
        case 'goals': {
            const goalItem = item as GoalEntity;
            return {
                target: goalItem.target,
                type: goalItem.type as 'BOOKS' | 'PAGES' | 'TIME',
                deadline: goalItem.deadline instanceof Date
                    ? goalItem.deadline.toISOString().split('T')[0]
                    : new Date(goalItem.deadline).toISOString().split('T')[0],
                progress: goalItem.progress,
                userId: goalItem.userId
            } satisfies GoalFormData;
        }
        case 'users': {
            const userItem = item as UserEntity;
            return {
                email: userItem.email,
                username: userItem.username,
                name: userItem.name || '',
                password: '',
                favoriteColor: '#3b82f6',
                role: userItem.role as 'USER' | 'ADMIN' | 'MODERATOR'
            } satisfies UserFormData;
        }
        case 'genres': {
            const genreItem = item as GenreEntity;
            return {
                name: genreItem.name
            } satisfies GenreFormData;
        }
        case 'badges': {
            const badgeItem = item as BadgeEntity;
            return {
                name: badgeItem.name,
                ownerDescription: badgeItem.ownerDescription,
                publicDescription: badgeItem.publicDescription,
                category: badgeItem.category as 'BOOKS_READ' | 'PAGES_READ' | 'REVIEWS_WRITTEN' | 'GOALS_COMPLETED' | 'READING_STREAK' | 'GENRE_EXPLORER' | 'SPECIAL',
                requirement: badgeItem.requirement,
                icon: badgeItem.icon || ''
            } satisfies BadgeFormData;
        }
        default:
            throw new Error(`Entity slug ${slug} not supported`);
    }
}

function processFormValues(values: FormData, slug: EntitySlug): FormData {
    switch (slug) {
        case 'books': {
            const bookValues = values as BookFormData;
            return {
                ...bookValues,
                authors: bookValues.authors.split(',').map((author: string) => author.trim()).filter(Boolean).join(',')
            } satisfies BookFormData;
        }
        case 'goals': {
            const goalValues = values as GoalFormData;
            return {
                ...goalValues,
                deadline: new Date(goalValues.deadline).toISOString()
            } satisfies GoalFormData;
        }
        default:
            return values;
    }
}

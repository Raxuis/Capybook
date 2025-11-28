import React, {useState} from 'react';
import {motion} from 'motion/react';
import {Card, CardContent, CardHeader} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Edit3, Trash2, Calendar, Loader2, Copy, Check, Expand, BookOpen, FileText, MoreVertical} from 'lucide-react';
import {ApiNote} from '@/types';
import {BookNoteType} from '@prisma/client';
import {getTypeIcon, getTypeColorAll, getTypeBackgroundColor, getTypeAccentColor} from '@/utils/bookNotes';
import {useCopyToClipboard} from "@/hooks/use-copy-to-clipboard";
import {useToast} from "@/hooks/use-toast";
import {formatBookNoteType} from "@/utils/format";

interface NoteCardProps {
    note: ApiNote;
    onEdit: (note: ApiNote) => void;
    onDelete: (noteId: string) => void;
    loading: boolean;
    deleteLoading: string | null;
}

export const BookNoteCard = ({
                                 note,
                                 onEdit,
                                 onDelete,
                                 loading,
                                 deleteLoading,
                             }: NoteCardProps) => {
    const {toast} = useToast();
    const [expanded, setExpanded] = useState(false);
    const [showMobileActions, setShowMobileActions] = useState(false);
    const {
        copy,
        isCopied,
        setIsCopied
    } = useCopyToClipboard({isCopiedDelay: 2000});

    const isLongNote = note.note.length > 200;
    const displayNote = !expanded && isLongNote
        ? note.note.substring(0, 200) + '...'
        : note.note;

    // Récupération des couleurs thématiques
    const accentColors = getTypeAccentColor(note.type as BookNoteType);

    const handleCopy = async () => {
        try {
            await copy(note.note);
            setIsCopied(true);
        } catch (err) {
            setIsCopied(false);
            console.error('Failed to copy note:', err);
            toast({
                title: "Erreur",
                description: "Impossible de copier la note",
                variant: "destructive",
            });
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return 'Aujourd\'hui';
        if (diffDays === 2) return 'Hier';
        if (diffDays <= 7) return `Il y a ${diffDays - 1} jours`;
        return date.toLocaleDateString('fr-FR');
    };

    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -20}}
            layout
            transition={{duration: 0.2}}
            className="transition-transform duration-200 hover:scale-[1.02]"
        >
            <Card
                className={`${getTypeBackgroundColor(note.type as BookNoteType)} group relative flex h-full flex-col overflow-hidden border-slate-200/60 transition-all duration-300 hover:shadow-xl dark:border-slate-700/60`}
            >

                <CardHeader className="relative pb-3">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                            <div className="mb-3 flex flex-wrap items-center gap-2">
                                <Badge
                                    className={`text-xs font-medium shadow-sm ${getTypeColorAll(note.type as BookNoteType)} cursor-default border-0`}>
                                    {getTypeIcon(note.type as BookNoteType)}
                                    <span className="ml-1.5 capitalize">
                                        {formatBookNoteType(note.type as BookNoteType)}
                                    </span>
                                </Badge>
                            </div>

                            <div className="mb-2 flex flex-wrap items-center gap-3 text-sm">
                                {note.chapter && (
                                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                                        <BookOpen
                                            className="size-3.5 shrink-0 text-slate-400 dark:text-slate-500"/>
                                        <span className="text-xs font-medium sm:text-sm">
                                            Chapitre{' '}
                                            {note.chapter}
                                        </span>
                                    </div>
                                )}
                                {note.page && (
                                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                                        <FileText
                                            className="size-3.5 shrink-0 text-slate-400 dark:text-slate-500"/>
                                        <span className="text-xs font-medium sm:text-sm">Page {note.page}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions Desktop (hover) */}
                        <div
                            className="hidden gap-1 rounded-lg bg-white/90 p-1 opacity-0 shadow-sm backdrop-blur-sm transition-all duration-200 group-hover:opacity-100 md:flex">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCopy}
                                className="size-8 p-0 text-slate-500 hover:bg-green-50 hover:text-green-600"
                                title="Copier la note"
                            >
                                {isCopied ? (
                                    <Check className="size-3.5 text-green-600"/>
                                ) : (
                                    <Copy className="size-3.5"/>
                                )}
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onEdit(note)}
                                disabled={loading}
                                className="size-8 p-0 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                                title="Modifier la note"
                            >
                                <Edit3 className="size-3.5"/>
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDelete(note.id)}
                                className="size-8 p-0 text-slate-500 hover:bg-red-50 hover:text-red-600"
                                disabled={deleteLoading === note.id}
                                title="Supprimer la note"
                            >
                                {deleteLoading === note.id ? (
                                    <Loader2 className="size-3.5 animate-spin"/>
                                ) : (
                                    <Trash2 className="size-3.5"/>
                                )}
                            </Button>
                        </div>

                        {/* Bouton Menu Mobile */}
                        <div className="md:hidden">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowMobileActions(!showMobileActions)}
                                className="size-8 p-0 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                                title="Actions"
                            >
                                <MoreVertical className="size-4"/>
                            </Button>
                        </div>
                    </div>

                    {/* Actions Mobile (dropdown) */}
                    {showMobileActions && (
                        <motion.div
                            initial={{opacity: 0, y: -10}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -10}}
                            className="absolute right-4 top-16 z-10 rounded-lg border border-slate-200 bg-white p-1 shadow-lg md:hidden dark:border-slate-700 dark:bg-slate-800"
                        >
                            <div className="flex flex-col gap-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        handleCopy();
                                        setShowMobileActions(false);
                                    }}
                                    className={`h-8 justify-start px-3 text-sm text-slate-600 dark:text-slate-300 ${accentColors.copy}`}
                                >
                                    {isCopied ? (
                                        <>
                                            <Check className="mr-2 size-3.5 text-green-600 dark:text-green-400"/>
                                            Copié
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="mr-2 size-3.5"/>
                                            Copier
                                        </>
                                    )}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        onEdit(note);
                                        setShowMobileActions(false);
                                    }}
                                    disabled={loading}
                                    className={`h-8 justify-start px-3 text-sm text-slate-600 dark:text-slate-300 ${accentColors.edit}`}
                                >
                                    <Edit3 className="mr-2 size-3.5"/>
                                    Modifier
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        onDelete(note.id);
                                        setShowMobileActions(false);
                                    }}
                                    className={`h-8 justify-start px-3 text-sm text-slate-600 dark:text-slate-300 ${accentColors.delete}`}
                                    disabled={deleteLoading === note.id}
                                >
                                    {deleteLoading === note.id ? (
                                        <>
                                            <Loader2 className="mr-2 size-3.5 animate-spin"/>
                                            Suppression...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="mr-2 size-3.5"/>
                                            Supprimer
                                        </>
                                    )}
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </CardHeader>

                <CardContent className="flex flex-1 flex-col">
                    <div className="flex-1 space-y-4">
                        <div
                            className="relative rounded-xl border border-slate-200/50 bg-gradient-to-br from-white to-slate-50/50 p-3 shadow-sm backdrop-blur-sm transition-shadow duration-200 hover:shadow-md sm:p-4 dark:border-slate-700/50 dark:from-slate-800/50 dark:to-slate-900/50">
                            <p className="whitespace-pre-wrap text-sm font-medium leading-relaxed tracking-wide text-slate-800 sm:text-[15px] dark:text-slate-200">
                                {displayNote}
                            </p>

                            {isLongNote && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setExpanded(!expanded)}
                                    className="mt-2 h-auto p-1 text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                                >
                                    {expanded ? (
                                        <>
                                            <Expand className="mr-1 size-3 rotate-180"/>
                                            Voir moins
                                        </>
                                    ) : (
                                        <>
                                            <Expand className="mr-1 size-3"/>
                                            Voir plus
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>

                        {note.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {note.tags.map((tag, idx) => (
                                    <Badge
                                        key={idx}
                                        variant="secondary"
                                        className="cursor-default border-0 bg-slate-100/80 px-2 py-1 text-xs text-slate-700 transition-colors hover:bg-slate-200/80 dark:bg-slate-700/80 dark:text-slate-300 dark:hover:bg-slate-600/80"
                                    >
                                        #{tag}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-700">
                        <div
                            className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <div className="flex shrink-0 items-center gap-1.5">
                                <Calendar className="size-3 text-slate-400 dark:text-slate-500"/>
                                <span className="text-xs">Créé {formatDate(note.createdAt)}</span>
                            </div>
                            {new Date(note.updatedAt).getTime() !== new Date(note.createdAt).getTime() && (
                                <div className="flex shrink-0 items-center gap-1.5">
                                    <div className="size-1 rounded-full bg-slate-300 dark:bg-slate-600"/>
                                    <span
                                        className="text-xs text-slate-400 dark:text-slate-500">Modifié {formatDate(note.updatedAt)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Overlay pour fermer le menu mobile */}
            {showMobileActions && (
                <div
                    className="fixed inset-0 z-0 md:hidden"
                    onClick={() => setShowMobileActions(false)}
                />
            )}
        </motion.div>
    );
};
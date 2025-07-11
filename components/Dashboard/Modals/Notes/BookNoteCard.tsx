import React, {useState} from 'react';
import {motion} from 'motion/react';
import {Card, CardContent, CardHeader} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Edit3, Trash2, Calendar, Loader2, Copy, Check, Expand, BookOpen, FileText, MoreVertical} from 'lucide-react';
import {ApiNote} from '@/types';
import {BookNoteType} from '@prisma/client';
import {getTypeIcon, getTypeColor} from '@/utils/bookNotes';
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
            className="hover:scale-[1.02] transition-transform duration-200"
        >
            <Card
                className="hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white via-white to-slate-50/30 border-slate-200/60 overflow-hidden group h-full flex flex-col relative"
            >
                <div
                    className={`absolute top-0 left-0 w-full h-1 ${getTypeColor(note.type as BookNoteType).replace('bg-', 'bg-gradient-to-r from-')}`}/>

                <CardHeader className="pb-3 relative">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-3 flex-wrap">
                                <Badge
                                    className={`text-xs font-medium shadow-sm ${getTypeColor(note.type as BookNoteType)} border-0`}>
                                    {getTypeIcon(note.type as BookNoteType)}
                                    <span className="ml-1.5 capitalize">
                                        {formatBookNoteType(note.type as BookNoteType)}
                                    </span>
                                </Badge>
                            </div>

                            <div className="flex items-center gap-3 mb-2 text-sm flex-wrap">
                                {note.chapter && (
                                    <div className="flex items-center gap-1.5 text-slate-600">
                                        <BookOpen className="h-3.5 w-3.5 text-slate-400 flex-shrink-0"/>
                                        <span className="font-medium text-xs sm:text-sm">
                                            Chapitre{' '}
                                            {note.chapter}
                                        </span>
                                    </div>
                                )}
                                {note.page && (
                                    <div className="flex items-center gap-1.5 text-slate-600">
                                        <FileText className="h-3.5 w-3.5 text-slate-400 flex-shrink-0"/>
                                        <span className="font-medium text-xs sm:text-sm">Page {note.page}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions Desktop (hover) */}
                        <div
                            className="hidden md:flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white/90 backdrop-blur-sm rounded-lg p-1 shadow-sm">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCopy}
                                className="text-slate-500 hover:text-green-600 hover:bg-green-50 h-8 w-8 p-0"
                                title="Copier la note"
                            >
                                {isCopied ? (
                                    <Check className="h-3.5 w-3.5 text-green-600"/>
                                ) : (
                                    <Copy className="h-3.5 w-3.5"/>
                                )}
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onEdit(note)}
                                disabled={loading}
                                className="text-slate-500 hover:text-blue-600 hover:bg-blue-50 h-8 w-8 p-0"
                                title="Modifier la note"
                            >
                                <Edit3 className="h-3.5 w-3.5"/>
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDelete(note.id)}
                                className="text-slate-500 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0"
                                disabled={deleteLoading === note.id}
                                title="Supprimer la note"
                            >
                                {deleteLoading === note.id ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin"/>
                                ) : (
                                    <Trash2 className="h-3.5 w-3.5"/>
                                )}
                            </Button>
                        </div>

                        {/* Bouton Menu Mobile */}
                        <div className="md:hidden">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowMobileActions(!showMobileActions)}
                                className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 h-8 w-8 p-0"
                                title="Actions"
                            >
                                <MoreVertical className="h-4 w-4"/>
                            </Button>
                        </div>
                    </div>

                    {/* Actions Mobile (dropdown) */}
                    {showMobileActions && (
                        <motion.div
                            initial={{opacity: 0, y: -10}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -10}}
                            className="md:hidden absolute right-4 top-16 bg-white rounded-lg shadow-lg border border-slate-200 p-1 z-10"
                        >
                            <div className="flex flex-col gap-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        handleCopy();
                                        setShowMobileActions(false);
                                    }}
                                    className="text-slate-600 hover:text-green-600 hover:bg-green-50 justify-start h-8 px-3 text-sm"
                                >
                                    {isCopied ? (
                                        <>
                                            <Check className="h-3.5 w-3.5 mr-2 text-green-600"/>
                                            Copié
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="h-3.5 w-3.5 mr-2"/>
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
                                    className="text-slate-600 hover:text-blue-600 hover:bg-blue-50 justify-start h-8 px-3 text-sm"
                                >
                                    <Edit3 className="h-3.5 w-3.5 mr-2"/>
                                    Modifier
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        onDelete(note.id);
                                        setShowMobileActions(false);
                                    }}
                                    className="text-slate-600 hover:text-red-600 hover:bg-red-50 justify-start h-8 px-3 text-sm"
                                    disabled={deleteLoading === note.id}
                                >
                                    {deleteLoading === note.id ? (
                                        <>
                                            <Loader2 className="h-3.5 w-3.5 animate-spin mr-2"/>
                                            Suppression...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="h-3.5 w-3.5 mr-2"/>
                                            Supprimer
                                        </>
                                    )}
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </CardHeader>

                <CardContent className="flex-1 flex flex-col">
                    <div className="space-y-4 flex-1">
                        <div
                            className="bg-gradient-to-br from-white to-slate-50/50 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow duration-200 relative">
                            <p className="text-slate-800 leading-relaxed whitespace-pre-wrap font-medium text-sm sm:text-[15px] tracking-wide">
                                {displayNote}
                            </p>

                            {isLongNote && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setExpanded(!expanded)}
                                    className="mt-2 text-xs text-slate-500 hover:text-slate-700 h-auto p-1 font-medium"
                                >
                                    {expanded ? (
                                        <>
                                            <Expand className="h-3 w-3 mr-1 rotate-180"/>
                                            Voir moins
                                        </>
                                    ) : (
                                        <>
                                            <Expand className="h-3 w-3 mr-1"/>
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
                                        className="text-xs bg-slate-100/80 text-slate-700 hover:bg-slate-200/80 transition-colors cursor-default border-0 px-2 py-1"
                                    >
                                        #{tag}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100">
                        <div className="flex items-center justify-between text-xs text-slate-500 gap-2">
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                                <Calendar className="h-3 w-3 text-slate-400"/>
                                <span className="text-xs">Créé {formatDate(note.createdAt)}</span>
                            </div>
                            {new Date(note.updatedAt).getTime() !== new Date(note.createdAt).getTime() && (
                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                    <div className="w-1 h-1 bg-slate-300 rounded-full"/>
                                    <span className="text-slate-400 text-xs">Modifié {formatDate(note.updatedAt)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};
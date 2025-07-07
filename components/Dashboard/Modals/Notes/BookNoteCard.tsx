import React, { useState } from 'react';
import {motion} from 'motion/react';
import {Card, CardContent, CardHeader} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Edit3, Trash2, Calendar, Loader2, Copy, Check, Expand, BookOpen, FileText} from 'lucide-react';
import {ApiNote} from '@/types';
import {BookNoteType} from '@prisma/client';
import {getTypeIcon, getTypeColor} from '@/utils/bookNotes';

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
    const [copied, setCopied] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const isLongNote = note.note.length > 200;
    const displayNote = !expanded && isLongNote
        ? note.note.substring(0, 200) + '...'
        : note.note;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(note.note);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy note:', err);
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
            whileHover={{y: -2}}
        >
            <Card className="hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white via-white to-slate-50/30 border-slate-200/60 overflow-hidden group h-full flex flex-col relative">
                <div className={`absolute top-0 left-0 w-full h-1 ${getTypeColor(note.type as BookNoteType).replace('bg-', 'bg-gradient-to-r from-')}`} />

                <CardHeader className="pb-3 relative">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-3 flex-wrap">
                                <Badge
                                    className={`text-xs font-medium shadow-sm ${getTypeColor(note.type as BookNoteType)} border-0`}>
                                    {getTypeIcon(note.type as BookNoteType)}
                                    <span className="ml-1.5 capitalize">{note.type}</span>
                                </Badge>
                            </div>

                            <div className="flex items-center gap-3 mb-2 text-sm">
                                {note.chapter && (
                                    <div className="flex items-center gap-1.5 text-slate-600">
                                        <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                                        <span className="font-medium">
                                            Chapitre{' '}
                                            {note.chapter}
                                        </span>
                                    </div>
                                )}
                                {note.page && (
                                    <div className="flex items-center gap-1.5 text-slate-600">
                                        <FileText className="h-3.5 w-3.5 text-slate-400" />
                                        <span className="font-medium">Page {note.page}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white/90 backdrop-blur-sm rounded-lg p-1 shadow-sm">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCopy}
                                className="text-slate-500 hover:text-green-600 hover:bg-green-50 h-8 w-8 p-0"
                                title="Copier la note"
                            >
                                {copied ? (
                                    <Check className="h-3.5 w-3.5 text-green-600" />
                                ) : (
                                    <Copy className="h-3.5 w-3.5" />
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
                    </div>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col">
                    <div className="space-y-4 flex-1">
                        <div className="bg-gradient-to-br from-white to-slate-50/50 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow duration-200 relative">
                            <p className="text-slate-800 leading-relaxed whitespace-pre-wrap font-medium text-[15px] tracking-wide">
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
                                            <Expand className="h-3 w-3 mr-1 rotate-180" />
                                            Voir moins
                                        </>
                                    ) : (
                                        <>
                                            <Expand className="h-3 w-3 mr-1" />
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
                        <div className="flex items-center justify-between text-xs text-slate-500">
                            <div className="flex items-center gap-1.5">
                                <Calendar className="h-3 w-3 text-slate-400"/>
                                <span>Créé {formatDate(note.createdAt)}</span>
                            </div>
                            {new Date(note.updatedAt).getTime() !== new Date(note.createdAt).getTime() && (
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1 h-1 bg-slate-300 rounded-full" />
                                    <span className="text-slate-400">Modifié {formatDate(note.updatedAt)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};
import { BookNoteType } from '@prisma/client';
import { Quote, Edit3, BookOpen, FileText } from 'lucide-react';

export const getTypeIcon = (type: BookNoteType) => {
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

export const getTypeColor = (type: BookNoteType) => {
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
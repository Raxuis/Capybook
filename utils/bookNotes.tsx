import {BookNoteType} from '@prisma/client';
import {Quote, Edit3, BookOpen, FileText} from 'lucide-react';

export const getTypeIcon = (type: BookNoteType) => {
    switch (type) {
        case BookNoteType.QUOTE:
            return <Quote className="h-4 w-4"/>;
        case BookNoteType.THOUGHT:
            return <Edit3 className="h-4 w-4"/>;
        case BookNoteType.SUMMARY:
            return <BookOpen className="h-4 w-4"/>;
        default:
            return <FileText className="h-4 w-4"/>;
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

export const getTypeColorHover = (type: BookNoteType) => {
    switch (type) {
        case BookNoteType.QUOTE:
            return 'hover:bg-amber-200 hover:text-amber-900 hover:border-amber-300';
        case BookNoteType.THOUGHT:
            return 'hover:bg-purple-200 hover:text-purple-900 hover:border-purple-300';
        case BookNoteType.SUMMARY:
            return 'hover:bg-green-200 hover:text-green-900 hover:border-green-300';
        default:
            return 'hover:bg-blue-200 hover:text-blue-900 hover:border-blue-300';
    }
};

export const getTypeColorDark = (type: BookNoteType) => {
    switch (type) {
        case BookNoteType.QUOTE:
            return 'dark:bg-amber-900/20 dark:text-amber-200 dark:border-amber-800/30';
        case BookNoteType.THOUGHT:
            return 'dark:bg-purple-900/20 dark:text-purple-200 dark:border-purple-800/30';
        case BookNoteType.SUMMARY:
            return 'dark:bg-green-900/20 dark:text-green-200 dark:border-green-800/30';
        default:
            return 'dark:bg-blue-900/20 dark:text-blue-200 dark:border-blue-800/30';
    }
};

export const getTypeColorDarkHover = (type: BookNoteType) => {
    switch (type) {
        case BookNoteType.QUOTE:
            return 'dark:hover:bg-amber-800/30 dark:hover:text-amber-100 dark:hover:border-amber-700/50';
        case BookNoteType.THOUGHT:
            return 'dark:hover:bg-purple-800/30 dark:hover:text-purple-100 dark:hover:border-purple-700/50';
        case BookNoteType.SUMMARY:
            return 'dark:hover:bg-green-800/30 dark:hover:text-green-100 dark:hover:border-green-700/50';
        default:
            return 'dark:hover:bg-blue-800/30 dark:hover:text-blue-100 dark:hover:border-blue-700/50';
    }
};

export const getTypeColorAll = (type: BookNoteType) => {
    return `${getTypeColor(type)} ${getTypeColorHover(type)} ${getTypeColorDark(type)} ${getTypeColorDarkHover(type)}`;
};

export const getTypeBackgroundColor = (type: BookNoteType) => {
    switch (type) {
        case BookNoteType.QUOTE:
            return 'bg-gradient-to-br from-amber-50/50 via-white to-amber-50/30 dark:from-amber-950/10 dark:via-slate-900 dark:to-amber-950/5';
        case BookNoteType.THOUGHT:
            return 'bg-gradient-to-br from-purple-50/50 via-white to-purple-50/30 dark:from-purple-950/10 dark:via-slate-900 dark:to-purple-950/5';
        case BookNoteType.SUMMARY:
            return 'bg-gradient-to-br from-green-50/50 via-white to-green-50/30 dark:from-green-950/10 dark:via-slate-900 dark:to-green-950/5';
        default:
            return 'bg-gradient-to-br from-blue-50/50 via-white to-blue-50/30 dark:from-blue-950/10 dark:via-slate-900 dark:to-blue-950/5';
    }
};

export const getTypeAccentColor = (type: BookNoteType) => {
    switch (type) {
        case BookNoteType.QUOTE:
            return {
                copy: 'hover:text-amber-600 hover:bg-amber-50 dark:hover:text-amber-400 dark:hover:bg-amber-900/20',
                edit: 'hover:text-amber-600 hover:bg-amber-50 dark:hover:text-amber-400 dark:hover:bg-amber-900/20',
                delete: 'hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-900/20'
            };
        case BookNoteType.THOUGHT:
            return {
                copy: 'hover:text-purple-600 hover:bg-purple-50 dark:hover:text-purple-400 dark:hover:bg-purple-900/20',
                edit: 'hover:text-purple-600 hover:bg-purple-50 dark:hover:text-purple-400 dark:hover:bg-purple-900/20',
                delete: 'hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-900/20'
            };
        case BookNoteType.SUMMARY:
            return {
                copy: 'hover:text-green-600 hover:bg-green-50 dark:hover:text-green-400 dark:hover:bg-green-900/20',
                edit: 'hover:text-green-600 hover:bg-green-50 dark:hover:text-green-400 dark:hover:bg-green-900/20',
                delete: 'hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-900/20'
            };
        default:
            return {
                copy: 'hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:bg-blue-900/20',
                edit: 'hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:bg-blue-900/20',
                delete: 'hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-900/20'
            };
    }
};
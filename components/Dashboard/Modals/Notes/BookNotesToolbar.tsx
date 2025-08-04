import React from 'react';
import {Search, SortAsc, Plus} from 'lucide-react';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';

interface BookNotesToolbarProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    sortBy: 'createdAt' | 'page';
    onSortChange: () => void;
    onCreateNote: () => void;
    loading: boolean;
}

export const BookNotesToolbar = ({
                                     searchTerm,
                                     onSearchChange,
                                     sortBy,
                                     onSortChange,
                                     onCreateNote,
                                     loading,
                                 }: BookNotesToolbarProps) => {
    return (
        <div className="flex flex-col gap-2 border-b pb-2 sm:flex-row">
            <div className="relative flex-1">
                <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2"/>
                <Input
                    placeholder="Rechercher dans les notes..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10"
                />
            </div>
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onSortChange}
                >
                    <SortAsc className="mr-1 size-4"/>
                    {sortBy === 'createdAt' ? 'Date' : 'Page'}
                </Button>
                <Button
                    variant="default"
                    size="sm"
                    onClick={onCreateNote}
                    disabled={loading}
                >
                    <Plus className="mr-1 size-4"/>
                    Nouvelle note
                </Button>
            </div>
        </div>
    );
};
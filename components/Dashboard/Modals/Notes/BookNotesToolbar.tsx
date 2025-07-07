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
        <div className="flex flex-col sm:flex-row gap-2 pb-2 border-b">
            <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                <Input
                    placeholder="Rechercher dans les notes..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10"
                />
            </div>
            <div className="flex gap-2 items-center">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onSortChange}
                >
                    <SortAsc className="h-4 w-4 mr-1"/>
                    {sortBy === 'createdAt' ? 'Date' : 'Page'}
                </Button>
                <Button
                    variant="default"
                    size="sm"
                    onClick={onCreateNote}
                    disabled={loading}
                >
                    <Plus className="h-4 w-4 mr-1"/>
                    Nouvelle note
                </Button>
            </div>
        </div>
    );
};
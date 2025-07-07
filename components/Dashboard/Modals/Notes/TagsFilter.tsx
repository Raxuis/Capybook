import React from 'react';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Tag, X} from 'lucide-react';

interface TagsFilterProps {
    allTags: string[];
    selectedTags: string[];
    onToggleTag: (tag: string) => void;
    onClearFilters: () => void;
}

export const TagsFilter = ({
                               allTags,
                               selectedTags,
                               onToggleTag,
                               onClearFilters,
                           }: TagsFilterProps) => {
    if (allTags.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2 mt-2">
            {allTags.map(tag => (
                <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer transition-colors"
                    onClick={() => onToggleTag(tag)}
                >
                    <Tag className="h-3 w-3 mr-1"/>
                    {tag}
                </Badge>
            ))}
            {selectedTags.length > 0 && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearFilters}
                    className="h-6 px-2"
                >
                    <X className="h-3 w-3"/>
                </Button>
            )}
        </div>
    );
};
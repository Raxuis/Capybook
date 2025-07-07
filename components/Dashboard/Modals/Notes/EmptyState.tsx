import React from 'react';
import {Button} from '@/components/ui/button';
import {StickyNote, Plus} from 'lucide-react';

interface EmptyStateProps {
    hasFilters: boolean;
    onCreateNote: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({hasFilters, onCreateNote}) => {
    return (
        <div className="text-center py-8 text-muted-foreground">
            <StickyNote className="h-12 w-12 mx-auto mb-3 opacity-50"/>
            <p>
                {hasFilters
                    ? "Aucune note ne correspond à vos critères"
                    : "Aucune note pour ce livre"}
            </p>
            <Button
                variant="outline"
                className="mt-3"
                onClick={onCreateNote}
            >
                <Plus className="h-4 w-4 mr-2"/>
                Créer votre première note
            </Button>
        </div>
    );
};
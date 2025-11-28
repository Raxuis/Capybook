import React from 'react';
import {Button} from '@/components/ui/button';
import {StickyNote, Plus} from 'lucide-react';

interface EmptyStateProps {
    hasFilters: boolean;
    onCreateNote: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({hasFilters, onCreateNote}) => {
    return (
        <div className="text-muted-foreground py-8 text-center">
            <StickyNote className="mx-auto mb-3 size-12 opacity-50"/>
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
                <Plus className="mr-2 size-4"/>
                Créer votre première note
            </Button>
        </div>
    );
};
import React, {useState, useRef, KeyboardEvent} from 'react';
import {Slider} from '@/components/ui/slider';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {Save, Edit2} from 'lucide-react';
import {Input} from '@/components/ui/input';
import {GiRead} from "react-icons/gi";
import {useBooks} from "@/hooks/useBooks";
import {Book} from "@/types";

interface Props {
    book: Book;
    userId: string;
    initialProgress?: number;
}

const ProgressTracker = ({book, userId, initialProgress = 0}: Props) => {
    const [progress, setProgress] = useState(initialProgress);
    const [isSaving, setIsSaving] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const {updateBookProgress} = useBooks(null, userId);

    const handleProgressChange = (value: number[]) => {
        const newValue = value[0];
        setProgress(newValue);
        setIsDirty(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newValue = parseInt(e.target.value.replace('%', ''), 10);

        if (isNaN(newValue)) {
            newValue = 0;
        }

        newValue = Math.max(0, Math.min(100, newValue));

        setProgress(newValue);
        setIsDirty(true);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setIsEditing(false);
            e.preventDefault();
        }
    };

    const handleBlur = () => {
        setIsEditing(false);
    };

    const saveProgress = async () => {
        setIsSaving(true);
        try {
            await updateBookProgress(book.key, progress);
            setIsDirty(false);
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la progression:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="w-full space-y-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <GiRead className="h-4 w-4 text-primary"/>
                    <span className="text-sm font-medium">Progression</span>
                </div>

                {isEditing ? (
                    <Input
                        ref={inputRef}
                        type="text"
                        value={`${progress}`}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        onBlur={handleBlur}
                        className="w-16 h-7 text-center text-sm"
                        autoFocus
                    />
                ) : (
                    <Badge
                        variant="outline"
                        className="bg-primary/10 text-primary cursor-pointer hover:bg-primary/20 transition-colors"
                        onClick={() => setIsEditing(true)}
                    >
                        <span className="flex items-center">
                            {progress} page <span>{progress > 1 && "s"}</span>
                            <Edit2 className="ml-1 h-3 w-3 opacity-50"/>
                        </span>
                    </Badge>
                )}
            </div>

            <div className="flex items-center space-x-2">
                <Slider
                    defaultValue={[initialProgress]}
                    value={[progress]}
                    onValueChange={handleProgressChange}
                    max={book.numberOfPages}
                    step={1}
                    className="flex-1"
                />

                {isDirty && (
                    <Button
                        size="sm"
                        onClick={saveProgress}
                        disabled={isSaving}
                        className="h-8"
                    >
                        {isSaving ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                     xmlns="http://www.w3.org/2000/svg"
                                     fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                            strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor"
                                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Enregistrer
                            </span>
                        ) : (
                            <span className="flex items-center">
                                <Save className="h-4 w-4 mr-1"/>
                                Enregistrer
                            </span>
                        )}
                    </Button>
                )}
            </div>
        </div>
    );
};

export default ProgressTracker;
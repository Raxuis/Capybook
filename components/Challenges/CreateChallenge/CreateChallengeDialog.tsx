import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import CreateChallengeForm from "@/components/Challenges/CreateChallenge/CreateChallengeForm";

type Props = {
    isDialogOpen: boolean;
    setIsDialogOpen: (isOpen: boolean) => void;
    user: {
        id: string;
    };
}

const CreateChallengeDialog = ({isDialogOpen, setIsDialogOpen, user}: Props) => {
    return (
        <Dialog open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
        >
            <DialogTrigger asChild>
                <Button
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 max-sm:w-full max-sm:mt-2">
                    <Plus className="h-4 w-4 mr-2"/>
                    Nouveau challenge
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        Créer un nouveau challenge de lecture
                    </DialogTitle>
                    <DialogDescription>
                        Définissez votre objectif de lecture et suivez votre progression.
                    </DialogDescription>
                </DialogHeader>
                <CreateChallengeForm
                    user={user}
                    setIsDialogOpen={setIsDialogOpen}
                />
            </DialogContent>
        </Dialog>
    );
};

export default CreateChallengeDialog;

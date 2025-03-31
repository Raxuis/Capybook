import React, {memo} from 'react';
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
import {useChallengeCrudModalStore} from "@/store/challengeCrudModalStore";

const CreateChallengeDialog = memo(() => {
    const {
        isDialogOpen,
        modalType,
        openCreateDialog,
        setDialogOpen
    } = useChallengeCrudModalStore();

    const shouldShowDialog = isDialogOpen && modalType === 'create';

    return (
        <Dialog
            open={shouldShowDialog}
            onOpenChange={setDialogOpen}
        >
            <DialogTrigger asChild>
                <Button
                    onClick={() => openCreateDialog()}
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
                <CreateChallengeForm/>
            </DialogContent>
        </Dialog>
    );
});

export default CreateChallengeDialog;
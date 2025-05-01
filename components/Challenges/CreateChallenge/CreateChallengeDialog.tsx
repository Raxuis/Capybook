"use client";

import React, {memo} from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {buttonVariants} from "@/components/ui/button";
import {Sparkles} from "lucide-react";
import CreateChallengeForm from "@/components/Challenges/CreateChallenge/CreateChallengeForm";
import {useChallengeCrudModalStore} from "@/store/challengeCrudModalStore";
import {motion} from 'motion/react';
import {cn} from "@/lib/utils";

const CreateChallengeDialog = memo(() => {
    const {
        isDialogOpen,
        modalType,
        openCreateDialog,
        setDialogOpen
    } = useChallengeCrudModalStore();

    const shouldShowDialog = isDialogOpen && modalType === 'create';

    const particles = Array.from({length: 6});

    return (
        <Dialog
            open={shouldShowDialog}
            onOpenChange={setDialogOpen}
        >
            <DialogTrigger asChild>
                <div className="relative">
                    {particles.map((_, index) => (
                        <motion.div
                            key={index}
                            className="absolute w-1 h-1 bg-yellow-300 rounded-full opacity-70"
                            initial={{scale: 0}}
                            animate={{
                                scale: [0, 1, 0],
                                x: [0, Math.cos(index * Math.PI / 3) * 30],
                                y: [0, Math.sin(index * Math.PI / 3) * 30],
                                opacity: [0, 1, 0]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatType: "loop",
                                delay: index * 0.3,
                                ease: "easeInOut"
                            }}
                        />
                    ))}
                    <motion.button
                        initial={{opacity: 0, y: 10}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: -10}}
                        transition={{type: "spring", stiffness: 400, damping: 15}}
                        whileHover={{
                            scale: 1.05,
                            boxShadow: "0 0 15px rgb(179, 108, 61, 0.5)"
                        }}
                        whileTap={{scale: 0.95}}
                        onClick={() => openCreateDialog()}
                        className={cn(buttonVariants({
                            variant: "default",
                            size: "sm",
                        }), "max-sm:w-full max-sm:mt-2 relative overflow-hidden bg-primary")}
                    >
                        {/* Effet de "brillance" qui se déplace */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
                            initial={{x: -100}}
                            animate={{x: 200}}
                            transition={{
                                repeat: Infinity,
                                duration: 1.5,
                                repeatDelay: 3,
                                ease: "easeInOut"
                            }}
                        />

                        <div className="flex items-center justify-center relative z-10">
                            <Sparkles className="h-4 w-4 mr-2 text-yellow-200"/>
                            <span className="font-medium">Nouveau challenge</span>
                        </div>
                    </motion.button>
                </div>
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
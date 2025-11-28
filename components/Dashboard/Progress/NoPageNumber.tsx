"use client";

import {Check, FileText, Percent, X} from "lucide-react";
import {BsInputCursorText} from "react-icons/bs";
import {Button, buttonVariants} from "@/components/ui/button";
import {usePageNumberModal} from "@/store/pageNumberModalStore";
import {useBooks} from "@/hooks/useBooks";
import {useState} from "react";
import {cn} from "@/lib/utils";

const NoPageNumber = ({bookId, bookKey}: {bookId: string, bookKey: string }) => {
    const {openModal} = usePageNumberModal();
    const {updateBookProgressType} = useBooks(null);
    const [isSelectingUpdate, setIsSelectingUpdate] = useState(false);

    const handleUpdate = async () => {
        try {
            await updateBookProgressType(bookKey, "percentage");
        } catch (e) {
            console.error(e);
        } finally {
            setIsSelectingUpdate(false);
        }
    }

    return (
        <>
            <div className="text-muted-foreground flex flex-col text-sm ">
                <p className="flex items-center">
                    <FileText className="mr-1 size-4"/> Nombre de pages indisponible
                </p>
                <p className="flex-flex-col flex pt-2">
                    Que souhaitez-vous faire avec ce livre ?
                </p>
                <div className="flex flex-col space-y-2 pt-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-primary/10 text-sm transition-colors"
                        onClick={() => openModal(bookId, bookKey)}
                    >
                        <BsInputCursorText className="mr-1 size-3"/>
                        Entrer le nombre de pages
                    </Button>
                    {
                        isSelectingUpdate ? (
                            <div className={cn(buttonVariants({
                                size: "sm",
                                variant: "outline",
                            }), "flex justify-between transition-colors")}>
                                Êtes-vous sûr ?
                                <div className="flex space-x-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-gray-500 transition-colors hover:text-blue-500"
                                        onClick={handleUpdate}
                                    >
                                        <Check className="size-5"/>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-gray-500 transition-colors hover:text-red-500"
                                        onClick={() => setIsSelectingUpdate(false)}
                                    >
                                        <X className="size-5"/>
                                    </Button>
                                </div>

                            </div>
                        ) : (
                            <Button
                                variant="outline"
                                size="sm"
                                className="hover:bg-secondary/10 text-sm transition-colors"
                                onClick={() => setIsSelectingUpdate(true)}>
                                <Percent className="mr-1 size-3"/>
                                Utiliser les pourcentages
                            </Button>
                        )
                    }
                </div>
            </div>
        </>
    );
};

export default NoPageNumber;

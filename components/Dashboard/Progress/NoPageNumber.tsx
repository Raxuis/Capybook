"use client";

import {Check, FileText, Percent, X} from "lucide-react";
import {BsInputCursorText} from "react-icons/bs";
import {Button, buttonVariants} from "@/components/ui/button";
import {usePageNumberModal} from "@/store/pageNumberModalStore";
import {useBooks} from "@/hooks/useBooks";
import {useState} from "react";
import {cn} from "@/lib/utils";

const NoPageNumber = ({userId, bookId, bookKey}: { userId: string, bookId: string, bookKey: string }) => {
    const {openModal} = usePageNumberModal();
    const {updateBookProgressType} = useBooks(null, userId);
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
            <div className="flex flex-col text-muted-foreground text-sm ">
                <p className="flex items-center">
                    <FileText className="h-4 w-4 mr-1"/> Nombre de pages indisponible
                </p>
                <p className="flex flex-flex-col pt-2">
                    Que souhaitez-vous faire avec ce livre ?
                </p>
                <div className="flex flex-col space-y-2 pt-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-sm hover:bg-primary/10 transition-colors"
                        onClick={() => openModal(bookId, bookKey)}
                    >
                        <BsInputCursorText className="h-3 w-3 mr-1"/>
                        Entrer le nombre de pages
                    </Button>
                    {
                        isSelectingUpdate ? (
                            <div className={cn(buttonVariants({
                                size: "sm",
                                variant: "outline",
                            }), "flex justify-between hover:bg-transparent transition-colors")}>
                                Êtes-vous sûr ?
                                <div className="flex space-x-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="hover:bg-transparent text-gray-500 hover:text-blue-500 transition-colors"
                                        onClick={handleUpdate}
                                    >
                                        <Check className="w-5 h-5"/>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="hover:bg-transparent text-gray-500 hover:text-red-500 transition-colors"
                                        onClick={() => setIsSelectingUpdate(false)}
                                    >
                                        <X className="w-5 h-5"/>
                                    </Button>
                                </div>

                            </div>
                        ) : (
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-sm hover:bg-secondary/10 transition-colors"
                                onClick={() => setIsSelectingUpdate(true)}>
                                <Percent className="h-3 w-3 mr-1"/>
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

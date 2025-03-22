import {FileText, Percent} from "lucide-react";
import {BsInputCursorText} from "react-icons/bs";
import {Button} from "@/components/ui/button";
import {usePageNumberModal} from "@/store/pageNumberModalStore";
import {useBooks} from "@/hooks/useBooks";

const NoPageNumber = ({userId, bookId, bookKey}: { userId: string, bookId: string, bookKey: string }) => {
    const {openModal} = usePageNumberModal();
    const {updateBookProgressType} = useBooks(null, userId);

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
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-sm hover:bg-secondary/10 transition-colors"
                        onClick={async () => await updateBookProgressType(bookKey, "percentage")}
                    >
                        <Percent className="h-3 w-3 mr-1"/>
                        Utiliser les pourcentages
                    </Button>
                </div>
            </div>
        </>
    );
};

export default NoPageNumber;

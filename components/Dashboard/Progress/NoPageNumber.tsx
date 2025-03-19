import {FileText} from "lucide-react";
import {Button} from "@/components/ui/button";
import {usePageNumberModal} from "@/store/pageNumberModalStore";

const NoPageNumber = ({bookId}: { bookId: string }) => {
    const {
        openModal
    } = usePageNumberModal();
    return (
        <>
            <div className="flex flex-col text-muted-foreground text-sm ">
                <p className="flex items-center">
                    <FileText className="h-4 w-4 mr-1"/> Nombre de page indisponible
                </p>
                <p className="flex flex-flex-col pt-2">
                    Que souhaitez-vous faire avec ce livre ?
                </p>
                <div className="flex items-center space-x-2 pt-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-sm hover:bg-primary/10 transition-colors"
                        onClick={() => openModal(bookId)}
                    >
                        Entrer le nombre de pages
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-sm hover:bg-secondary/10 transition-colors"
                    >
                        Utiliser les pourcentages
                    </Button>
                </div>
            </div>
        </>
    );
};

export default NoPageNumber;

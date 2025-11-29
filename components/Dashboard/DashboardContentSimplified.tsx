'use client';

import {useState} from "react";
import {useUser} from "@/hooks/useUser";
import {Loader2, AlertCircle} from "lucide-react";
import DashboardStats from "@/components/Dashboard/DashboardStats";
import DashboardTabs from "@/components/Dashboard/DashboardTabs";
import {fetchMoreBookInfos} from "@/lib/services/book";
import {MoreInfoBook, Book as BookType} from "@/types";
import ReviewBookModal from "@/components/BookStore/Modals/ReviewBookModal";
import BookModal from "@/components/Dashboard/Modals/BookModal/BookModal";

export default function DashboardContentSimplified() {
    const {user, isError, isValidating, isLoading} = useUser();
    const [selectedBook, setSelectedBook] = useState<MoreInfoBook | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoadingBookDetails, setIsLoadingBookDetails] = useState(false);

    if (!user && (isLoading || isValidating)) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-4">
                <Loader2 className="text-primary mb-2 size-8 animate-spin"/>
                <p className="text-muted-foreground">Chargement des données...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-4">
                <AlertCircle className="text-destructive mb-2 size-8"/>
                <p className="font-medium">Erreur lors du chargement des données</p>
                <p className="text-muted-foreground mt-1">Veuillez réessayer ultérieurement</p>
            </div>
        );
    }

    if (!user) return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
            <AlertCircle className="mb-2 size-8 text-amber-500"/>
            <p className="font-medium">Utilisateur non trouvé</p>
        </div>
    );

    const openBookModal = (book: BookType) => {
        setIsModalOpen(true);
        setSelectedBook({
            ...book,
            description: "Chargement...",
            subjects: [],
        });

        setIsLoadingBookDetails(true);

        fetchMoreBookInfos(book.key)
            .then((bookInfos) => {
                if (!bookInfos || bookInfos.error) {
                    console.warn("Aucune information trouvée pour ce livre.");
                    return;
                }

                setSelectedBook((prev) => ({
                    ...prev!,
                    description: bookInfos.description?.value || "Aucune description disponible",
                    subjects: bookInfos.subjects || [],
                }));
            })
            .catch((error) => console.error("Erreur lors du chargement du livre :", error))
            .finally(() => setIsLoadingBookDetails(false));
    };

    return (
        <>

            <DashboardStats/>


            <DashboardTabs openBookModal={openBookModal}/>

            <BookModal
                book={selectedBook}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                isLoading={isLoadingBookDetails}
                userId={user.id}
            />

            <ReviewBookModal userId={user.id}/>
        </>
    );
}

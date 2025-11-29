'use client';

import {useState} from "react";
import {useUser} from "@/hooks/useUser";
import DashboardStats from "@/components/Dashboard/DashboardStats";
import DashboardTabs from "@/components/Dashboard/DashboardTabs";
import {fetchMoreBookInfos} from "@/lib/services/book";
import {MoreInfoBook, Book as BookType} from "@/types";
import ReviewBookModal from "@/components/BookStore/Modals/ReviewBookModal";
import BookModal from "@/components/Dashboard/Modals/BookModal/BookModal";
import {LoadingState, ErrorState} from "@/components/common";

export default function DashboardContentSimplified() {
    const {user, isError, isValidating, isLoading} = useUser();
    const [selectedBook, setSelectedBook] = useState<MoreInfoBook | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoadingBookDetails, setIsLoadingBookDetails] = useState(false);

    if (!user && (isLoading || isValidating)) {
        return (
            <LoadingState
                message="Chargement des données..."
                className="min-h-screen"
            />
        );
    }

    if (isError) {
        return (
            <ErrorState
                title="Erreur lors du chargement des données"
                message="Veuillez réessayer ultérieurement"
                onRetry={() => window.location.reload()}
                className="min-h-screen"
            />
        );
    }

    if (!user) {
        return (
            <ErrorState
                title="Utilisateur non trouvé"
                message="Impossible de charger les informations utilisateur"
                variant="warning"
                className="min-h-screen"
            />
        );
    }

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

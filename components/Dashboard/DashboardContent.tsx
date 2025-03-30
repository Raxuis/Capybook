'use client';

import {useEffect, useState} from "react";
import {useUser} from "@/hooks/useUser";
import {Loader2, AlertCircle} from "lucide-react";
import BookModal from "@/components/Dashboard/Modals/BookModal";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import DashboardStats from "@/components/Dashboard/DashboardStats";
import DashboardTabs from "@/components/Dashboard/DashboardTabs";
import {fetchMoreBookInfos} from "@/actions/book";
import {MoreInfoBook, Book as BookType} from "@/types";
import {DashboardLayout} from "@/components/Layout";

export default function DashboardContent() {
    const {user, isError, isValidating, isLoading} = useUser();
    const [selectedBook, setSelectedBook] = useState<MoreInfoBook | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoadingBookDetails, setIsLoadingBookDetails] = useState(false);

    useEffect(() => {
        console.log("User data:", user);
        console.log("Is loading:", isLoading);
        console.log("Is error:", isError);
        console.log("Is validating:", isValidating);
    }, [user, isError, isLoading, isValidating]);

    if (!user && (isLoading || isValidating)) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-2"/>
                <p className="text-muted-foreground">Chargement des données...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <AlertCircle className="h-8 w-8 text-destructive mb-2"/>
                <p className="font-medium">Erreur lors du chargement des données</p>
                <p className="text-muted-foreground mt-1">Veuillez réessayer ultérieurement</p>
            </div>
        );
    }

    if (!user) return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <AlertCircle className="h-8 w-8 text-amber-500 mb-2"/>
            <p className="font-medium">Utilisateur non trouvé</p>
        </div>
    );

    const openBookModal = async (book: BookType) => {
        setIsModalOpen(true);
        setSelectedBook(null);
        setIsLoadingBookDetails(true);

        try {
            const bookInfos = await fetchMoreBookInfos(book.key);

            if (!bookInfos || bookInfos.error) {
                console.warn("Aucune information trouvée pour ce livre.");
                setIsLoadingBookDetails(false);
                return;
            }

            const bookForModal: MoreInfoBook = {
                ...book,
                description: bookInfos.description?.value || "Aucune description disponible",
                subjects: bookInfos.subjects || [],
            };


            setSelectedBook(bookForModal);
        } catch (error) {
            console.error("Erreur lors du chargement du livre :", error);
        } finally {
            setIsLoadingBookDetails(false);
        }
    };

    return (
        <DashboardLayout>

            <DashboardHeader/>

            <DashboardStats/>


            <DashboardTabs openBookModal={openBookModal}/>

            <BookModal
                book={selectedBook}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                isLoading={isLoadingBookDetails}
            />
        </DashboardLayout>
    );
}
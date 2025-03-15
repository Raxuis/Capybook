'use client';

import {useState} from "react";
import {useUser} from "@/hooks/useUser";
import {Loader2, AlertCircle} from "lucide-react";
import {Book as BookType} from "@/hooks/useBooks";
import BookModal from "@/components/Dashboard/Modals/BookModal";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import DashboardStats from "@/components/Dashboard/DashboardStats";
import DashboardTabs from "@/components/Dashboard/DashboardTabs";
import {fetchMoreBookInfos} from "@/actions/book";

interface DashboardContentProps {
    userId?: string;
}

export type MoreInfoBook = BookType & {
    description?: string;
    subjects: string[];
    cover?: string;
    finishedAt?: string | null;
}

export default function DashboardContent({userId}: DashboardContentProps) {
    const {user, isError, isValidating, isLoading} = useUser(userId);
    const [selectedBook, setSelectedBook] = useState<MoreInfoBook | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoadingBookDetails, setIsLoadingBookDetails] = useState(false);

    if ((isLoading || isValidating) && !user) {
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

            const bookForModal = {
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
        <div className="max-w-4xl mx-auto p-4 space-y-6">

            <DashboardHeader user={user}/>

            <DashboardStats user={user}/>


            <DashboardTabs
                user={user}
                openBookModal={openBookModal}
            />

            <BookModal
                book={selectedBook}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                userId={userId}
                isLoading={isLoadingBookDetails}
            />
        </div>
    );
}
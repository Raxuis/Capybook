"use client";

import {useState, useEffect, useCallback} from 'react';
import {useUser} from '@/hooks/useUser';
import {api} from '@/utils/api';
import {useToast} from "@/hooks/use-toast";

export type LendingRequest = {
    id: string;
    lenderId: string;
    borrowerId: string;
    bookId: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'RETURNED' | 'OVERDUE' | 'CANCELLED';
    message?: string;
    requestedAt: string;
    acceptedAt?: string;
    rejectedAt?: string;
    returnedAt?: string;
    dueDate?: string;
    reminderSent: boolean;
    createdAt: string;
    updatedAt: string;
    lender: {
        id: string;
        name: string;
        username: string;
        image?: string;
    };
    borrower: {
        id: string;
        name: string;
        username: string;
        image?: string;
    };
    book: {
        id: string;
        key: string;
        title: string;
        authors: string[];
        cover?: string;
        numberOfPages?: number;
    };
};

export const useLendingRequests = () => {
    const {user, refreshUser} = useUser();
    const [pendingRequests, setPendingRequests] = useState<LendingRequest[]>([]);
    const [currentRequest, setCurrentRequest] = useState<LendingRequest | null>(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [requestQueue, setRequestQueue] = useState<LendingRequest[]>([]);
    const [autoShowNext, setAutoShowNext] = useState(true);
    const {toast} = useToast();

    const processNextRequest = useCallback(() => {
        if (requestQueue.length > 0 && !isPopupOpen && autoShowNext) {
            const nextRequest = requestQueue[0];
            setCurrentRequest(nextRequest);
            setIsPopupOpen(true);
        }
    }, [requestQueue, isPopupOpen, autoShowNext]);

    useEffect(() => {
        if (user?.borrowedBooks) {
            const pending = user.borrowedBooks
                .filter(borrow => borrow.status === 'PENDING' && borrow.borrowerId === user.id)
                .map(borrow => ({
                    id: borrow.id,
                    lenderId: borrow.lenderId,
                    borrowerId: borrow.borrowerId,
                    bookId: borrow.bookId,
                    status: borrow.status,
                    message: borrow.message,
                    requestedAt: borrow.requestedAt,
                    acceptedAt: borrow.acceptedAt,
                    rejectedAt: borrow.rejectedAt,
                    returnedAt: borrow.returnedAt,
                    dueDate: borrow.dueDate,
                    reminderSent: borrow.reminderSent,
                    createdAt: borrow.createdAt,
                    updatedAt: borrow.updatedAt,
                    lender: borrow.lender,
                    borrower: borrow.borrower,
                    book: borrow.book,
                })) as LendingRequest[];

            setPendingRequests(pending);

            setRequestQueue(prevQueue => {
                const newRequests = pending.filter(
                    request => !prevQueue.some(queued => queued.id === request.id)
                );
                return [...prevQueue, ...newRequests];
            });
        }
    }, [user?.borrowedBooks, user?.id]);

    useEffect(() => {
        if (!currentRequest && !isPopupOpen && autoShowNext) {
            processNextRequest();
        }
    }, [currentRequest, isPopupOpen, processNextRequest, autoShowNext]);

    const acceptRequest = useCallback(async (requestId: string) => {
        setIsLoading(true);
        try {
            await api.put(`/book/lending/${requestId}/accept`, {
                borrowerId: user?.id
            });

            setPendingRequests(prev => prev.filter(r => r.id !== requestId));
            setRequestQueue(prev => prev.filter(r => r.id !== requestId));
            setCurrentRequest(null);
            setIsPopupOpen(false);

            toast.success('Demande acceptée avec succès !');
            await refreshUser();

            setTimeout(() => {
                setAutoShowNext(true);
            }, 500);

        } catch (error) {
            console.error('Erreur lors de l\'acceptation de la demande:', error);
            toast({
                title: 'Erreur',
                description: 'Erreur lors de l\'acceptation de la demande',
                variant: 'destructive'
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [user?.id, toast, refreshUser]);

    const rejectRequest = useCallback(async (requestId: string) => {
        setIsLoading(true);
        try {
            await api.put(`/book/lending/${requestId}/reject`, {
                borrowerId: user?.id
            });

            setPendingRequests(prev => prev.filter(r => r.id !== requestId));
            setRequestQueue(prev => prev.filter(r => r.id !== requestId));
            setCurrentRequest(null);
            setIsPopupOpen(false);

            toast.success('Demande refusée');
            await refreshUser();

            setTimeout(() => {
                setAutoShowNext(true);
            }, 500);

        } catch (error) {
            console.error('Erreur lors du refus de la demande:', error);
            toast({
                title: 'Erreur',
                description: 'Erreur lors du refus de la demande',
                variant: 'destructive'
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [user?.id, toast, refreshUser]);

    const closePopup = useCallback(() => {
        setIsPopupOpen(false);
        setCurrentRequest(null);
        setAutoShowNext(false); // Empêcher l'ouverture automatique

        // Retirer la demande actuelle de la queue
        if (currentRequest) {
            setRequestQueue(prev => prev.filter(r => r.id !== currentRequest.id));
        }
    }, [currentRequest]);

    const showRequest = useCallback((request: LendingRequest) => {
        setCurrentRequest(request);
        setIsPopupOpen(true);
        setAutoShowNext(false); // Désactiver l'auto-show quand on montre manuellement
    }, []);

    const snoozeRequest = useCallback((requestId: string) => {
        const request = pendingRequests.find(r => r.id === requestId);
        if (request) {
            // Remettre la demande à la fin de la queue
            setRequestQueue(prev => {
                const filtered = prev.filter(r => r.id !== requestId);
                return [...filtered, request];
            });
            setCurrentRequest(null);
            setIsPopupOpen(false);

            // Traiter la prochaine demande après un délai
            setTimeout(() => {
                setAutoShowNext(true);
            }, 500);
        }
    }, [pendingRequests]);

    const clearQueue = useCallback(() => {
        setRequestQueue([]);
        setCurrentRequest(null);
        setIsPopupOpen(false);
        setAutoShowNext(false);
    }, []);

    return {
        pendingRequests,
        currentRequest,
        isPopupOpen,
        isLoading,
        requestQueue,
        acceptRequest,
        rejectRequest,
        closePopup,
        showRequest,
        snoozeRequest,
        clearQueue,
        hasRequests: pendingRequests.length > 0,
        requestCount: pendingRequests.length,
    };
};
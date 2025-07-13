"use client";

import {useState, useEffect, useCallback} from 'react';
import {useUser} from '@/hooks/useUser';
import {api} from '@/utils/api';
import {toast} from 'sonner';

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

    // Extraire les demandes en attente depuis les données utilisateur
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

            // Gérer la file d'attente des demandes
            const newRequests = pending.filter(
                request => !requestQueue.some(queued => queued.id === request.id)
            );

            if (newRequests.length > 0) {
                setRequestQueue(prev => [...prev, ...newRequests]);
            }

            // Afficher automatiquement la première demande en attente s'il n'y en a pas déjà une ouverte
            if (pending.length > 0 && !currentRequest && !isPopupOpen) {
                const nextRequest = requestQueue[0] || pending[0];
                if (nextRequest) {
                    setCurrentRequest(nextRequest);
                    setIsPopupOpen(true);
                }
            }
        }
    }, [user, currentRequest, isPopupOpen, requestQueue]);

    // Accepter une demande de prêt
    const acceptRequest = useCallback(async (requestId: string) => {
        setIsLoading(true);
        try {
            await api.put(`/book/lending/${requestId}/accept`, {
                borrowerId: user?.id
            });

            // Mettre à jour l'état local
            setPendingRequests(prev => prev.filter(r => r.id !== requestId));
            setRequestQueue(prev => prev.filter(r => r.id !== requestId));

            // Fermer la popup actuelle
            setCurrentRequest(null);
            setIsPopupOpen(false);

            // Afficher un message de succès
            toast.success('Demande acceptée avec succès !');

            // Rafraîchir les données utilisateur
            await refreshUser();
        } catch (error) {
            console.error('Erreur lors de l\'acceptation de la demande:', error);
            toast.error('Erreur lors de l\'acceptation de la demande');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [user?.id, refreshUser]);

    // Refuser une demande de prêt
    const rejectRequest = useCallback(async (requestId: string) => {
        setIsLoading(true);
        try {
            await api.put(`/book/lending/${requestId}/reject`, {
                borrowerId: user?.id
            });

            // Mettre à jour l'état local
            setPendingRequests(prev => prev.filter(r => r.id !== requestId));
            setRequestQueue(prev => prev.filter(r => r.id !== requestId));

            // Fermer la popup actuelle
            setCurrentRequest(null);
            setIsPopupOpen(false);

            // Afficher un message de succès
            toast.success('Demande refusée');

            // Rafraîchir les données utilisateur
            await refreshUser();
        } catch (error) {
            console.error('Erreur lors du refus de la demande:', error);
            toast.error('Erreur lors du refus de la demande');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [user?.id, refreshUser]);

    // Fermer la popup et passer à la demande suivante
    const closePopup = useCallback(() => {
        setIsPopupOpen(false);
        setCurrentRequest(null);

        // Retirer la demande actuelle de la file d'attente
        setRequestQueue(prev => prev.filter(r => r.id !== currentRequest?.id));

        // Afficher la prochaine demande s'il y en a une
        setTimeout(() => {
            const nextRequest = requestQueue.find(r => r.id !== currentRequest?.id);
            if (nextRequest) {
                setCurrentRequest(nextRequest);
                setIsPopupOpen(true);
            }
        }, 300);
    }, [requestQueue, currentRequest]);

    // Afficher une demande spécifique
    const showRequest = useCallback((request: LendingRequest) => {
        setCurrentRequest(request);
        setIsPopupOpen(true);
    }, []);

    // Reporter une demande (la remettre en fin de file)
    const snoozeRequest = useCallback((requestId: string) => {
        const request = pendingRequests.find(r => r.id === requestId);
        if (request) {
            setRequestQueue(prev => [...prev.filter(r => r.id !== requestId), request]);
            setCurrentRequest(null);
            setIsPopupOpen(false);
        }
    }, [pendingRequests]);

    // Vider la file d'attente
    const clearQueue = useCallback(() => {
        setRequestQueue([]);
        setCurrentRequest(null);
        setIsPopupOpen(false);
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
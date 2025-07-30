"use client";

import React, {useState} from 'react';
import {X, Book, MessageCircle, Check, Clock} from 'lucide-react';
import {LendingRequest} from '@/hooks/lending/useLendingRequests';

interface LendingRequestPopupProps {
    isOpen: boolean;
    onClose: () => void;
    request: LendingRequest;
    onAccept: (requestId: string) => Promise<void>;
    onReject: (requestId: string) => Promise<void>;
    isLoading?: boolean;
}

const LendingRequestPopup = ({
                                 isOpen,
                                 onClose,
                                 request,
                                 onAccept,
                                 onReject,
                                 isLoading = false,
                             }: LendingRequestPopupProps) => {
    const [actionType, setActionType] = useState<'accept' | 'reject' | null>(null);

// Removed unnecessary console.log statement.

    if (!isOpen) return null;

    const handleAccept = async () => {
        setActionType('accept');
        try {
            await onAccept(request.id);
        } catch (error) {
            console.error('Erreur lors de l\'acceptation:', error);
        } finally {
            setActionType(null);
        }
    };

    const handleReject = async () => {
        setActionType('reject');
        try {
            await onReject(request.id);
        } catch (error) {
            console.error('Erreur lors du refus:', error);
        } finally {
            setActionType(null);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const isActionLoading = isLoading || actionType !== null;

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={onClose}/>

            {/* Modal */}
            <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className="pointer-events-auto max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white shadow-xl">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b p-6">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Demande de prêt
                        </h2>
                        <p className="text-destructive-foreground text-sm">
                            Vous pouvez accepter ou refuser cette demande. Si vous acceptez, le livre sera dans votre
                            bibliothèque.
                        </p>
                        <button
                            onClick={onClose}
                            className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                            disabled={isActionLoading}
                        >
                            <X size={20}/>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="space-y-6 p-6">
                        {/* Lender Info */}
                        <div className="flex items-center">
                            <p className="font-medium text-gray-900">
                                {request.lender.name}
                            </p>
                            <p className="text-sm text-gray-500">
                                @{request.lender.username}
                            </p>
                        </div>

                        {/* Book Info */}
                        <div className="rounded-lg bg-gray-50 p-4">
                            <div className="flex items-start space-x-4">
                                <div
                                    className="flex h-24 w-16 shrink-0 items-center justify-center overflow-hidden rounded bg-gray-200">
                                    {request.book.cover ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={request.book.cover}
                                            alt={request.book.title}
                                            className="size-full object-cover"
                                        />
                                    ) : (
                                        <Book size={32} className="text-gray-400"/>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="mb-1 font-medium text-gray-900">
                                        {request.book.title}
                                    </h3>
                                    <p className="mb-2 text-sm text-gray-600">
                                        par {request.book.authors.join(', ')}
                                    </p>
                                    {request.book.numberOfPages && (
                                        <p className="flex items-center text-xs text-gray-500">
                                            <Book size={12} className="mr-1"/>
                                            {request.book.numberOfPages} pages
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Message */}
                        {request.message && (
                            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                                <div className="flex items-start space-x-2">
                                    <MessageCircle size={16} className="mt-0.5 shrink-0 text-blue-600"/>
                                    <div>
                                        <p className="mb-1 text-sm font-medium text-blue-900">
                                            Message :
                                        </p>
                                        <p className="text-sm text-blue-800">
                                            {request.message}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Request Date */}
                        <div className="flex items-center text-sm text-gray-500">
                            <Clock size={14} className="mr-1"/>
                            Demandé le {formatDate(request.requestedAt as string)}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-3 border-t bg-gray-50 p-6">
                        <button
                            onClick={handleReject}
                            disabled={isActionLoading}
                            className="flex flex-1 items-center justify-center space-x-2 rounded-lg border border-red-300 px-4 py-2 text-red-700 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isActionLoading && actionType === 'reject' ? (
                                <div
                                    className="size-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent"/>
                            ) : (
                                <X size={16}/>
                            )}
                            <span>Refuser</span>
                        </button>

                        <button
                            onClick={handleAccept}
                            disabled={isActionLoading}
                            className="flex flex-1 items-center justify-center space-x-2 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isActionLoading && actionType === 'accept' ? (
                                <div
                                    className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                            ) : (
                                <Check size={16}/>
                            )}
                            <span>Accepter</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LendingRequestPopup;
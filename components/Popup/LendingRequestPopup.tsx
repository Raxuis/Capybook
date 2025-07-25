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
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose}/>

            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
                <div
                    className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto pointer-events-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Demande de prêt
                        </h2>
                        <p className="text-sm text-destructive-foreground">
                            Vous pouvez accepter ou refuser cette demande. Si vous acceptez, le livre sera dans votre
                            bibliothèque.
                        </p>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                            disabled={isActionLoading}
                        >
                            <X size={20}/>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
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
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-start space-x-4">
                                <div
                                    className="w-16 h-24 bg-gray-200 rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
                                    {request.book.cover ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={request.book.cover}
                                            alt={request.book.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <Book size={32} className="text-gray-400"/>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-900 mb-1">
                                        {request.book.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-2">
                                        par {request.book.authors.join(', ')}
                                    </p>
                                    {request.book.numberOfPages && (
                                        <p className="text-xs text-gray-500 flex items-center">
                                            <Book size={12} className="mr-1"/>
                                            {request.book.numberOfPages} pages
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Message */}
                        {request.message && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-start space-x-2">
                                    <MessageCircle size={16} className="text-blue-600 mt-0.5 flex-shrink-0"/>
                                    <div>
                                        <p className="text-sm font-medium text-blue-900 mb-1">
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
                    <div className="flex space-x-3 p-6 border-t bg-gray-50">
                        <button
                            onClick={handleReject}
                            disabled={isActionLoading}
                            className="flex-1 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            {isActionLoading && actionType === 'reject' ? (
                                <div
                                    className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"/>
                            ) : (
                                <X size={16}/>
                            )}
                            <span>Refuser</span>
                        </button>

                        <button
                            onClick={handleAccept}
                            disabled={isActionLoading}
                            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            {isActionLoading && actionType === 'accept' ? (
                                <div
                                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
"use client";

import React from "react";
import {useLendingRequests} from "@/hooks/lending/useLendingRequests";
import LendingRequestPopup from "@/components/Popup/LendingRequestPopup";

export default function LendingRequestsManager() {
    const {
        currentRequest,
        isPopupOpen,
        isLoading,
        acceptRequest,
        rejectRequest,
        closePopup,
        hasRequests,
        requestCount,
    } = useLendingRequests();

    return (
        <>
            {/* Popup pour la demande actuelle */}
            {currentRequest && (
                <LendingRequestPopup
                    isOpen={isPopupOpen}
                    onClose={closePopup}
                    request={currentRequest}
                    onAccept={acceptRequest}
                    onReject={rejectRequest}
                    isLoading={isLoading}
                />
            )}

            {/* Notification du nombre de demandes en attente */}
            {hasRequests && !isPopupOpen && (
                <div className="fixed bottom-4 right-4 z-40">
                    <div className="rounded-lg bg-blue-500 px-4 py-2 text-white shadow-lg">
                        <span className="text-sm font-medium">
                            {requestCount} demande{requestCount > 1 ? 's' : ''} de prêt en attente
                        </span>
                    </div>
                </div>
            )}
        </>
    );
}
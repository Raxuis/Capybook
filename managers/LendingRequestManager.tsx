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
    } = useLendingRequests();

    return (
        currentRequest && (
            <LendingRequestPopup
                isOpen={isPopupOpen}
                onClose={closePopup}
                request={currentRequest}
                onAccept={acceptRequest}
                onReject={rejectRequest}
                isLoading={isLoading}
            />
        )
    );
}
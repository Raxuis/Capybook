import {UserCheck} from "lucide-react";
import {LendingInfoDisplayProps} from "@/types/bookModal";

export const LendingInfoDisplay = ({lendingInfo, isPendingLoan}: LendingInfoDisplayProps) => {
    if (!lendingInfo) return null;

    return (
        <div
            className={`${
                isPendingLoan
                    ? 'border-yellow-200 bg-yellow-50'
                    : 'border-orange-200 bg-orange-50'
            } space-y-2 rounded-lg border p-4`}
        >
            <div
                className={`flex items-center gap-2 ${
                    isPendingLoan ? 'text-yellow-700' : 'text-orange-700'
                }`}
            >
                <UserCheck className="size-4"/>
                <span className="font-medium">
                    {isPendingLoan
                        ? 'Demande de prêt en attente'
                        : `Prêté à ${lendingInfo.borrower.name || lendingInfo.borrower.username}`
                    }
                </span>
            </div>
            {lendingInfo.acceptedAt && (
                <p className={`${isPendingLoan ? 'text-yellow-600' : 'text-orange-600'} text-sm`}>
                    Depuis le {new Date(lendingInfo.acceptedAt).toLocaleDateString('fr-FR')}
                </p>
            )}
            {lendingInfo.dueDate && (
                <p className={`${isPendingLoan ? 'text-yellow-600' : 'text-orange-600'} text-sm`}>
                    À retourner le {new Date(lendingInfo.dueDate).toLocaleDateString('fr-FR')}
                </p>
            )}
        </div>
    );
};
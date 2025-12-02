import {UserCheck, Clock} from "lucide-react";
import {LendingInfoDisplayProps} from "@/types/bookModal";

export const LendingInfoDisplay = ({lendingInfo, isPendingLoan}: LendingInfoDisplayProps) => {
    if (!lendingInfo) return null;

    return (
        <div
            className={`${
                isPendingLoan
                    ? 'border-amber-200/60 bg-amber-50/50'
                    : 'border-orange-200/60 bg-orange-50/50'
            } space-y-3 rounded-lg border p-4`}
        >
            <div
                className={`flex items-center gap-2 ${
                    isPendingLoan ? 'text-amber-700' : 'text-orange-700'
                }`}
            >
                {isPendingLoan ? (
                    <Clock className="size-4"/>
                ) : (
                    <UserCheck className="size-4"/>
                )}
                <span className="text-sm font-semibold">
                    {isPendingLoan
                        ? 'Demande de prêt en attente'
                        : `Prêté à ${lendingInfo.borrower.name || lendingInfo.borrower.username}`
                    }
                </span>
            </div>
            <div className="space-y-1.5 pl-6 text-xs text-slate-600">
                {lendingInfo.acceptedAt && (
                    <p>
                        Depuis le {new Date(lendingInfo.acceptedAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })}
                    </p>
                )}
                {lendingInfo.dueDate && (
                    <p>
                        Retour prévu le {new Date(lendingInfo.dueDate).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })}
                    </p>
                )}
            </div>
        </div>
    );
};

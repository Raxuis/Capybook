import {MoreInfoBook} from "@/types";

export interface BookModalProps {
    book: MoreInfoBook | null;
    isOpen: boolean;
    onClose: () => void;
    isLoading?: boolean;
    userId: string;
}

export interface BookStatus {
    inLibrary: boolean;
    inWishlist: boolean;
    isCurrentBookInstance: boolean;
    isBookFinishedInstance: boolean;
    isBookLoanedInstance: boolean;
    isPendingLoanInstance: boolean;
}

export interface LoadingStates {
    loadingLibrary: boolean;
    loadingWishlist: boolean;
    loadingCurrentBook: boolean;
    loadingLending: boolean;
}

export interface BookActionsProps {
    book: MoreInfoBook;
    bookStatus: BookStatus;
    loadingStates: LoadingStates;
    handlers: {
        handleToggleLibrary: () => Promise<void>;
        handleToggleWishlist: () => Promise<void>;
        handleToggleCurrentBook: () => Promise<void>;
        handleCancelLending: (book: MoreInfoBook) => Promise<void>;
        setIsLendingModalOpened: (open: boolean) => void;
        setIsNotesModalOpened: (open: boolean) => void;
    };
    notesCount: number;
}

export interface BookInfoProps {
    book: MoreInfoBook;
    isLoading: boolean;
}

export interface BookCoverProps {
    book: MoreInfoBook;
}

export interface BookStatusDisplayProps {
    bookStatus: BookStatus;
}

export interface LendingInfoDisplayProps {
    lendingInfo: any;
    isPendingLoan: boolean;
}
import {create} from 'zustand';
import {MoreInfoBook} from "@/types";

interface ReviewModalStore {
    showReviewModal: boolean;
    setShowReviewModal: (show: boolean) => void;
    bookToReview: MoreInfoBook | null;
    setBookToReview: (book: MoreInfoBook | null) => void;
}

export const useReviewModalStore = create<ReviewModalStore>((set) => ({
    bookToReview: null,

    setBookToReview: (book: MoreInfoBook | null) => set({bookToReview: book}),

    showReviewModal: false,
    setShowReviewModal: (show) => set({showReviewModal: show}),
}));
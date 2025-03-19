import {create} from 'zustand';

interface PageNumberModalStore {
    showPageNumberModal: boolean;
    bookId: string | null;
    setShowPageNumberModal: (show: boolean) => void;
    openModal: (bookId: string) => void;
    closeModal: () => void;
}

export const usePageNumberModal = create<PageNumberModalStore>((set) => ({
    showPageNumberModal: false,
    bookId: null,

    setShowPageNumberModal: (show) => set({
        showPageNumberModal: show,
        bookId: show ? usePageNumberModal.getState().bookId : null
    }),

    openModal: (bookId) => set({
        showPageNumberModal: true,
        bookId
    }),

    closeModal: () => set({
        showPageNumberModal: false,
        bookId: null
    }),
}));
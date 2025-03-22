import { create } from 'zustand';

interface PageNumberModalStore {
  showPageNumberModal: boolean;
  bookId: string | null;
  bookKey: string | null;
  setShowPageNumberModal: (show: boolean) => void;
  openModal: (bookId: string, bookKey: string) => void;
  closeModal: () => void;
}

export const usePageNumberModal = create<PageNumberModalStore>((set) => ({
  showPageNumberModal: false,
  bookId: null,
  bookKey: null,

  setShowPageNumberModal: (show) => set({
    showPageNumberModal: show,
    bookId: show ? usePageNumberModal.getState().bookId : null,
    bookKey: show ? usePageNumberModal.getState().bookKey : null
  }),

  openModal: (bookId, bookKey) => set({
    showPageNumberModal: true,
    bookId,
    bookKey
  }),

  closeModal: () => set({
    showPageNumberModal: false,
    bookId: null,
    bookKey: null
  }),
}));

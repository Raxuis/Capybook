import {create} from 'zustand';

type CrudModalType = 'create' | 'update' | 'delete' | 'view' | null;

export interface ModalData {
    id: string;
    type: "BOOKS" | "PAGES" | "TIME";
    progress: number;
    target: number;
    deadline: Date;
    createdAt: Date;
    userId?: string;
    completedAt: Date | null;
}

interface ChallengeModalStore {
    isDialogOpen: boolean;
    modalType: CrudModalType;
    modalData: ModalData | null;

    openCreateDialog: (data?: ModalData | null) => void;
    openUpdateDialog: (data: ModalData) => void;
    openDeleteDialog: (data: ModalData) => void;
    openViewDialog: (data: ModalData) => void;
    closeDialog: () => void;
    setDialogOpen: (isOpen: boolean) => void;
}

export const useChallengeCrudModalStore = create<ChallengeModalStore>((set) => ({
    isDialogOpen: false,
    modalType: null,
    modalData: null,

    openCreateDialog: (data = null) => set({
        isDialogOpen: true,
        modalType: 'create',
        modalData: data
    }),

    openUpdateDialog: (data) => set({
        isDialogOpen: true,
        modalType: 'update',
        modalData: data
    }),

    openDeleteDialog: (data) => set({
        isDialogOpen: true,
        modalType: 'delete',
        modalData: data
    }),

    openViewDialog: (data) => set({
        isDialogOpen: true,
        modalType: 'view',
        modalData: data
    }),

    closeDialog: () => set({
        isDialogOpen: false
    }),

    setDialogOpen: (isOpen) => set(() => ({
        isDialogOpen: isOpen,
    })),
}));
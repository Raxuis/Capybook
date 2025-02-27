import { create } from 'zustand';

interface UserState {
    isAuthenticated: boolean;
    setAuthenticated: (isAuthenticated: boolean) => void;
}

export const userStore = create<UserState>((set) => ({
    isAuthenticated: false,
    setAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
}));

import { create } from 'zustand';

interface AppState {
    isMobileSidebarOpen: boolean;
    isGuestMode: boolean;

    // Actions
    toggleMobileSidebar: () => void;
    setMobileSidebar: (open: boolean) => void;
    setGuestMode: (isGuest: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
    isMobileSidebarOpen: false,
    isGuestMode: true, // Core Philosophy: initialized to true to ensure frictionless UX

    toggleMobileSidebar: () => set((state) => ({ isMobileSidebarOpen: !state.isMobileSidebarOpen })),
    setMobileSidebar: (open) => set({ isMobileSidebarOpen: open }),
    setGuestMode: (isGuest) => set({ isGuestMode: isGuest }),
}));

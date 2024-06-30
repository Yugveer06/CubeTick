import { create } from "zustand";

export const useAppState = create((set) => ({
  sortOrder: "desc",
  setSortOrder: (e) => set(() => ({ sortOrder: e })),

  solveId: null,
  setSolveId: (e) => set(() => ({ solveId: e })),

  sessionName: null,
  setSessionName: (e) => set(() => ({ sessionName: e })),

  isSolveInfoModal: false,
  setIsSolveInfoModal: (e) => set(() => ({ isSolveInfoModal: e })),

  isDeleteSolveModal: false,
  setIsDeleteSolveModal: (e) => set(() => ({ isDeleteSolveModal: e })),

  isSessionInfoModal: false,
  setIsSessionInfoModal: (e) => set(() => ({ isSessionInfoModal: e })),
}));

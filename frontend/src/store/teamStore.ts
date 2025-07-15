import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { TeamResponse } from "../types/team";

interface TeamState {
  teamData: TeamResponse | null;
  isLoading: boolean;
  error: string | null;
  isGenerating: boolean;
  pollCount: number;
}

interface TeamActions {
  setTeamData: (data: TeamResponse | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setGenerating: (generating: boolean) => void;
  incrementPollCount: () => void;
  resetPollCount: () => void;
  clearError: () => void;
}

export type TeamStore = TeamState & TeamActions;

export const useTeamStore = create<TeamStore>()(
  devtools(
    (set, get) => ({
      // State
      teamData: null,
      isLoading: false,
      error: null,
      isGenerating: false,
      pollCount: 0,

      // Actions
      setTeamData: (teamData: TeamResponse | null) => {
        set({ teamData });
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      setGenerating: (isGenerating: boolean) => {
        set({ isGenerating });
      },

      incrementPollCount: () => {
        set({ pollCount: get().pollCount + 1 });
      },

      resetPollCount: () => {
        set({ pollCount: 0 });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    { name: "TeamStore" }
  )
);

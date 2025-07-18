import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { TeamResponse } from "../types/team";

interface TeamState {
  teamData: TeamResponse | null;
  isLoading: boolean;
  error: string | null;
  isGenerating: boolean;
}

interface TeamActions {
  setTeamData: (data: TeamResponse | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setGenerating: (generating: boolean) => void;
  clearError: () => void;
}

export type TeamStore = TeamState & TeamActions;

export const useTeamStore = create<TeamStore>()(
  devtools(
    (set) => ({
      // State
      teamData: null,
      isLoading: false,
      error: null,
      isGenerating: false,

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

      clearError: () => {
        set({ error: null });
      },
    }),
    { name: "TeamStore" }
  )
);

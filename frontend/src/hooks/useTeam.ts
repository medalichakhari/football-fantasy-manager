import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, handleApiResponse } from "../lib/api-client";
import { TeamResponse, TeamGenerationResponse } from "../types/team";
import { useTeamStore } from "../store/teamStore";
import { useEffect } from "react";
import { showToast } from "../utils/toast";

const teamApi = {
  getMyTeam: async (): Promise<TeamResponse> => {
    const response = await apiClient.get<{
      success: boolean;
      data: TeamResponse;
    }>("/team/my-team");
    return handleApiResponse(response).data;
  },

  generateTeam: async (): Promise<TeamGenerationResponse> => {
    const response = await apiClient.post<{
      success: boolean;
      data: TeamGenerationResponse;
    }>("/team/generate");
    return handleApiResponse(response).data;
  },
};

export const useTeam = () => {
  const queryClient = useQueryClient();
  const {
    setTeamData,
    setError,
    setGenerating,
    incrementPollCount,
    resetPollCount,
    clearError,
    pollCount,
    isGenerating,
  } = useTeamStore();

  const teamQuery = useQuery({
    queryKey: ["team"],
    queryFn: teamApi.getMyTeam,
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: (failureCount, error: any) => {
      if (error?.message?.includes("Team not found")) {
        return false;
      }
      return failureCount < 3;
    },
  });

  const generateTeamMutation = useMutation({
    mutationFn: teamApi.generateTeam,
    onMutate: () => {
      setGenerating(true);
      clearError();
      resetPollCount();
      showToast.loading("Generating your team... This may take a moment.");
    },
    onSuccess: () => {
      showToast.success(
        "Team generation started! Your team will be ready shortly."
      );
      startPolling();
    },
    onError: (error: any) => {
      const errorMessage = error.message || "Failed to generate team";
      setError(errorMessage);
      setGenerating(false);
      showToast.error(errorMessage);
    },
  });

  useEffect(() => {
    if (teamQuery.data) {
      const wasGenerating = isGenerating;
      setTeamData(teamQuery.data);
      if (teamQuery.data.players.length > 0) {
        if (wasGenerating) {
          showToast.success("🎉 Your team has been generated successfully!");
        }
        setGenerating(false);
        resetPollCount();
      }
      clearError();
    }
  }, [teamQuery.data, isGenerating]);

  useEffect(() => {
    if (teamQuery.error) {
      const errorMessage = teamQuery.error.message;
      setError(errorMessage);
      if (!errorMessage.includes("Team not found")) {
        showToast.error(errorMessage);
      }
    }
  }, [teamQuery.error]);

  const startPolling = () => {
    const pollInterval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
      incrementPollCount();

      if (pollCount >= 20) {
        clearInterval(pollInterval);
        setGenerating(false);
      }
    }, 3000);

    return pollInterval;
  };

  return {
    teamData: teamQuery.data,

    isLoadingTeam: teamQuery.isLoading,
    isGenerating,

    generateTeam: generateTeamMutation.mutate,
    refetchTeam: teamQuery.refetch,

    teamError: teamQuery.error?.message,
    generateError: generateTeamMutation.error?.message,

    isGeneratingTeam: generateTeamMutation.isPending,
  };
};

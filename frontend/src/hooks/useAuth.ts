import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { apiClient, handleApiResponse } from "../lib/api-client";
import { AuthRequest, AuthResponse } from "../types/auth";
import { useAuthStore } from "../store/authStore";

const authApi = {
  authenticate: async (credentials: AuthRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      "/auth/authenticate",
      credentials
    );
    return handleApiResponse(response);
  },

  getProfile: async () => {
    const response = await apiClient.get("/auth/profile");
    return handleApiResponse(response);
  },

  forgotPassword: async (email: string) => {
    const response = await apiClient.post("/auth/forgot-password", { email });
    return handleApiResponse(response);
  },

  resetPassword: async (token: string, password: string) => {
    const response = await apiClient.post("/auth/reset-password", {
      token,
      password,
    });
    return handleApiResponse(response);
  },
};

export const useAuth = () => {
  const { login, logout, setLoading, setError, clearError } = useAuthStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: authApi.authenticate,
    onMutate: () => {
      setLoading(true);
      clearError();
    },
    onSuccess: (data) => {
      if (data.success && data.data) {
        login(data.data.token, data.data.user);
        queryClient.invalidateQueries();
        navigate("/dashboard");
      } else {
        setError(data.error || "Authentication failed");
      }
    },
    onError: (error: Error) => {
      setError(error.message);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: (data) => {
      if (!data.success) {
        throw new Error(data.error || "Failed to send reset email");
      }
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      authApi.resetPassword(token, password),
    onSuccess: (data) => {
      if (!data.success) {
        throw new Error(data.error || "Failed to reset password");
      }
    },
  });

  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: authApi.getProfile,
    enabled: !!useAuthStore.getState().token,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const handleLogout = () => {
    logout();
    queryClient.clear();
    navigate("/login");
  };

  return {
    login: loginMutation.mutate,
    logout: handleLogout,
    forgotPassword: forgotPasswordMutation.mutate,
    resetPassword: resetPasswordMutation.mutate,

    isLoggingIn: loginMutation.isPending,
    isSendingResetEmail: forgotPasswordMutation.isPending,
    isResettingPassword: resetPasswordMutation.isPending,
    isLoadingProfile: profileQuery.isLoading,

    profile: profileQuery.data,

    // Errors
    loginError: loginMutation.error?.message,
    resetEmailError: forgotPasswordMutation.error?.message,
    resetPasswordError: resetPasswordMutation.error?.message,
    profileError: profileQuery.error?.message,
  };
};

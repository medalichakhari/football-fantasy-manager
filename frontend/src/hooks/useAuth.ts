import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { apiClient, handleApiResponse } from "../lib/api-client";
import { AuthRequest, AuthResponse } from "../types/auth";
import { useAuthStore } from "../store/authStore";
import { showToast } from "../utils/toast";

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
  const { login, logout, setLoading, setError, clearError, updateUser } =
    useAuthStore();
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
        showToast.success("Welcome back! Login successful.");
        navigate("/my-team");
      } else {
        const errorMessage = data.error || "Authentication failed";
        setError(errorMessage);
        showToast.error(errorMessage);
      }
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error ||
        error?.message ||
        "Login failed. Please try again.";
      setError(errorMessage);
      showToast.error(errorMessage);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: authApi.forgotPassword,
    onMutate: () => {
      setLoading(true);
      clearError();
    },
    onSuccess: (data) => {
      if (data.success) {
        showToast.success("Password reset email sent! Check your inbox.");
      } else {
        const errorMessage = data.error || "Failed to send reset email";
        showToast.error(errorMessage);
        throw new Error(errorMessage);
      }
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error ||
        error?.message ||
        "Failed to send reset email. Please try again.";
      showToast.error(errorMessage);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      authApi.resetPassword(token, password),
    onMutate: () => {
      setLoading(true);
      clearError();
    },
    onSuccess: (data) => {
      if (data.success) {
        showToast.success(
          "Password reset successful! You can now login with your new password."
        );
      } else {
        const errorMessage = data.error || "Failed to reset password";
        showToast.error(errorMessage);
        throw new Error(errorMessage);
      }
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error ||
        error?.message ||
        "Failed to reset password. Please try again.";
      showToast.error(errorMessage);
    },
    onSettled: () => {
      setLoading(false);
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
    showToast.success("You have been logged out successfully.");
    navigate("/login");
  };

  useEffect(() => {
    if (profileQuery.data) {
      updateUser({
        budget: profileQuery.data.budget,
        teamGenerationStatus: profileQuery.data.teamGenerationStatus,
      });
    }
  }, [profileQuery.data, updateUser]);

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

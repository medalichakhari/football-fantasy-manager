import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  authService,
  AuthRequest,
  AuthResponse,
} from "../services/authService";

export interface UseAuthForm {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UseAuthFormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export function useAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState<UseAuthForm>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<UseAuthFormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: UseAuthFormErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one lowercase letter, one uppercase letter, and one number";
    }

    // Confirm password validation (only for registration)
    if (!isLogin) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const authMutation = useMutation<AuthResponse, Error, AuthRequest>({
    mutationFn: authService.authenticate,
    onSuccess: (data) => {
      if (data.success) {
        // Handle successful authentication
        window.location.href = "/dashboard";
      } else {
        setErrors({ general: data.error || "Authentication failed" });
      }
    },
    onError: (error) => {
      setErrors({ general: error.message || "An unexpected error occurred" });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    authMutation.mutate({
      email: formData.email,
      password: formData.password,
    });
  };

  const updateField = (field: keyof UseAuthForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData({ email: formData.email, password: "", confirmPassword: "" });
  };

  return {
    isLogin,
    formData,
    errors,
    isLoading: authMutation.isPending,
    handleSubmit,
    updateField,
    toggleMode,
  };
}

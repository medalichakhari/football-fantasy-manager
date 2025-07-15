export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse extends ApiResponse {
  data?: {
    token: string;
    user: {
      id: string;
      email: string;
      budget: number;
      teamGenerationStatus: string;
    };
    isNewUser: boolean;
  };
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData extends LoginFormData {
  confirmPassword: string;
}

export interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

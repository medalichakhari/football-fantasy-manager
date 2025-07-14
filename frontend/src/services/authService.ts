import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    token: string;
    user: {
      id: string;
      email: string;
    };
    isNewUser: boolean;
  };
  error?: string;
  message?: string;
}

class AuthService {
  private baseURL: string;

  constructor() {
    this.baseURL = `${API_BASE_URL}/auth`;
  }

  async authenticate(credentials: AuthRequest): Promise<AuthResponse> {
    try {
      const response = await axios.post<AuthResponse>(
        `${this.baseURL}/authenticate`,
        credentials
      );

      if (response.data.success && response.data.data?.token) {
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.data.user));
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      }

      return {
        success: false,
        error: "Network error occurred",
      };
    }
  }

  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  getToken(): string | null {
    return localStorage.getItem("token");
  }

  getCurrentUser(): { id: string; email: string } | null {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();

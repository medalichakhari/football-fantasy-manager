import toast from "react-hot-toast";

const baseStyle = {
  borderRadius: "8px",
  padding: "16px",
  fontSize: "14px",
  fontWeight: "500",
  boxShadow:
    "0 4px 12px -2px rgba(0, 0, 0, 0.05), 0 4px 8px -2px rgba(0, 0, 0, 0.1)",
  maxWidth: "420px",
};

export const showToast = {
  success: (message: string, options?: any) => {
    return toast.success(message, {
      duration: 3000,
      style: {
        ...baseStyle,
        background: "#ffffff",
        color: "#374151",
        border: "1px solid #10b981",
      },
      iconTheme: {
        primary: "#10b981",
        secondary: "#ffffff",
      },
      ...options,
    });
  },

  error: (message: string, options?: any) => {
    return toast.error(message, {
      duration: 5000,
      style: {
        ...baseStyle,
        background: "#ffffff",
        color: "#374151",
        border: "1px solid #ef4444",
      },
      iconTheme: {
        primary: "#ef4444",
        secondary: "#ffffff",
      },
      ...options,
    });
  },

  loading: (message: string, options?: any) => {
    return toast.loading(message, {
      style: {
        ...baseStyle,
        background: "#ffffff",
        color: "#6b7280",
        border: "1px solid #e5e7eb",
      },
      ...options,
    });
  },

  info: (message: string, options?: any) => {
    return toast(message, {
      duration: 4000,
      style: {
        ...baseStyle,
        background: "#ffffff",
        color: "#374151",
        border: "1px solid #3b82f6",
      },
      icon: "ℹ️",
      ...options,
    });
  },

  warning: (message: string, options?: any) => {
    return toast(message, {
      duration: 4000,
      style: {
        ...baseStyle,
        background: "#ffffff",
        color: "#374151",
        border: "1px solid #f59e0b",
      },
      ...options,
    });
  },

  promise: <T>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    },
    options?: any
  ) => {
    return toast.promise(
      promise,
      {
        loading,
        success,
        error,
      },
      {
        style: baseStyle,
        ...options,
      }
    );
  },

  dismissAll: () => toast.dismiss(),

  dismiss: (toastId: string) => toast.dismiss(toastId),
};

export default showToast;

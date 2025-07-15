import { ReactNode } from "react";
import { cn } from "../../utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const LoadingSpinner = ({
  size = "md",
  className,
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-b-2 border-blue-600",
        sizeClasses[size],
        className
      )}
    />
  );
};

interface LoadingStateProps {
  title?: string;
  description?: string;
  className?: string;
}

export const LoadingState = ({
  title = "Loading...",
  description,
  className,
}: LoadingStateProps) => (
  <div
    className={cn("flex flex-col items-center justify-center p-8", className)}
  >
    <LoadingSpinner size="lg" className="mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
    {description && (
      <p className="text-sm text-gray-600 text-center max-w-md">
        {description}
      </p>
    )}
  </div>
);

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export const ErrorState = ({
  title = "Something went wrong",
  description,
  onRetry,
  retryLabel = "Try Again",
  className,
}: ErrorStateProps) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center p-8 text-center",
      className
    )}
  >
    <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
    {description && (
      <p className="text-sm text-gray-600 mb-4 max-w-md">{description}</p>
    )}
    {onRetry && (
      <button
        onClick={onRetry}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        {retryLabel}
      </button>
    )}
  </div>
);

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export const EmptyState = ({
  title,
  description,
  action,
  icon,
  className,
}: EmptyStateProps) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center p-8 text-center",
      className
    )}
  >
    {icon && <div className="mb-4">{icon}</div>}
    <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
    {description && (
      <p className="text-sm text-gray-600 mb-4 max-w-md">{description}</p>
    )}
    {action && <div>{action}</div>}
  </div>
);

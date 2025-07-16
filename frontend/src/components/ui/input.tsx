import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "../../utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <div>
        <input
          type={type}
          className={cn(
            "flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-colors",
            "placeholder:text-gray-500",
            "focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error &&
              "border-red-500 focus:border-red-500 focus:ring-red-500/20",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };

import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Mail } from "lucide-react";
import { authService } from "../services/authService";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      const result = await authService.forgotPassword(data.email);
      if (result.success) {
        setIsSubmitted(true);
      }
      // Always show success message for security (don't reveal if email exists)
      setIsSubmitted(true);
    } catch (error) {
      console.error("Forgot password error:", error);
      // Always show success message for security
      setIsSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="max-w-md w-full mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <Mail className="h-8 w-8 text-white" />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Check Your Email
              </h2>

              <p className="text-gray-600 mb-6">
                If an account with that email exists, we've sent you a password
                reset link.
              </p>

              <div className="space-y-4">
                <Link
                  to="/login"
                  className="w-full inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Link>

                <p className="text-sm text-gray-500">
                  Didn't receive an email? Check your spam folder.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Forgot Password?
            </h2>
            <p className="text-gray-600">
              Enter your email address and we'll send you a reset link
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

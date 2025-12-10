"use client";
import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { changePassword, changeEmail } from "@/services/auth.service";

// Validation schemas
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const emailSchema = z.object({
  newEmail: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type PasswordFormValues = z.infer<typeof passwordSchema>;
type EmailFormValues = z.infer<typeof emailSchema>;

export default function SettingsPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showEmailPassword, setShowEmailPassword] = useState(false);
  const [submittingPassword, setSubmittingPassword] = useState(false);
  const [submittingEmail, setSubmittingEmail] = useState(false);

  // Password form
  const passwordMethods = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Email form
  const emailMethods = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      newEmail: "",
      password: "",
    },
  });

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    const toastId = toast.loading("Changing password...");
    setSubmittingPassword(true);

    try {
      await changePassword(data.currentPassword, data.newPassword);
      toast.success("Password changed successfully", { id: toastId });
      passwordMethods.reset();
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || "Failed to change password";
      toast.error(errorMessage, { id: toastId });
    } finally {
      setSubmittingPassword(false);
    }
  };

  const onEmailSubmit = async (data: EmailFormValues) => {
    const toastId = toast.loading("Changing email...");
    setSubmittingEmail(true);

    try {
      await changeEmail(data.newEmail, data.password);
      toast.success("Email changed successfully", { id: toastId });
      emailMethods.reset();
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || "Failed to change email";
      toast.error(errorMessage, { id: toastId });
    } finally {
      setSubmittingEmail(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="mt-2 text-gray-600">
            Manage your account security and preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* Change Password Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Change Password
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Update your password to keep your account secure
              </p>
            </div>

            <FormProvider {...passwordMethods}>
              <form
                onSubmit={passwordMethods.handleSubmit(onPasswordSubmit)}
                className="space-y-4"
              >
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Enter current password"
                      {...passwordMethods.register("currentPassword")}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showCurrentPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  {passwordMethods.formState.errors.currentPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {passwordMethods.formState.errors.currentPassword.message}
                    </p>
                  )}
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Enter new password (min 6 characters)"
                      {...passwordMethods.register("newPassword")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showNewPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  {passwordMethods.formState.errors.newPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {passwordMethods.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Re-enter new password"
                      {...passwordMethods.register("confirmPassword")}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  {passwordMethods.formState.errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {passwordMethods.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submittingPassword}
                  className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  {submittingPassword ? "Changing..." : "Change Password"}
                </button>
              </form>
            </FormProvider>
          </div>

          {/* Change Email Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Change Email
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Update your email address for account recovery and notifications
              </p>
            </div>

            <FormProvider {...emailMethods}>
              <form
                onSubmit={emailMethods.handleSubmit(onEmailSubmit)}
                className="space-y-4"
              >
                {/* New Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Enter new email address"
                    {...emailMethods.register("newEmail")}
                  />
                  {emailMethods.formState.errors.newEmail && (
                    <p className="mt-1 text-sm text-red-600">
                      {emailMethods.formState.errors.newEmail.message}
                    </p>
                  )}
                </div>

                {/* Password Confirmation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showEmailPassword ? "text" : "password"}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Enter your password"
                      {...emailMethods.register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowEmailPassword(!showEmailPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showEmailPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  {emailMethods.formState.errors.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {emailMethods.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submittingEmail}
                  className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  {submittingEmail ? "Changing..." : "Change Email"}
                </button>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </div>
  );
}

// Eye Icon Components
function EyeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
      />
    </svg>
  );
}

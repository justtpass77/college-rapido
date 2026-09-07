import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Bike, Mail, Lock } from "lucide-react";
import InputField from "../components/common/InputField";
import Button from "../components/common/Button";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { isValidEmail } from "../utils/validators";

interface LoginFormValues {
  email: string;
  password: string;
}

export default function Login() {
  const { login, resetPassword } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<LoginFormValues>();

  const onSubmit = async (values: LoginFormValues) => {
    setSubmitting(true);
    const res = await login(values.email, values.password);
    setSubmitting(false);
    if (!res.success) {
      showToast(res.error ?? "Login failed. Please try again.", "error");
      return;
    }
    showToast("Welcome back!", "success");
    navigate("/home");
  };

  const handleForgotPassword = async () => {
    const email = getValues("email");
    if (!email || !isValidEmail(email)) {
      showToast("Enter your email above first, then tap Forgot Password.", "error");
      return;
    }
    const res = await resetPassword(email);
    if (res.success) showToast("Password reset link sent to your email (mock).", "success");
    else showToast(res.error ?? "Could not send reset link.", "error");
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center bg-white px-6 py-10">
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFC800]">
          <Bike className="h-6 w-6 text-[#1A1A1A]" />
        </div>
        <h1 className="mt-3 text-2xl font-extrabold text-[#1A1A1A]">Welcome back</h1>
        <p className="mt-1 text-sm text-gray-500">Login to book or post your next campus ride</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <InputField
          label="College Email"
          icon={<Mail className="h-4 w-4" />}
          placeholder="you@college.edu"
          error={errors.email?.message}
          {...register("email", {
            required: "Email is required",
            validate: (v) => isValidEmail(v) || "Enter a valid email address",
          })}
        />
        <InputField
          type="password"
          label="Password"
          icon={<Lock className="h-4 w-4" />}
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password", { required: "Password is required" })}
        />

        <button
          type="button"
          onClick={handleForgotPassword}
          className="self-end text-xs font-semibold text-gray-500 underline hover:text-gray-800"
        >
          Forgot Password?
        </button>

        <Button type="submit" size="lg" fullWidth isLoading={submitting} className="mt-2">
          Login
        </Button>
      </form>

      <div className="mt-6 rounded-2xl bg-yellow-50 p-3 text-center text-xs text-gray-500">
        Demo tip: use <span className="font-semibold text-gray-700">aarav.sharma@nitcollege.edu</span> /{" "}
        <span className="font-semibold text-gray-700">password123</span>
      </div>

      <p className="mt-6 text-center text-sm text-gray-500">
        Don't have an account?{" "}
        <Link to="/signup" className="font-semibold text-[#1A1A1A] underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
}

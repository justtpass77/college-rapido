import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Bike, Mail, User, Phone, Lock, School } from "lucide-react";
import InputField from "../components/common/InputField";
import Button from "../components/common/Button";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { isValidEmail, isValidPhone, isValidPassword } from "../utils/validators";
import { COLLEGE_LIST } from "../data/mockUsers";
import type { Role } from "../types";

interface SignUpFormValues {
  name: string;
  email: string;
  collegeName: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export default function SignUp() {
  const { signUp } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("passenger");
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormValues>({ defaultValues: { collegeName: COLLEGE_LIST[0] } });

  const password = watch("password");

  const onSubmit = async (values: SignUpFormValues) => {
    setSubmitting(true);
    const res = await signUp({
      name: values.name,
      email: values.email,
      collegeName: values.collegeName,
      phone: values.phone,
      password: values.password,
      role,
    });
    setSubmitting(false);
    if (!res.success) {
      showToast(res.error ?? "Something went wrong. Try again.", "error");
      return;
    }
    showToast("Account created! Let's set up your profile.", "success");
    navigate("/onboarding");
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col bg-white px-6 py-10">
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFC800]">
          <Bike className="h-6 w-6 text-[#1A1A1A]" />
        </div>
        <h1 className="mt-3 text-2xl font-extrabold text-[#1A1A1A]">Create your account</h1>
        <p className="mt-1 text-sm text-gray-500">Join your campus ride-sharing community</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <InputField
          label="Full Name"
          icon={<User className="h-4 w-4" />}
          placeholder="Aarav Sharma"
          error={errors.name?.message}
          {...register("name", { required: "Full name is required" })}
        />

        <InputField
          label="College Email"
          icon={<Mail className="h-4 w-4" />}
          placeholder="you@college.edu"
          error={errors.email?.message}
          {...register("email", {
            required: "College email is required",
            validate: (v) => isValidEmail(v) || "Enter a valid email address",
          })}
        />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Select Your College</label>
          <div className="relative">
            <School className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <select
              className="w-full appearance-none rounded-2xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none focus:border-[#FFC800] focus:ring-2 focus:ring-yellow-200"
              {...register("collegeName", { required: true })}
            >
              {COLLEGE_LIST.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <InputField
          label="Phone Number"
          icon={<Phone className="h-4 w-4" />}
          placeholder="9876543210"
          maxLength={10}
          error={errors.phone?.message}
          {...register("phone", {
            required: "Phone number is required",
            validate: (v) => isValidPhone(v) || "Enter a valid 10-digit phone number",
          })}
        />

        <InputField
          type="password"
          label="Password"
          icon={<Lock className="h-4 w-4" />}
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password", {
            required: "Password is required",
            validate: (v) => isValidPassword(v) || "Password must be at least 6 characters",
          })}
        />

        <InputField
          type="password"
          label="Confirm Password"
          icon={<Lock className="h-4 w-4" />}
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (v) => v === password || "Passwords do not match",
          })}
        />

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">I want to...</label>
          <div className="flex flex-col gap-2">
            {[
              { value: "driver", label: "Be a Rider (Driver)" },
              { value: "passenger", label: "Be a Passenger" },
              { value: "both", label: "Do Both" },
            ].map((opt) => (
              <label
                key={opt.value}
                className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition-colors ${
                  role === opt.value ? "border-[#FFC800] bg-yellow-50" : "border-gray-200 bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  className="h-4 w-4 accent-[#FFC800]"
                  checked={role === opt.value}
                  onChange={() => setRole(opt.value as Role)}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        <Button type="submit" size="lg" fullWidth isLoading={submitting} className="mt-2">
          Sign Up
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-[#1A1A1A] underline">
          Login
        </Link>
      </p>
    </div>
  );
}

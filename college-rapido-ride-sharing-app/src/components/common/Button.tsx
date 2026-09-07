import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  isLoading?: boolean;
  icon?: ReactNode;
}

const variants: Record<string, string> = {
  primary: "bg-[#FFC800] text-[#1A1A1A] hover:bg-yellow-400 shadow-md shadow-yellow-200 disabled:bg-yellow-200",
  secondary: "bg-white text-[#1A1A1A] border-2 border-[#1A1A1A] hover:bg-gray-50",
  ghost: "bg-transparent text-[#1A1A1A] hover:bg-gray-100",
  danger: "bg-red-500 text-white hover:bg-red-600 shadow-md shadow-red-100",
};

const sizes: Record<string, string> = {
  sm: "text-sm px-3 py-2",
  md: "text-sm px-4 py-3",
  lg: "text-base px-5 py-3.5",
};

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  isLoading = false,
  icon,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition-all duration-150 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className
      )}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
      {children}
    </button>
  );
}

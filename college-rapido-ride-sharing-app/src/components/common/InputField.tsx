import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../utils/cn";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  hint?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, icon, hint, className, ...rest }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>}
        <div className="relative">
          {icon && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>}
          <input
            ref={ref}
            className={cn(
              "w-full rounded-2xl border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400",
              "focus:border-[#FFC800] focus:ring-2 focus:ring-yellow-200",
              icon && "pl-10",
              error ? "border-red-400" : "border-gray-200",
              className
            )}
            {...rest}
          />
        </div>
        {error && <p className="mt-1 text-xs font-medium text-red-500">{error}</p>}
        {!error && hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
      </div>
    );
  }
);

InputField.displayName = "InputField";
export default InputField;

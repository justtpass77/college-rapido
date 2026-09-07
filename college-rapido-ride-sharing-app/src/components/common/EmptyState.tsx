import type { ReactNode } from "react";
import Button from "./Button";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ icon, title, message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 px-6 py-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 text-[#1A1A1A]">{icon}</div>
      <h3 className="text-base font-bold text-gray-800">{title}</h3>
      {message && <p className="max-w-xs text-sm text-gray-500">{message}</p>}
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction} className="mt-1">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

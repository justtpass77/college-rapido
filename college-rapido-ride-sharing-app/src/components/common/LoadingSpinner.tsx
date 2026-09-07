import { Loader2 } from "lucide-react";

export function LoadingSpinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-gray-500">
      <Loader2 className="h-7 w-7 animate-spin text-[#FFC800]" />
      {label && <p className="text-sm font-medium">{label}</p>}
    </div>
  );
}

export function RideCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-full bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-24 rounded bg-gray-200" />
          <div className="h-2.5 w-16 rounded bg-gray-200" />
        </div>
        <div className="h-6 w-14 rounded-full bg-gray-200" />
      </div>
      <div className="mt-4 h-3 w-3/4 rounded bg-gray-200" />
      <div className="mt-3 flex items-center justify-between">
        <div className="h-3 w-20 rounded bg-gray-200" />
        <div className="h-8 w-20 rounded-xl bg-gray-200" />
      </div>
    </div>
  );
}

export default LoadingSpinner;

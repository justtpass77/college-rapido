import { cn } from "../../utils/cn";

type StatusType = "active" | "confirmed" | "pending" | "completed" | "cancelled" | "verified" | "booked";

const styles: Record<StatusType, string> = {
  active: "bg-blue-100 text-blue-700",
  confirmed: "bg-blue-100 text-blue-700",
  booked: "bg-blue-100 text-blue-700",
  pending: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  verified: "bg-green-100 text-green-700",
};

const labels: Record<StatusType, string> = {
  active: "Active",
  confirmed: "Confirmed",
  booked: "Confirmed",
  pending: "Pending",
  completed: "Completed",
  cancelled: "Cancelled",
  verified: "Verified",
};

export default function Badge({ status, text, className }: { status: StatusType; text?: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold", styles[status], className)}>
      {text ?? labels[status]}
    </span>
  );
}

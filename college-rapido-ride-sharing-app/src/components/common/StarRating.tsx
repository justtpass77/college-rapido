import { Star } from "lucide-react";
import { cn } from "../../utils/cn";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
  readonly?: boolean;
  showValue?: boolean;
}

export default function StarRating({ value, onChange, size = 18, readonly = false, showValue = false }: StarRatingProps) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="flex items-center gap-1">
      {stars.map((s) => (
        <button
          key={s}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(s)}
          className={cn("transition-transform", !readonly && "hover:scale-110 active:scale-95")}
        >
          <Star
            size={size}
            className={s <= Math.round(value) ? "fill-[#FFC800] text-[#FFC800]" : "fill-gray-200 text-gray-200"}
          />
        </button>
      ))}
      {showValue && <span className="ml-1 text-sm font-semibold text-gray-700">{value.toFixed(1)}</span>}
    </div>
  );
}

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MapPin, Minus, Plus, Calendar, Clock, IndianRupee } from "lucide-react";
import InputField from "../common/InputField";
import Button from "../common/Button";
import { suggestFare } from "../../utils/formatters";

export interface PostRideFormValues {
  fromLocation: string;
  toLocation: string;
  date: string;
  time: string;
  totalSeats: number;
  farePerSeat: number;
  note?: string;
}

interface PostRideFormProps {
  onSubmit: (values: PostRideFormValues) => void;
  isSubmitting?: boolean;
}

const today = new Date().toISOString().slice(0, 10);

export default function PostRideForm({ onSubmit, isSubmitting }: PostRideFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PostRideFormValues>({
    defaultValues: { totalSeats: 2, farePerSeat: 20, date: today, time: "" },
  });

  const [seats, setSeats] = useState(2);
  const [fareTouched, setFareTouched] = useState(false);
  const from = watch("fromLocation");
  const to = watch("toLocation");

  useEffect(() => {
    if (!fareTouched && from && to) {
      setValue("farePerSeat", suggestFare(from, to));
    }
  }, [from, to, fareTouched, setValue]);

  const changeSeats = (delta: number) => {
    setSeats((prev) => {
      const next = Math.min(4, Math.max(1, prev + delta));
      setValue("totalSeats", next);
      return next;
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <InputField
        label="From Location"
        icon={<MapPin className="h-4 w-4" />}
        placeholder="e.g. Hostel Block A"
        error={errors.fromLocation?.message}
        {...register("fromLocation", { required: "From location is required" })}
      />
      <InputField
        label="To Location"
        icon={<MapPin className="h-4 w-4" />}
        placeholder="e.g. Main Academic Building"
        error={errors.toLocation?.message}
        {...register("toLocation", { required: "To location is required" })}
      />

      <div className="grid grid-cols-2 gap-3">
        <InputField
          type="date"
          label="Date"
          icon={<Calendar className="h-4 w-4" />}
          min={today}
          error={errors.date?.message}
          {...register("date", { required: "Date is required" })}
        />
        <InputField
          type="time"
          label="Time"
          icon={<Clock className="h-4 w-4" />}
          error={errors.time?.message}
          {...register("time", { required: "Time is required" })}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">Available Seats</label>
        <div className="flex items-center justify-between rounded-2xl border border-gray-200 px-4 py-2.5">
          <button
            type="button"
            onClick={() => changeSeats(-1)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-transform active:scale-90"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="text-lg font-bold text-gray-900">{seats}</span>
          <button
            type="button"
            onClick={() => changeSeats(1)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFC800] text-[#1A1A1A] transition-transform active:scale-90"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <input type="hidden" {...register("totalSeats")} />
      </div>

      <InputField
        type="number"
        label="Fare per seat (₹) — auto-suggested, editable"
        icon={<IndianRupee className="h-4 w-4" />}
        error={errors.farePerSeat?.message}
        {...register("farePerSeat", {
          required: "Fare is required",
          min: { value: 5, message: "Minimum fare is ₹5" },
          valueAsNumber: true,
          onChange: () => setFareTouched(true),
        })}
      />

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">Optional Note</label>
        <textarea
          rows={2}
          placeholder="e.g. Will wait 5 mins at gate"
          className="w-full rounded-2xl border border-gray-200 p-3 text-sm outline-none focus:border-[#FFC800] focus:ring-2 focus:ring-yellow-200"
          {...register("note")}
        />
      </div>

      <Button type="submit" fullWidth size="lg" isLoading={isSubmitting} className="mt-2">
        Post Ride
      </Button>
    </form>
  );
}

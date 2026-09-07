import { ArrowRight, Clock, MapPin, Star, Users } from "lucide-react";
import type { Ride } from "../../types";
import { formatCurrency, formatDateLabel, formatTimeLabel } from "../../utils/formatters";
import Button from "../common/Button";
import { initials } from "../../utils/formatters";

interface RideCardProps {
  ride: Ride;
  onBook?: (ride: Ride) => void;
  onClick?: (ride: Ride) => void;
  hideBookButton?: boolean;
}

export default function RideCard({ ride, onBook, onClick, hideBookButton }: RideCardProps) {
  const isFull = ride.availableSeats <= 0;

  return (
    <div
      onClick={() => onClick?.(ride)}
      className="cursor-pointer rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]"
    >
      <div className="flex items-center gap-3">
        {ride.driverPhoto ? (
          <img src={ride.driverPhoto} alt={ride.driverName} className="h-11 w-11 rounded-full object-cover" />
        ) : (
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1A1A1A] text-sm font-bold text-white">
            {initials(ride.driverName)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-gray-900">{ride.driverName}</p>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Star className="h-3.5 w-3.5 fill-[#FFC800] text-[#FFC800]" />
            {ride.driverRating.toFixed(1)}
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-extrabold text-gray-900">{formatCurrency(ride.farePerSeat)}</p>
          <p className="text-[11px] text-gray-400">per seat</p>
        </div>
      </div>

      <div className="my-3 flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 text-sm text-gray-700">
        <MapPin className="h-4 w-4 flex-shrink-0 text-[#FFC800]" />
        <span className="truncate font-medium">{ride.fromLocation}</span>
        <ArrowRight className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
        <span className="truncate font-medium">{ride.toLocation}</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {formatDateLabel(ride.date)}, {formatTimeLabel(ride.time)}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {isFull ? "Full" : `${ride.availableSeats} seat${ride.availableSeats > 1 ? "s" : ""} left`}
          </span>
        </div>
        {!hideBookButton && (
          <Button
            size="sm"
            disabled={isFull}
            onClick={(e) => {
              e.stopPropagation();
              onBook?.(ride);
            }}
          >
            {isFull ? "Full" : "Book Now"}
          </Button>
        )}
      </div>
    </div>
  );
}

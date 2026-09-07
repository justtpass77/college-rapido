import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Star, Bike, PhoneCall, MessageCircle, CheckCircle2, Map as MapIcon } from "lucide-react";
import { useRides } from "../context/RideContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import { formatCurrency, formatDateLabel, formatTimeLabel, initials } from "../utils/formatters";

export default function RideDetails() {
  const { rideId } = useParams();
  const { rides, bookRide } = useRides();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(false);

  const ride = useMemo(() => rides.find((r) => r.rideId === rideId), [rides, rideId]);

  const alreadyBooked = ride?.passengers.some((p) => p.passengerId === user?.uid && p.status === "booked");
  const [justBooked, setJustBooked] = useState(false);

  if (!ride) {
    return (
      <div className="px-4 pt-6">
        <EmptyState icon={<MapPin className="h-7 w-7" />} title="Ride not found" message="This ride may have been removed." actionLabel="Go Home" onAction={() => navigate("/home")} />
      </div>
    );
  }

  const platformFee = 5;
  const total = ride.farePerSeat + platformFee;
  const showConfirmation = alreadyBooked || justBooked;

  const handleConfirmBooking = async () => {
    if (!user) return;
    setBooking(true);
    const res = await bookRide(ride.rideId, {
      passengerId: user.uid,
      passengerName: user.name,
      passengerPhoto: user.profilePhoto,
      passengerPhone: user.phone,
      status: "booked",
    });
    setBooking(false);
    if (!res.success) {
      showToast(res.error ?? "Could not book this ride.", "error");
      return;
    }
    setJustBooked(true);
    showToast("Ride booked successfully!", "success");
  };

  return (
    <div className="mx-auto max-w-lg px-4 pt-4 pb-10">
      <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-1 text-sm font-semibold text-gray-500">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      {showConfirmation ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-green-100 bg-green-50 p-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-9 w-9 text-green-600" />
          </div>
          <h2 className="text-lg font-extrabold text-gray-900">Booking Confirmed!</h2>
          <p className="text-sm text-gray-500">
            {ride.driverName} will pick you up from {ride.fromLocation} at {formatTimeLabel(ride.time)}.
          </p>
          <div className="mt-2 flex w-full items-center gap-3 rounded-2xl bg-white p-3 shadow-sm">
            <img src={ride.driverPhoto} alt={ride.driverName} className="h-11 w-11 rounded-full object-cover" />
            <div className="flex-1 text-left">
              <p className="text-sm font-bold text-gray-900">{ride.driverName}</p>
              <p className="text-xs text-gray-500">Driver Contact Available</p>
            </div>
            <a href="tel:+919999999999" className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700">
              <PhoneCall className="h-4 w-4" />
            </a>
          </div>
          <div className="mt-2 flex w-full gap-2">
            <Button fullWidth variant="secondary" onClick={() => navigate("/my-rides")}>
              View My Rides
            </Button>
            <Button fullWidth icon={<MessageCircle className="h-4 w-4" />} onClick={() => navigate(`/chat/${ride.rideId}`)}>
              Chat
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              {ride.driverPhoto ? (
                <img src={ride.driverPhoto} alt={ride.driverName} className="h-14 w-14 rounded-full object-cover" />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1A1A1A] text-lg font-bold text-white">
                  {initials(ride.driverName)}
                </div>
              )}
              <div className="flex-1">
                <p className="text-base font-extrabold text-gray-900">{ride.driverName}</p>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Star className="h-4 w-4 fill-[#FFC800] text-[#FFC800]" /> {ride.driverRating.toFixed(1)} rating
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-gray-600">
              <Bike className="h-4 w-4 text-[#FFC800]" /> Verified student driver on campus
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="mb-2 text-sm font-bold text-gray-800">Route Details</p>
            <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2.5 text-sm text-gray-700">
              <MapPin className="h-4 w-4 flex-shrink-0 text-[#FFC800]" />
              <div className="flex-1">
                <p className="font-semibold">{ride.fromLocation}</p>
                <p className="mt-1 text-gray-400">to</p>
                <p className="font-semibold">{ride.toLocation}</p>
              </div>
            </div>
            <div className="mt-3 flex h-32 flex-col items-center justify-center gap-1 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 text-gray-400">
              <MapIcon className="h-7 w-7" />
              <p className="text-xs font-medium">Map view coming soon</p>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              {formatDateLabel(ride.date)} • {formatTimeLabel(ride.time)} • {ride.availableSeats} seat(s) left
            </p>
            {ride.note && <p className="mt-2 rounded-lg bg-yellow-50 p-2 text-xs text-gray-600">📝 {ride.note}</p>}
          </div>

          <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="mb-2 text-sm font-bold text-gray-800">Fare Breakdown</p>
            <div className="flex justify-between py-1 text-sm text-gray-600">
              <span>Base Fare</span>
              <span>{formatCurrency(ride.farePerSeat)}</span>
            </div>
            <div className="flex justify-between py-1 text-sm text-gray-600">
              <span>Platform Fee</span>
              <span>{formatCurrency(platformFee)}</span>
            </div>
            <div className="mt-1 flex justify-between border-t border-dashed border-gray-200 pt-2 text-sm font-extrabold text-gray-900">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
            <p className="mt-2 rounded-lg bg-gray-50 p-2 text-center text-xs font-semibold text-gray-500">Payment: Cash on Ride</p>
          </div>

          <Button fullWidth size="lg" className="mt-5" isLoading={booking} onClick={handleConfirmBooking} disabled={ride.availableSeats <= 0}>
            {ride.availableSeats <= 0 ? "No Seats Available" : "Confirm Booking"}
          </Button>
        </>
      )}
    </div>
  );
}

import { useMemo, useState } from "react";
import { CalendarClock, History, MapPin, PhoneCall, Star } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useRides } from "../context/RideContext";
import { useToast } from "../context/ToastContext";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import RatingModal from "../components/ride/RatingModal";
import { formatCurrency, formatDateLabel, formatTimeLabel } from "../utils/formatters";
import { rideService } from "../services/rideService";
import type { Ride } from "../types";

type Tab = "upcoming" | "past";

export default function MyRides() {
  const { user } = useAuth();
  const { rides, cancelRide, cancelBooking } = useRides();
  const { showToast } = useToast();
  const [tab, setTab] = useState<Tab>("upcoming");
  const [rateTarget, setRateTarget] = useState<{ ride: Ride; toUserId: string; toName: string } | null>(null);
  const [ratedKeys, setRatedKeys] = useState<Set<string>>(new Set());

  const myRides = useMemo(() => {
    if (!user) return [];
    return rides.filter(
      (r) => r.driverId === user.uid || r.passengers.some((p) => p.passengerId === user.uid)
    );
  }, [rides, user]);

  const upcoming = myRides.filter((r) => r.status === "active");
  const past = myRides.filter((r) => r.status !== "active");

  if (!user) return null;

  const handleCancel = async (ride: Ride) => {
    if (ride.driverId === user.uid) {
      await cancelRide(ride.rideId);
    } else {
      await cancelBooking(ride.rideId, user.uid);
    }
    showToast("Ride cancelled.", "info");
  };

  const handleSubmitRating = async (stars: number, comment: string) => {
    if (!rateTarget) return;
    await rideService.addRating({
      rideId: rateTarget.ride.rideId,
      fromUserId: user.uid,
      toUserId: rateTarget.toUserId,
      stars,
      comment,
    });
    setRatedKeys((prev) => new Set(prev).add(`${rateTarget.ride.rideId}_${rateTarget.toUserId}`));
    setRateTarget(null);
    showToast("Thanks for your feedback!", "success");
  };

  const list = tab === "upcoming" ? upcoming : past;

  return (
    <div className="mx-auto max-w-lg px-4 pt-4 pb-8">
      <h1 className="mb-4 text-xl font-extrabold text-[#1A1A1A]">My Rides</h1>

      <div className="mb-4 flex rounded-2xl bg-gray-100 p-1">
        {(["upcoming", "past"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-xl py-2 text-sm font-bold capitalize transition-colors ${
              tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-400"
            }`}
          >
            {t} Rides
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <EmptyState
          icon={tab === "upcoming" ? <CalendarClock className="h-7 w-7" /> : <History className="h-7 w-7" />}
          title={tab === "upcoming" ? "No upcoming rides" : "No past rides"}
          message={tab === "upcoming" ? "Book or post a ride to see it here." : "Your completed and cancelled rides will show up here."}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {list.map((ride) => {
            const isDriver = ride.driverId === user.uid;
            const myBooking = ride.passengers.find((p) => p.passengerId === user.uid);
            const status = ride.status === "active" ? (isDriver ? "active" : myBooking?.status === "cancelled" ? "cancelled" : "confirmed") : ride.status;
            const ratedKey = `${ride.rideId}_${isDriver ? "passenger" : ride.driverId}`;

            return (
              <div key={ride.rideId} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                    <MapPin className="h-4 w-4 text-[#FFC800]" />
                    {ride.fromLocation} → {ride.toLocation}
                  </div>
                  <Badge status={status as any} />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {formatDateLabel(ride.date)} • {formatTimeLabel(ride.time)} • {formatCurrency(ride.farePerSeat)}/seat
                </p>
                <p className="mt-1 text-xs font-semibold text-gray-600">
                  {isDriver ? "You are the driver" : `Driver: ${ride.driverName}`}
                </p>

                {tab === "upcoming" && (
                  <div className="mt-3 flex gap-2">
                    <a
                      href={`tel:${isDriver ? "+919999999999" : ride.passengers[0]?.passengerPhone ?? ""}`}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gray-100 py-2 text-xs font-bold text-gray-700"
                    >
                      <PhoneCall className="h-3.5 w-3.5" /> Contact {isDriver ? "Passenger" : "Driver"}
                    </a>
                    {status !== "cancelled" && (
                      <Button size="sm" variant="danger" fullWidth onClick={() => handleCancel(ride)}>
                        Cancel
                      </Button>
                    )}
                  </div>
                )}

                {tab === "past" && ride.status === "completed" && (
                  <div className="mt-3">
                    {ratedKeys.has(ratedKey) ? (
                      <div className="flex items-center justify-center gap-1 rounded-xl bg-yellow-50 py-2 text-xs font-bold text-gray-600">
                        <Star className="h-3.5 w-3.5 fill-[#FFC800] text-[#FFC800]" /> Rated, thank you!
                      </div>
                    ) : isDriver ? (
                      <div className="flex flex-col gap-1.5">
                        {ride.passengers
                          .filter((p) => p.status === "booked")
                          .map((p) => (
                            <Button
                              key={p.passengerId}
                              size="sm"
                              variant="secondary"
                              fullWidth
                              onClick={() => setRateTarget({ ride, toUserId: p.passengerId, toName: p.passengerName })}
                            >
                              Rate {p.passengerName}
                            </Button>
                          ))}
                        {ride.passengers.filter((p) => p.status === "booked").length === 0 && (
                          <p className="text-center text-xs text-gray-400">No passengers to rate.</p>
                        )}
                      </div>
                    ) : (
                      <Button size="sm" variant="secondary" fullWidth onClick={() => setRateTarget({ ride, toUserId: ride.driverId, toName: ride.driverName })}>
                        Rate this ride
                      </Button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <RatingModal
        isOpen={!!rateTarget}
        onClose={() => setRateTarget(null)}
        onSubmit={handleSubmitRating}
        targetName={rateTarget?.toName ?? ""}
      />
    </div>
  );
}

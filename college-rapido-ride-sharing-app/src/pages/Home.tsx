import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRightLeft, MapPin, Plus, SlidersHorizontal, ChevronDown, ChevronUp, PhoneCall, CheckCircle2, XCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useRides } from "../context/RideContext";
import { useToast } from "../context/ToastContext";
import RideCard from "../components/ride/RideCard";
import EmptyState from "../components/common/EmptyState";
import { RideCardSkeleton } from "../components/common/LoadingSpinner";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import InputField from "../components/common/InputField";
import { formatCurrency, formatDateLabel, formatTimeLabel } from "../utils/formatters";
import type { Ride, UserProfile } from "../types";

type SortOption = "time" | "price" | "rating";

export default function Home() {
  const { user } = useAuth();
  if (!user) return null;
  return user.activeMode === "driver" ? <DriverHome user={user} /> : <PassengerHome user={user} />;
}

function PassengerHome({ user }: { user: UserProfile }) {
  const { rides, loading } = useRides();
  const navigate = useNavigate();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sort, setSort] = useState<SortOption>("time");

  const availableRides = useMemo(() => {
    let list = rides.filter((r) => r.status === "active" && r.driverId !== user.uid);
    if (from.trim()) list = list.filter((r) => r.fromLocation.toLowerCase().includes(from.trim().toLowerCase()));
    if (to.trim()) list = list.filter((r) => r.toLocation.toLowerCase().includes(to.trim().toLowerCase()));

    list = [...list].sort((a, b) => {
      if (sort === "price") return a.farePerSeat - b.farePerSeat;
      if (sort === "rating") return b.driverRating - a.driverRating;
      return (a.date + a.time).localeCompare(b.date + b.time);
    });
    return list;
  }, [rides, from, to, sort, user.uid]);

  return (
    <div className="flex flex-col gap-4 px-4 pt-4">
      <div className="rounded-3xl bg-gradient-to-br from-[#1A1A1A] to-gray-800 p-5 text-white shadow-lg">
        <p className="text-sm font-medium text-gray-300">Hey {user.name.split(" ")[0]} 👋</p>
        <p className="text-lg font-bold">Where do you want to go?</p>
        <div className="mt-3 flex flex-col gap-2">
          <InputField
            icon={<MapPin className="h-4 w-4" />}
            placeholder="From location"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="border-0 bg-white/95"
          />
          <InputField
            icon={<MapPin className="h-4 w-4" />}
            placeholder="To location"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="border-0 bg-white/95"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-gray-800">Available Rides</p>
        <div className="flex items-center gap-1 rounded-full bg-gray-100 p-1 text-xs font-semibold text-gray-500">
          <SlidersHorizontal className="ml-1.5 h-3.5 w-3.5" />
          {(["time", "price", "rating"] as SortOption[]).map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={`rounded-full px-2.5 py-1 capitalize transition-colors ${sort === s ? "bg-white text-gray-900 shadow-sm" : ""}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <RideCardSkeleton key={i} />
          ))}
        </div>
      ) : availableRides.length === 0 ? (
        <EmptyState
          icon={<ArrowRightLeft className="h-7 w-7" />}
          title="No rides available right now"
          message="Check back soon, or try adjusting your search filters!"
        />
      ) : (
        <div className="flex flex-col gap-3 pb-4">
          {availableRides.map((ride) => (
            <RideCard key={ride.rideId} ride={ride} onClick={(r) => navigate(`/ride/${r.rideId}`)} onBook={(r) => navigate(`/ride/${r.rideId}`)} />
          ))}
        </div>
      )}
    </div>
  );
}

function DriverHome({ user }: { user: UserProfile }) {
  const { rides, loading, cancelRide, completeRide } = useRides();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [historyOpen, setHistoryOpen] = useState(false);

  const myRides = rides.filter((r) => r.driverId === user.uid);
  const activeRides = myRides.filter((r) => r.status === "active");
  const historyRides = myRides.filter((r) => r.status !== "active");

  const handleCancel = async (ride: Ride) => {
    await cancelRide(ride.rideId);
    showToast("Ride cancelled.", "info");
  };

  const handleComplete = async (ride: Ride) => {
    await completeRide(ride.rideId);
    showToast("Ride marked as completed!", "success");
  };

  return (
    <div className="flex flex-col gap-5 px-4 pt-4 pb-4">
      <button
        onClick={() => navigate("/post-ride")}
        className="flex items-center justify-center gap-2 rounded-2xl bg-[#FFC800] p-4 text-base font-extrabold text-[#1A1A1A] shadow-lg shadow-yellow-200 transition-transform active:scale-95"
      >
        <Plus className="h-5 w-5" /> Post a New Ride
      </button>

      <div>
        <p className="mb-2 text-sm font-bold text-gray-800">Your Active Rides</p>
        {loading ? (
          <RideCardSkeleton />
        ) : activeRides.length === 0 ? (
          <EmptyState icon={<MapPin className="h-7 w-7" />} title="No active rides" message="Post a new ride to start earning and helping fellow students!" />
        ) : (
          <div className="flex flex-col gap-3">
            {activeRides.map((ride) => (
              <div key={ride.rideId} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                    <MapPin className="h-4 w-4 text-[#FFC800]" />
                    {ride.fromLocation} → {ride.toLocation}
                  </div>
                  <Badge status="active" />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {formatDateLabel(ride.date)} • {formatTimeLabel(ride.time)} • {formatCurrency(ride.farePerSeat)}/seat
                </p>
                <p className="mt-1 text-xs font-semibold text-gray-700">
                  {ride.totalSeats - ride.availableSeats}/{ride.totalSeats} seats filled
                </p>

                {ride.passengers.filter((p) => p.status === "booked").length > 0 && (
                  <div className="mt-3 space-y-1.5 rounded-xl bg-gray-50 p-2.5">
                    {ride.passengers
                      .filter((p) => p.status === "booked")
                      .map((p) => (
                        <div key={p.passengerId} className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-gray-700">{p.passengerName}</span>
                          <a href={`tel:${p.passengerPhone}`} className="flex items-center gap-1 text-gray-500">
                            <PhoneCall className="h-3 w-3" /> {p.passengerPhone}
                          </a>
                        </div>
                      ))}
                  </div>
                )}

                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="secondary" fullWidth onClick={() => handleCancel(ride)}>
                    <XCircle className="h-4 w-4" /> Cancel Ride
                  </Button>
                  <Button size="sm" fullWidth onClick={() => handleComplete(ride)}>
                    <CheckCircle2 className="h-4 w-4" /> Mark Completed
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <button
          onClick={() => setHistoryOpen((v) => !v)}
          className="flex w-full items-center justify-between rounded-2xl bg-gray-50 px-4 py-3 text-sm font-bold text-gray-800"
        >
          Your Ride History ({historyRides.length})
          {historyOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {historyOpen && (
          <div className="mt-2 flex flex-col gap-2">
            {historyRides.length === 0 ? (
              <p className="p-3 text-center text-xs text-gray-400">No past rides yet.</p>
            ) : (
              historyRides.map((ride) => (
                <div key={ride.rideId} className="flex items-center justify-between rounded-xl border border-gray-100 p-3 text-xs">
                  <div>
                    <p className="font-semibold text-gray-800">
                      {ride.fromLocation} → {ride.toLocation}
                    </p>
                    <p className="text-gray-400">
                      {formatDateLabel(ride.date)} • {formatCurrency(ride.farePerSeat)}/seat
                    </p>
                  </div>
                  <Badge status={ride.status === "completed" ? "completed" : "cancelled"} />
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { Ride, RidePassenger } from "../types";
import { rideService } from "../services/rideService";

interface RideContextValue {
  rides: Ride[];
  loading: boolean;
  refreshRides: () => Promise<void>;
  postRide: (ride: Parameters<typeof rideService.postRide>[0]) => Promise<Ride>;
  bookRide: (rideId: string, passenger: RidePassenger) => Promise<{ success: boolean; error?: string }>;
  cancelBooking: (rideId: string, passengerId: string) => Promise<void>;
  cancelRide: (rideId: string) => Promise<void>;
  completeRide: (rideId: string) => Promise<void>;
}

const RideContext = createContext<RideContextValue | undefined>(undefined);

export function RideProvider({ children }: { children: ReactNode }) {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshRides = useCallback(async () => {
    setLoading(true);
    const data = await rideService.getRides();
    setRides(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshRides();
  }, [refreshRides]);

  const postRide: RideContextValue["postRide"] = async (ride) => {
    const newRide = await rideService.postRide(ride);
    setRides((prev) => [newRide, ...prev]);
    return newRide;
  };

  const bookRide: RideContextValue["bookRide"] = async (rideId, passenger) => {
    // optimistic update
    setRides((prev) =>
      prev.map((r) =>
        r.rideId === rideId
          ? { ...r, availableSeats: Math.max(0, r.availableSeats - 1), passengers: [...r.passengers, passenger] }
          : r
      )
    );
    const res = await rideService.bookRide(rideId, passenger);
    if (res.error) {
      await refreshRides();
      return { success: false, error: res.error };
    }
    if (res.ride) {
      setRides((prev) => prev.map((r) => (r.rideId === rideId ? res.ride! : r)));
    }
    return { success: true };
  };

  const cancelBooking: RideContextValue["cancelBooking"] = async (rideId, passengerId) => {
    setRides((prev) =>
      prev.map((r) =>
        r.rideId === rideId
          ? {
              ...r,
              availableSeats: Math.min(r.totalSeats, r.availableSeats + 1),
              passengers: r.passengers.map((p) => (p.passengerId === passengerId ? { ...p, status: "cancelled" } : p)),
            }
          : r
      )
    );
    await rideService.cancelBooking(rideId, passengerId);
  };

  const cancelRide: RideContextValue["cancelRide"] = async (rideId) => {
    setRides((prev) => prev.map((r) => (r.rideId === rideId ? { ...r, status: "cancelled" } : r)));
    await rideService.cancelRide(rideId);
  };

  const completeRide: RideContextValue["completeRide"] = async (rideId) => {
    setRides((prev) => prev.map((r) => (r.rideId === rideId ? { ...r, status: "completed" } : r)));
    await rideService.completeRide(rideId);
  };

  return (
    <RideContext.Provider value={{ rides, loading, refreshRides, postRide, bookRide, cancelBooking, cancelRide, completeRide }}>
      {children}
    </RideContext.Provider>
  );
}

export function useRides() {
  const ctx = useContext(RideContext);
  if (!ctx) throw new Error("useRides must be used within RideProvider");
  return ctx;
}

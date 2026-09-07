import { mockRides } from "../data/mockRides";
import type { Ride, RidePassenger, RatingObj } from "../types";
import { USE_FIREBASE } from "./firebaseConfig";
import { authService } from "./authService";

// ===========================================================
// Mock Ride Service — backed by localStorage. Structured so real
// Firestore collection calls ("rides", "ratings") can drop in later.
// ===========================================================

const RIDES_KEY = "crapido_rides";
const RATINGS_KEY = "crapido_ratings";

const delay = (ms = 350) => new Promise((res) => setTimeout(res, ms));

const readRides = (): Ride[] => {
  const raw = localStorage.getItem(RIDES_KEY);
  if (!raw) {
    localStorage.setItem(RIDES_KEY, JSON.stringify(mockRides));
    return [...mockRides];
  }
  try {
    return JSON.parse(raw) as Ride[];
  } catch {
    return [...mockRides];
  }
};

const writeRides = (rides: Ride[]) => localStorage.setItem(RIDES_KEY, JSON.stringify(rides));

const readRatings = (): RatingObj[] => {
  const raw = localStorage.getItem(RATINGS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as RatingObj[];
  } catch {
    return [];
  }
};

const writeRatings = (ratings: RatingObj[]) => localStorage.setItem(RATINGS_KEY, JSON.stringify(ratings));

export const rideService = {
  async getRides(): Promise<Ride[]> {
    await delay();
    if (USE_FIREBASE) {
      // TODO: replace with Firestore getDocs(collection(db, "rides"))
    }
    return readRides().sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  },

  async postRide(ride: Omit<Ride, "rideId" | "status" | "passengers" | "createdAt" | "availableSeats"> & { availableSeats?: number }): Promise<Ride> {
    await delay();
    const rides = readRides();
    const newRide: Ride = {
      ...ride,
      rideId: `r_${Date.now()}`,
      availableSeats: ride.availableSeats ?? ride.totalSeats,
      status: "active",
      passengers: [],
      createdAt: new Date().toISOString(),
    };
    rides.unshift(newRide);
    writeRides(rides);
    return newRide;
  },

  async bookRide(rideId: string, passenger: RidePassenger): Promise<{ ride?: Ride; error?: string }> {
    await delay();
    const rides = readRides();
    const idx = rides.findIndex((r) => r.rideId === rideId);
    if (idx === -1) return { error: "Ride not found." };
    const ride = rides[idx];
    if (ride.availableSeats <= 0) return { error: "No seats available on this ride." };
    if (ride.passengers.some((p) => p.passengerId === passenger.passengerId && p.status === "booked")) {
      return { error: "You have already booked this ride." };
    }
    ride.passengers.push(passenger);
    ride.availableSeats -= 1;
    rides[idx] = ride;
    writeRides(rides);
    return { ride };
  },

  async cancelBooking(rideId: string, passengerId: string): Promise<Ride | null> {
    await delay();
    const rides = readRides();
    const idx = rides.findIndex((r) => r.rideId === rideId);
    if (idx === -1) return null;
    const ride = rides[idx];
    const p = ride.passengers.find((p) => p.passengerId === passengerId);
    if (p && p.status === "booked") {
      p.status = "cancelled";
      ride.availableSeats = Math.min(ride.totalSeats, ride.availableSeats + 1);
    }
    rides[idx] = ride;
    writeRides(rides);
    return ride;
  },

  async cancelRide(rideId: string): Promise<Ride | null> {
    await delay();
    const rides = readRides();
    const idx = rides.findIndex((r) => r.rideId === rideId);
    if (idx === -1) return null;
    rides[idx].status = "cancelled";
    writeRides(rides);
    return rides[idx];
  },

  async completeRide(rideId: string): Promise<Ride | null> {
    await delay();
    const rides = readRides();
    const idx = rides.findIndex((r) => r.rideId === rideId);
    if (idx === -1) return null;
    rides[idx].status = "completed";
    writeRides(rides);

    // bump driver's total-rides-given count
    const ride = rides[idx];
    const driver = (await authService.getAllUsers()).find((u) => u.uid === ride.driverId);
    if (driver) {
      await authService.updateProfile(driver.uid, { totalRidesGiven: driver.totalRidesGiven + 1 });
    }
    return ride;
  },

  async addRating(rating: Omit<RatingObj, "ratingId" | "createdAt">): Promise<RatingObj> {
    await delay(250);
    const ratings = readRatings();
    const newRating: RatingObj = {
      ...rating,
      ratingId: `rt_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    ratings.push(newRating);
    writeRatings(ratings);

    // recompute target user's average rating
    const users = await authService.getAllUsers();
    const target = users.find((u) => u.uid === rating.toUserId);
    if (target) {
      const targetRatings = ratings.filter((r) => r.toUserId === rating.toUserId);
      const avg = targetRatings.reduce((sum, r) => sum + r.stars, 0) / targetRatings.length;
      await authService.updateProfile(target.uid, { rating: Math.round(avg * 10) / 10 });
    }
    return newRating;
  },

  async getRatingsForRide(rideId: string): Promise<RatingObj[]> {
    return readRatings().filter((r) => r.rideId === rideId);
  },
};

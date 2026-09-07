// ===========================================
// Shared TypeScript types for College Rapido
// ===========================================

export type Role = "driver" | "passenger" | "both";
export type ActiveMode = "driver" | "passenger";

export interface VehicleDetails {
  type: "Bike" | "Scooter" | "";
  number: string;
  licensePhoto?: string;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  collegeName: string;
  profilePhoto: string;
  idCardPhoto?: string;
  password?: string; // mock-only, never do this in real apps
  role: Role;
  activeMode: ActiveMode;
  rating: number;
  totalRidesGiven: number;
  totalRidesTaken: number;
  isVerified: boolean;
  vehicleDetails?: VehicleDetails;
  createdAt: string;
  notificationsEnabled: boolean;
  profileSetupComplete: boolean;
}

export interface RidePassenger {
  passengerId: string;
  passengerName: string;
  passengerPhoto?: string;
  passengerPhone?: string;
  status: "booked" | "cancelled";
}

export type RideStatus = "active" | "completed" | "cancelled";

export interface Ride {
  rideId: string;
  driverId: string;
  driverName: string;
  driverPhoto: string;
  driverRating: number;
  fromLocation: string;
  toLocation: string;
  date: string; // ISO yyyy-MM-dd
  time: string; // HH:mm
  totalSeats: number;
  availableSeats: number;
  farePerSeat: number;
  status: RideStatus;
  passengers: RidePassenger[];
  note?: string;
  createdAt: string;
}

export interface RatingObj {
  ratingId: string;
  rideId: string;
  fromUserId: string;
  toUserId: string;
  stars: number;
  comment?: string;
  createdAt: string;
}

export type ToastType = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

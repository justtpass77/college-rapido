import { mockUsers } from "../data/mockUsers";
import type { UserProfile } from "../types";
import { USE_FIREBASE } from "./firebaseConfig";

// ===========================================================
// Mock Auth Service — backed by localStorage so refreshes persist.
// Swap the internals of these functions for real Firebase Auth /
// Firestore calls later (the function signatures are designed to
// stay the same).
// ===========================================================

const USERS_KEY = "crapido_users";
const SESSION_KEY = "crapido_current_user_id";

const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms));

const readUsers = (): UserProfile[] => {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) {
    localStorage.setItem(USERS_KEY, JSON.stringify(mockUsers));
    return [...mockUsers];
  }
  try {
    return JSON.parse(raw) as UserProfile[];
  } catch {
    return [...mockUsers];
  }
};

const writeUsers = (users: UserProfile[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const authService = {
  async getAllUsers(): Promise<UserProfile[]> {
    return readUsers();
  },

  async getCurrentUser(): Promise<UserProfile | null> {
    const uid = localStorage.getItem(SESSION_KEY);
    if (!uid) return null;
    const users = readUsers();
    return users.find((u) => u.uid === uid) ?? null;
  },

  async signUp(data: {
    name: string;
    email: string;
    collegeName: string;
    phone: string;
    password: string;
    role: UserProfile["role"];
  }): Promise<{ user?: UserProfile; error?: string }> {
    await delay();
    if (USE_FIREBASE) {
      // TODO: replace with firebase/auth createUserWithEmailAndPassword +
      // Firestore setDoc(users/{uid}, {...}) once ready.
    }
    const users = readUsers();
    if (users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { error: "An account with this email already exists." };
    }
    const newUser: UserProfile = {
      uid: `u_${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      collegeName: data.collegeName,
      profilePhoto: "",
      idCardPhoto: "",
      password: data.password,
      role: data.role,
      activeMode: data.role === "passenger" ? "passenger" : "driver",
      rating: 0,
      totalRidesGiven: 0,
      totalRidesTaken: 0,
      isVerified: false,
      vehicleDetails: data.role !== "passenger" ? { type: "", number: "" } : undefined,
      createdAt: new Date().toISOString(),
      notificationsEnabled: true,
      profileSetupComplete: false,
    };
    users.push(newUser);
    writeUsers(users);
    localStorage.setItem(SESSION_KEY, newUser.uid);
    return { user: newUser };
  },

  async login(email: string, password: string): Promise<{ user?: UserProfile; error?: string }> {
    await delay();
    const users = readUsers();
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found) return { error: "No account found with this email." };
    if (found.password !== password) return { error: "Incorrect password. Try again." };
    localStorage.setItem(SESSION_KEY, found.uid);
    return { user: found };
  },

  async logout(): Promise<void> {
    await delay(150);
    localStorage.removeItem(SESSION_KEY);
  },

  async resetPassword(email: string): Promise<{ success?: boolean; error?: string }> {
    await delay();
    const users = readUsers();
    if (!users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { error: "No account found with this email." };
    }
    return { success: true };
  },

  async updateProfile(uid: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    await delay(250);
    const users = readUsers();
    const idx = users.findIndex((u) => u.uid === uid);
    if (idx === -1) return null;
    users[idx] = { ...users[idx], ...updates };
    writeUsers(users);
    return users[idx];
  },
};

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { ActiveMode, Role, UserProfile } from "../types";
import { authService } from "../services/authService";

interface AuthContextValue {
  user: UserProfile | null;
  loading: boolean;
  signUp: (data: { name: string; email: string; collegeName: string; phone: string; password: string; role: Role }) => Promise<{ success: boolean; error?: string }>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  toggleMode: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService.getCurrentUser().then((u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  const signUp: AuthContextValue["signUp"] = async (data) => {
    const res = await authService.signUp(data);
    if (res.error || !res.user) return { success: false, error: res.error };
    setUser(res.user);
    return { success: true };
  };

  const login: AuthContextValue["login"] = async (email, password) => {
    const res = await authService.login(email, password);
    if (res.error || !res.user) return { success: false, error: res.error };
    setUser(res.user);
    return { success: true };
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = await authService.updateProfile(user.uid, updates);
    if (updated) setUser(updated);
  };

  const toggleMode = async () => {
    if (!user || user.role !== "both") return;
    const next: ActiveMode = user.activeMode === "driver" ? "passenger" : "driver";
    await updateProfile({ activeMode: next });
  };

  const resetPassword = async (email: string) => {
    const res = await authService.resetPassword(email);
    return { success: !!res.success, error: res.error };
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, login, logout, updateProfile, toggleMode, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

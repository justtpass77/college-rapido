import type { ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { RideProvider } from "./context/RideContext";
import { ToastProvider } from "./context/ToastContext";
import Navbar from "./components/layout/Navbar";
import BottomNavigation from "./components/layout/BottomNavigation";
import { LoadingSpinner } from "./components/common/LoadingSpinner";

import Landing from "./pages/Landing";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import ProfileSetup from "./pages/ProfileSetup";
import Home from "./pages/Home";
import PostRide from "./pages/PostRide";
import RideDetails from "./pages/RideDetails";
import MyRides from "./pages/MyRides";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";

function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-lg pb-24 pt-16">
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  );
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner label="Loading College Rapido..." />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (!user.profileSetupComplete) return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
}

function OnboardingRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/onboarding"
        element={
          <OnboardingRoute>
            <ProfileSetup />
          </OnboardingRoute>
        }
      />
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/home" element={<Home />} />
        <Route path="/post-ride" element={<PostRide />} />
        <Route path="/ride/:rideId" element={<RideDetails />} />
        <Route path="/my-rides" element={<MyRides />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/chat/:rideId" element={<Chat />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <RideProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </RideProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

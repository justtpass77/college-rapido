import { Home, ListChecks, PlusCircle, Search, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../utils/cn";

export default function BottomNavigation() {
  const { user } = useAuth();
  const isDriverMode = user?.activeMode === "driver";

  const items = [
    { to: "/home", label: "Home", icon: Home },
    { to: "/my-rides", label: "My Rides", icon: ListChecks },
    isDriverMode
      ? { to: "/post-ride", label: "Post Ride", icon: PlusCircle }
      : { to: "/home", label: "Find Ride", icon: Search },
    { to: "/profile", label: "Profile", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 z-40 w-full border-t border-gray-100 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2">
        {items.map((item, i) => (
          <NavLink
            key={item.label + i}
            to={item.to}
            end={item.to === "/home"}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-0.5 rounded-xl px-4 py-1.5 text-[11px] font-semibold transition-all active:scale-90",
                isActive ? "text-[#1A1A1A]" : "text-gray-400 hover:text-gray-600"
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className={cn("rounded-full p-1.5 transition-colors", isActive && "bg-[#FFC800]")}>
                  <item.icon className="h-5 w-5" />
                </div>
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

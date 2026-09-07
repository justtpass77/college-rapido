import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { initials } from "../../utils/formatters";

export default function Navbar() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 z-40 w-full border-b border-gray-100 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
        <button onClick={() => navigate("/home")} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FFC800] font-black text-[#1A1A1A]">CR</div>
          <span className="text-base font-extrabold tracking-tight text-[#1A1A1A]">College Rapido</span>
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={() => showToast("You're all caught up! No new notifications.", "info")}
            className="relative rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 active:scale-95"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
          </button>
          <button onClick={() => navigate("/profile")} className="active:scale-95">
            {user?.profilePhoto ? (
              <img src={user.profilePhoto} alt={user.name} className="h-8 w-8 rounded-full object-cover ring-2 ring-yellow-300" />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1A1A1A] text-xs font-bold text-white ring-2 ring-yellow-300">
                {user ? initials(user.name) : "?"}
              </div>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

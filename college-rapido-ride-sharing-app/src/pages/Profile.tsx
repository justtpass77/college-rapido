import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Bike, Edit3, LogOut, ShieldCheck, ShieldQuestion, Car, User as UserIcon, Camera } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Button from "../components/common/Button";
import InputField from "../components/common/InputField";
import Modal from "../components/common/Modal";
import StarRating from "../components/common/StarRating";
import Badge from "../components/common/Badge";
import { formatMemberSince, initials } from "../utils/formatters";

export default function Profile() {
  const { user, updateProfile, toggleMode, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");

  if (!user) return null;

  const handleSaveProfile = async () => {
    await updateProfile({ name, phone });
    setEditing(false);
    showToast("Profile updated successfully!", "success");
  };

  const handleToggleMode = async () => {
    await toggleMode();
    showToast(`Switched to ${user.activeMode === "driver" ? "Passenger" : "Driver"} Mode`, "info");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handlePhotoChange = async (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      await updateProfile({ profilePhoto: reader.result as string });
      showToast("Profile photo updated.", "success");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="mx-auto max-w-lg px-4 pt-4 pb-8">
      <div className="flex flex-col items-center rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="relative">
          {user.profilePhoto ? (
            <img src={user.profilePhoto} alt={user.name} className="h-24 w-24 rounded-full border-4 border-yellow-100 object-cover" />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-yellow-100 bg-[#1A1A1A] text-2xl font-bold text-white">
              {initials(user.name)}
            </div>
          )}
          <label className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#FFC800] shadow-md active:scale-90">
            <Camera className="h-4 w-4 text-[#1A1A1A]" />
            <input type="file" accept="image/*" className="hidden" onChange={(e) => handlePhotoChange(e.target.files?.[0])} />
          </label>
        </div>
        <h2 className="mt-3 text-lg font-extrabold text-gray-900">{user.name}</h2>
        <p className="text-sm text-gray-500">{user.collegeName}</p>
        <p className="mt-1 text-xs text-gray-400">Member since {formatMemberSince(user.createdAt)}</p>

        <Badge status={user.isVerified ? "verified" : "pending"} className="mt-3" text={user.isVerified ? "Verified Student" : "Verification Pending"} />

        <Button size="sm" variant="secondary" icon={<Edit3 className="h-3.5 w-3.5" />} className="mt-4" onClick={() => setEditing(true)}>
          Edit Profile
        </Button>
      </div>

      {user.role === "both" && (
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
            {user.activeMode === "driver" ? <Car className="h-4 w-4" /> : <UserIcon className="h-4 w-4" />}
            {user.activeMode === "driver" ? "Driver Mode" : "Passenger Mode"}
          </div>
          <button
            onClick={handleToggleMode}
            className={`relative h-7 w-14 rounded-full transition-colors ${user.activeMode === "driver" ? "bg-[#1A1A1A]" : "bg-[#FFC800]"}`}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                user.activeMode === "driver" ? "translate-x-1" : "translate-x-8"
              }`}
            />
          </button>
        </div>
      )}

      <div className="mt-4 grid grid-cols-3 gap-3">
        <StatCard label="Rides Taken" value={user.totalRidesTaken} />
        <StatCard label="Rides Given" value={user.totalRidesGiven} />
        <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-3 text-center shadow-sm">
          <p className="text-lg font-extrabold text-gray-900">{user.rating ? user.rating.toFixed(1) : "—"}</p>
          <StarRating value={user.rating} readonly size={12} />
          <p className="mt-1 text-[11px] text-gray-400">Avg Rating</p>
        </div>
      </div>

      {(user.role === "driver" || user.role === "both") && (
        <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <p className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-800">
            <Bike className="h-4 w-4" /> Vehicle Details
          </p>
          {user.vehicleDetails?.number ? (
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{user.vehicleDetails.type}</span>
              <span className="font-semibold text-gray-800">{user.vehicleDetails.number}</span>
            </div>
          ) : (
            <p className="text-xs text-gray-400">No vehicle details added yet.</p>
          )}
        </div>
      )}

      <div className="mt-4 flex flex-col gap-2 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <p className="mb-1 text-sm font-bold text-gray-800">Settings</p>
        <div className="flex items-center justify-between py-1.5">
          <span className="flex items-center gap-2 text-sm text-gray-600">
            <Bell className="h-4 w-4" /> Notifications
          </span>
          <button
            onClick={() => updateProfile({ notificationsEnabled: !user.notificationsEnabled })}
            className={`relative h-6 w-11 rounded-full transition-colors ${user.notificationsEnabled ? "bg-[#FFC800]" : "bg-gray-200"}`}
          >
            <span
              className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                user.notificationsEnabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
        <div className="flex items-center justify-between py-1.5 text-sm text-gray-600">
          <span className="flex items-center gap-2">
            {user.isVerified ? <ShieldCheck className="h-4 w-4 text-green-600" /> : <ShieldQuestion className="h-4 w-4 text-yellow-600" />}
            Verification Status
          </span>
          <Badge status={user.isVerified ? "verified" : "pending"} />
        </div>
        <Button variant="danger" size="sm" icon={<LogOut className="h-4 w-4" />} className="mt-2" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <Modal isOpen={editing} onClose={() => setEditing(false)} title="Edit Profile">
        <div className="flex flex-col gap-3">
          <InputField label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
          <InputField label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Button fullWidth onClick={handleSaveProfile}>
            Save Changes
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-3 text-center shadow-sm">
      <p className="text-lg font-extrabold text-gray-900">{value}</p>
      <p className="mt-1 text-[11px] text-gray-400">{label}</p>
    </div>
  );
}

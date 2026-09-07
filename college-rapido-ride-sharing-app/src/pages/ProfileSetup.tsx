import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, IdCard, Bike as BikeIcon, FileText } from "lucide-react";
import Button from "../components/common/Button";
import InputField from "../components/common/InputField";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { isValidVehicleNumber } from "../utils/validators";

const PLACEHOLDER_AVATAR = "https://i.pravatar.cc/150?img=68";

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function ProfileSetup() {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const isDriver = user?.role === "driver" || user?.role === "both";

  const [profilePhoto, setProfilePhoto] = useState("");
  const [idCardPhoto, setIdCardPhoto] = useState("");
  const [vehicleType, setVehicleType] = useState<"Bike" | "Scooter" | "">(user?.vehicleDetails?.type || "Bike");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [licensePhoto, setLicensePhoto] = useState("");
  const [vehicleError, setVehicleError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleFile = async (file: File | undefined, setter: (v: string) => void) => {
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    setter(dataUrl);
  };

  const handleComplete = async () => {
    if (isDriver && !isValidVehicleNumber(vehicleNumber)) {
      setVehicleError("Enter a valid vehicle number");
      return;
    }
    setSubmitting(true);
    await updateProfile({
      profilePhoto: profilePhoto || PLACEHOLDER_AVATAR,
      idCardPhoto: idCardPhoto || "uploaded",
      isVerified: !!idCardPhoto,
      profileSetupComplete: true,
      ...(isDriver
        ? { vehicleDetails: { type: vehicleType, number: vehicleNumber, licensePhoto: licensePhoto || "uploaded" } }
        : {}),
    });
    setSubmitting(false);
    showToast("Profile setup complete. Welcome aboard!", "success");
    navigate("/home");
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col bg-white px-6 py-10">
      <h1 className="text-2xl font-extrabold text-[#1A1A1A]">Set up your profile</h1>
      <p className="mt-1 text-sm text-gray-500">Just a couple of steps before your first ride.</p>

      <div className="mt-6 flex flex-col items-center gap-2">
        <div className="relative">
          <img
            src={profilePhoto || PLACEHOLDER_AVATAR}
            alt="Profile"
            className="h-24 w-24 rounded-full border-4 border-yellow-100 object-cover"
          />
          <label className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#FFC800] shadow-md transition-transform active:scale-90">
            <Camera className="h-4 w-4 text-[#1A1A1A]" />
            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0], setProfilePhoto)} />
          </label>
        </div>
        <p className="text-xs text-gray-400">Upload profile photo (optional)</p>
      </div>

      <div className="mt-6">
        <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
          <IdCard className="h-4 w-4" /> College ID Card
        </label>
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-6 text-center transition-colors hover:border-[#FFC800]">
          {idCardPhoto ? (
            <img src={idCardPhoto} alt="College ID" className="h-24 rounded-lg object-cover" />
          ) : (
            <>
              <FileText className="h-8 w-8 text-gray-400" />
              <span className="text-xs text-gray-500">Tap to upload your College ID (for verification)</span>
            </>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0], setIdCardPhoto)} />
        </label>
      </div>

      {isDriver && (
        <div className="mt-6 space-y-4 rounded-2xl border border-gray-100 bg-gray-50/60 p-4">
          <p className="flex items-center gap-2 text-sm font-bold text-gray-800">
            <BikeIcon className="h-4 w-4" /> Vehicle Details
          </p>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Vehicle Type</label>
            <div className="flex gap-2">
              {(["Bike", "Scooter"] as const).map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setVehicleType(t)}
                  className={`flex-1 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors ${
                    vehicleType === t ? "border-[#FFC800] bg-yellow-50 text-gray-900" : "border-gray-200 bg-white text-gray-500"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <InputField
            label="Vehicle Number"
            placeholder="MH12 AB 3456"
            value={vehicleNumber}
            error={vehicleError}
            onChange={(e) => {
              setVehicleNumber(e.target.value);
              setVehicleError("");
            }}
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Driving License</label>
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 bg-white p-4 text-center text-xs text-gray-500 transition-colors hover:border-[#FFC800]">
              {licensePhoto ? "License uploaded ✓" : "Tap to upload license photo"}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0], setLicensePhoto)} />
            </label>
          </div>
        </div>
      )}

      <Button size="lg" fullWidth className="mt-8" isLoading={submitting} onClick={handleComplete}>
        Complete Setup
      </Button>
    </div>
  );
}

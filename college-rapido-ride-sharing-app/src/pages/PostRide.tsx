import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import PostRideForm, { type PostRideFormValues } from "../components/ride/PostRideForm";
import Modal from "../components/common/Modal";
import Button from "../components/common/Button";
import { useAuth } from "../context/AuthContext";
import { useRides } from "../context/RideContext";

export default function PostRide() {
  const { user } = useAuth();
  const { postRide } = useRides();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!user) return null;

  const handleSubmit = async (values: PostRideFormValues) => {
    setSubmitting(true);
    await postRide({
      driverId: user.uid,
      driverName: user.name,
      driverPhoto: user.profilePhoto,
      driverRating: user.rating || 4.5,
      fromLocation: values.fromLocation,
      toLocation: values.toLocation,
      date: values.date,
      time: values.time,
      totalSeats: Number(values.totalSeats),
      farePerSeat: Number(values.farePerSeat),
      note: values.note,
    });
    setSubmitting(false);
    setShowSuccess(true);
  };

  return (
    <div className="mx-auto max-w-lg px-4 pt-4 pb-8">
      <h1 className="mb-1 text-xl font-extrabold text-[#1A1A1A]">Post a New Ride</h1>
      <p className="mb-5 text-sm text-gray-500">Fill in your trip details so passengers nearby can find and book you.</p>

      <PostRideForm onSubmit={handleSubmit} isSubmitting={submitting} />

      <Modal isOpen={showSuccess} onClose={() => navigate("/home")} title="">
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-9 w-9 text-green-600" />
          </div>
          <h3 className="text-lg font-extrabold text-gray-900">Ride Posted Successfully!</h3>
          <p className="text-sm text-gray-500">Your ride is now visible to passengers on campus. Good luck!</p>
          <Button fullWidth onClick={() => navigate("/home")} className="mt-2">
            Back to Home
          </Button>
        </div>
      </Modal>
    </div>
  );
}

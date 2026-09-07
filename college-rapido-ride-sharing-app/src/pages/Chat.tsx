import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Send, PhoneCall } from "lucide-react";
import { useRides } from "../context/RideContext";
import { useAuth } from "../context/AuthContext";
import EmptyState from "../components/common/EmptyState";
import { MapPin } from "lucide-react";

interface Message {
  id: string;
  sender: "me" | "them";
  text: string;
  time: string;
}

export default function Chat() {
  const { rideId } = useParams();
  const { rides } = useRides();
  const { user } = useAuth();
  const navigate = useNavigate();

  const ride = rides.find((r) => r.rideId === rideId);
  const otherName = ride && user ? (ride.driverId === user.uid ? ride.passengers[0]?.passengerName ?? "Passenger" : ride.driverName) : "Rider";

  const [messages, setMessages] = useState<Message[]>([
    { id: "m1", sender: "them", text: `Hi! This is ${otherName}, see you at the pickup point 👋`, time: "9:00 AM" },
    { id: "m2", sender: "me", text: "Sounds good, I'll be there on time!", time: "9:02 AM" },
    { id: "m3", sender: "them", text: "Great, I'm on a black scooter. Will wait 5 mins at gate.", time: "9:03 AM" },
  ]);
  const [text, setText] = useState("");

  if (!ride) {
    return (
      <div className="px-4 pt-6">
        <EmptyState icon={<MapPin className="h-7 w-7" />} title="Chat not available" message="This ride could not be found." actionLabel="Go Home" onAction={() => navigate("/home")} />
      </div>
    );
  }

  const handleSend = () => {
    if (!text.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: `m_${Date.now()}`, sender: "me", text: text.trim(), time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) },
    ]);
    setText("");
    // Mock auto-reply so the chat feels alive during a demo.
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: `m_${Date.now() + 1}`, sender: "them", text: "Got it 👍", time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) },
      ]);
    }, 1200);
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-0px)] max-w-lg flex-col">
      <div className="flex items-center gap-3 border-b border-gray-100 bg-white px-4 py-3">
        <button onClick={() => navigate(-1)} className="text-gray-500">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <p className="text-sm font-bold text-gray-900">{otherName}</p>
          <p className="text-xs text-gray-400">
            {ride.fromLocation} → {ride.toLocation}
          </p>
        </div>
        <a href="tel:+919999999999" className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700">
          <PhoneCall className="h-4 w-4" />
        </a>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50 px-4 py-4">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.sender === "me" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm shadow-sm ${
                m.sender === "me" ? "rounded-br-sm bg-[#FFC800] text-[#1A1A1A]" : "rounded-bl-sm bg-white text-gray-800"
              }`}
            >
              <p>{m.text}</p>
              <p className={`mt-1 text-[10px] ${m.sender === "me" ? "text-gray-700/70" : "text-gray-400"}`}>{m.time}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 border-t border-gray-100 bg-white px-3 py-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          className="flex-1 rounded-full border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#FFC800] focus:ring-2 focus:ring-yellow-200"
        />
        <button
          onClick={handleSend}
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#FFC800] text-[#1A1A1A] transition-transform active:scale-90"
        >
          <Send className="h-4.5 w-4.5" />
        </button>
      </div>
    </div>
  );
}

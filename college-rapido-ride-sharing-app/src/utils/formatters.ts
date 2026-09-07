import { format, parseISO, isToday, isTomorrow } from "date-fns";

export const formatCurrency = (amount: number) => `₹${Math.round(amount)}`;

export const formatDateLabel = (isoDateStr: string) => {
  try {
    const d = parseISO(isoDateStr);
    if (isToday(d)) return "Today";
    if (isTomorrow(d)) return "Tomorrow";
    return format(d, "d MMM yyyy");
  } catch {
    return isoDateStr;
  }
};

export const formatTimeLabel = (time24: string) => {
  try {
    const [h, m] = time24.split(":").map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return format(d, "h:mm a");
  } catch {
    return time24;
  }
};

export const formatMemberSince = (isoStr: string) => {
  try {
    return format(parseISO(isoStr), "MMMM yyyy");
  } catch {
    return isoStr;
  }
};

// Very simple placeholder "distance based" fare suggestion — in a real app
// this would call a maps/directions API. Here we hash the two location
// strings into a pseudo-distance between 1 and 12 km.
export const suggestFare = (from: string, to: string) => {
  const text = `${from}`.trim().toLowerCase() + `${to}`.trim().toLowerCase();
  if (!text) return 20;
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 31 + text.charCodeAt(i)) % 1000;
  }
  const pseudoKm = 1 + (hash % 11); // 1 - 11 km
  const fare = 10 + pseudoKm * 4; // base ₹10 + ₹4/km
  return Math.round(fare / 5) * 5; // round to nearest 5
};

export const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");

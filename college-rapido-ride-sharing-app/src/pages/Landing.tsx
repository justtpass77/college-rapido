import { useNavigate } from "react-router-dom";
import { ShieldCheck, Wallet, GraduationCap, Bike } from "lucide-react";
import Button from "../components/common/Button";

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    { icon: ShieldCheck, title: "Safe & Verified", desc: "Only verified college students can ride or drive." },
    { icon: Wallet, title: "Affordable", desc: "Split fares that are lighter on a student budget." },
    { icon: GraduationCap, title: "By Your Campus", desc: "Made exclusively for your college community." },
  ];

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col bg-white px-6 pb-10 pt-12">
      <div className="flex flex-1 flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#FFC800] shadow-lg shadow-yellow-200">
          <Bike className="h-9 w-9 text-[#1A1A1A]" />
        </div>
        <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-[#1A1A1A]">College Rapido</h1>
        <p className="mt-2 text-sm font-medium text-gray-500">Rides by Students, for Students</p>

        <div className="relative mt-8 flex h-56 w-full items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-yellow-100 via-yellow-50 to-white">
          <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-yellow-200/60" />
          <div className="absolute -right-8 bottom-0 h-32 w-32 rounded-full bg-yellow-200/50" />
          <div className="relative flex flex-col items-center gap-2">
            <Bike className="h-24 w-24 text-[#1A1A1A]" strokeWidth={1.5} />
            <p className="text-xs font-semibold text-gray-500">Quick campus commutes, sorted 🎓</p>
          </div>
        </div>

        <div className="mt-8 flex w-full flex-col gap-3">
          <Button size="lg" fullWidth onClick={() => navigate("/login")}>
            Login
          </Button>
          <Button size="lg" fullWidth variant="secondary" onClick={() => navigate("/signup")}>
            Sign Up
          </Button>
        </div>

        <div className="mt-10 grid w-full grid-cols-1 gap-3">
          {features.map((f) => (
            <div key={f.title} className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 text-left shadow-sm">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#1A1A1A]">
                <f.icon className="h-5 w-5 text-[#FFC800]" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{f.title}</p>
                <p className="text-xs text-gray-500">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

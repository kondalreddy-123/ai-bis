import { NavLink } from "react-router-dom";
import { Search, ShieldCheck, FileSearch, GitCompare, Settings, Home, Languages, BarChart3, Lightbulb, ClipboardCheck } from "lucide-react";

const links = [
  ["/", "Home", Home],
  ["/search", "Standards Search", Search],
  ["/analysis", "Product Analysis", FileSearch],
  ["/tender", "Tender Analysis", FileSearch],
  ["/explorer", "Standards Explorer", ShieldCheck],
  ["/comparison", "Product Comparison", GitCompare],
  ["/recommend", "Product Recommendation", Lightbulb],
  ["/safety", "Safety & Compliance", ClipboardCheck],
  ["/dashboard", "Dashboard", BarChart3],
  ["/settings", "Settings", Settings],
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <NavLink to="/" className="focus-ring flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#0f3d62] text-xl font-black text-white">IS</div>
            <div>
              <div className="text-lg font-black text-[#0f3d62]">AI BIS SENSOR</div>
              <div className="text-xs font-semibold text-slate-500">Standards Intelligence</div>
            </div>
          </NavLink>
          <div className="hidden items-center gap-2 md:flex">
            <Languages size={18} />
            <select aria-label="Language" className="rounded-lg border px-3 py-2 text-sm">
              <option>English</option><option>हिन्दी</option><option>తెలుగు</option><option>தமிழ்</option>
              <option>ಕನ್ನಡ</option><option>मराठी</option><option>বাংলা</option><option>ગુજરાતી</option>
              <option>ਪੰਜਾਬੀ</option><option>മലയാളം</option><option>ଓଡ଼ିଆ</option><option>অসমীয়া</option><option>اردو</option>
            </select>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl">
        <aside className="hidden w-64 shrink-0 border-r bg-white p-3 lg:block">
          <nav aria-label="Main navigation" className="sticky top-20 space-y-1">
            {links.map(([to, label, Icon]: any) => (
              <NavLink key={to} to={to} className={({isActive}) =>
                `focus-ring flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold ${isActive ? "bg-blue-50 text-[#0f3d62]" : "text-slate-600 hover:bg-slate-50"}`
              }>
                <Icon size={18}/><span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="min-w-0 flex-1 p-4 md:p-7">{children}</main>
      </div>
    </div>
  );
}

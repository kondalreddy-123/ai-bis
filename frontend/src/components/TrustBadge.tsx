export default function TrustBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    OFFICIAL: "bg-green-100 text-green-800",
    VERIFIED: "bg-emerald-100 text-emerald-800",
    THIRD_PARTY: "bg-purple-100 text-purple-800",
    AI_DERIVED: "bg-blue-100 text-blue-800",
    UNVERIFIED: "bg-amber-100 text-amber-800",
    DEMO_ONLY: "bg-orange-100 text-orange-800",
    SYNTHETIC_DEMO: "bg-orange-100 text-orange-800"
  };
  return <span className={`badge ${map[status] || "bg-slate-100 text-slate-700"}`}>{status}</span>;
}

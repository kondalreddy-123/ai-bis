import { Link } from "react-router-dom";
import TrustBadge from "./TrustBadge";
import type { Standard } from "../types";

export default function StandardCard({ standard }: { standard: Standard }) {
  return (
    <div className="card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="font-black text-[#0f3d62]">{standard.is_number}</div>
        <TrustBadge status={standard.verification_status} />
      </div>
      <h3 className="mt-3 text-lg font-extrabold">{standard.title}</h3>
      <p className="mt-2 text-slate-600">{standard.scope}</p>
      <div className="mt-4 grid gap-2 text-sm md:grid-cols-3">
        <div><b>Domain:</b> {standard.domain}</div>
        <div><b>Status:</b> {standard.status}</div>
        <div><b>AI Recommendation Confidence:</b> {standard.ai_confidence ?? "—"}%</div>
      </div>
      <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm">
        <b>Evidence:</b> {standard.evidence}
      </div>
      <Link className="mt-4 inline-block font-bold text-blue-700 hover:underline" to={`/standard/${standard.id}`}>View clear details →</Link>
    </div>
  );
}

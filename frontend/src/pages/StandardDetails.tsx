import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../lib/api";
import TrustBadge from "../components/TrustBadge";
import TrustNotice from "../components/TrustNotice";

export default function StandardDetails() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  useEffect(()=>{ if(id) api.standard(Number(id)).then(setData).catch(e=>alert(e.message)); },[id]);
  if(!data) return <div className="p-6">Loading…</div>;
  const s=data.standard;
  return <div className="space-y-6">
    <TrustNotice/>
    <div className="card p-6">
      <div className="flex flex-wrap justify-between gap-3"><div className="text-xl font-black text-[#0f3d62]">{s.is_number}</div><TrustBadge status={s.verification_status}/></div>
      <h1 className="mt-4 text-3xl font-black">{s.title}</h1>
      <p className="body-lg mt-3 text-slate-600">{s.scope}</p>
    </div>
    <div className="grid gap-5 md:grid-cols-2">
      {[
        ["What this record covers", s.abstract],
        ["Status", s.status],
        ["Edition / year", s.edition || "Not verified"],
        ["Domain", s.domain],
        ["Product category", s.product_category],
        ["Source", s.source_name]
      ].map(([a,b])=><div className="card p-5" key={a as string}><div className="font-extrabold text-slate-500">{a}</div><div className="mt-2 text-lg">{b}</div></div>)}
    </div>
    <div className="card p-6"><h2 className="section-title">Why this standard matters</h2><p className="body-lg mt-3 text-slate-600">It matters only if the authoritative scope and procurement context match. This demo record must be replaced by verified BIS evidence before a procurement decision is made.</p></div>
    <div className="card p-6"><h2 className="section-title">Evidence</h2><p className="mt-3">{s.evidence}</p></div>
  </div>
}

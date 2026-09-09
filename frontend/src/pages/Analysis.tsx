import { useEffect, useState } from "react";
import { api } from "../lib/api";
import MissingQuestions from "../components/MissingQuestions";
import StandardCard from "../components/StandardCard";
import TrustBadge from "../components/TrustBadge";

export default function Analysis() {
  const [text, setText] = useState("Need standards for outdoor LED street lights for a government tender.");
  const [data, setData] = useState<any>(() => JSON.parse(sessionStorage.getItem("analysis") || "null"));
  const [explain, setExplain] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (!data) run(); }, []);

  async function run() {
    setBusy(true);
    try { const d = await api.analyze(text); setData(d); sessionStorage.setItem("analysis", JSON.stringify(d)); }
    catch(e:any) { alert(e.message); } finally { setBusy(false); }
  }

  async function explainRequirement(r: string) {
    const d = await api.explain(r);
    setExplain(d.text);
  }

  return <div className="space-y-6">
    <div><h1 className="text-3xl font-black">Product / Specification Analysis</h1><p className="body-lg mt-2 text-slate-600">We separate what was detected from what still needs to be supplied. The system does not silently fill gaps.</p></div>
    <div className="card p-5">
      <textarea value={text} onChange={e=>setText(e.target.value)} className="min-h-32 w-full rounded-xl border p-3"/>
      <button onClick={run} disabled={busy} className="mt-3 rounded-xl bg-[#0f3d62] px-5 py-3 font-extrabold text-white">{busy ? "Analyzing…" : "Analyze"}</button>
    </div>
    {data && <>
      <div className="card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="section-title">AI Requirement Summary</h2><TrustBadge status="AI_DERIVED"/></div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {data.requirements?.map((r:any)=><div key={r.name} className="rounded-xl bg-green-50 p-4"><b>✓ {r.name}</b><div>{r.value}</div></div>)}
        </div>
      </div>
      <MissingQuestions items={data.missing_information || []} />
      <div className="card p-5">
        <h2 className="section-title">Compliance at a glance</h2>
        <div className="mt-4 flex items-end gap-4"><div className="text-5xl font-black text-[#0f3d62]">{data.compliance?.known ?? "—"}%</div><div className="pb-1 font-bold">{data.compliance?.status}</div></div>
        <p className="mt-2 text-sm text-slate-500">This is an AI-assisted analysis indicator, not an official BIS certification or compliance certificate.</p>
      </div>
      <div>
        <h2 className="section-title mb-4">Applicable / related standards</h2>
        <div className="space-y-4">{data.standards?.map((s:any)=><StandardCard key={s.id} standard={s}/>)}</div>
      </div>
      <div className="card p-5">
        <h2 className="section-title">Simple explanations</h2>
        <p className="mt-2 text-slate-600">Select a requirement to see an easy-language explanation based on available evidence.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {["IP65","Energy efficiency","Colour temperature"].map(x=><button key={x} onClick={()=>explainRequirement(x)} className="rounded-xl border px-4 py-2 font-bold">{x}</button>)}
        </div>
        {explain && <div className="mt-4 rounded-xl bg-blue-50 p-4 leading-7"><b>AI analysis:</b> {explain}</div>}
      </div>
    </>}
  </div>
}

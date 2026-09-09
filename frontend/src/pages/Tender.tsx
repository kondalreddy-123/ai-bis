import { useState } from "react";
import { uploadTender } from "../lib/api";
import MissingQuestions from "../components/MissingQuestions";
import TrustNotice from "../components/TrustNotice";

export default function Tender() {
  const [file, setFile] = useState<File|null>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  async function run() {
    if (!file) return;
    setLoading(true);
    try { setData(await uploadTender(file)); } catch(e:any) { alert(e.message); } finally { setLoading(false); }
  }
  return <div className="space-y-6">
    <TrustNotice />
    <div><h1 className="text-3xl font-black">Tender Analysis</h1><p className="body-lg mt-2 text-slate-600">Upload a PDF, DOCX or TXT tender. This section extracts requirements and flags standards references or information that need verification.</p></div>
    <div className="card p-6">
      <input type="file" accept=".pdf,.docx,.txt" onChange={e=>setFile(e.target.files?.[0] || null)} aria-label="Upload tender document"/>
      <button onClick={run} disabled={!file || loading} className="ml-3 rounded-xl bg-[#0f3d62] px-5 py-3 font-extrabold text-white">{loading ? "Analyzing…" : "Analyze tender"}</button>
    </div>
    {data && <div className="space-y-5">
      <div className="card p-5"><h2 className="section-title">Tender Standards Review</h2><p className="mt-2 text-slate-600">Source: {data.source_file}</p></div>
      <MissingQuestions items={data.missing_information || []}/>
      <div className="card p-5"><h2 className="section-title">Detected requirements</h2>{data.requirements?.map((x:any)=><div key={x.name} className="mt-2 rounded-lg bg-slate-50 p-3"><b>{x.name}</b>: {x.value}</div>)}</div>
      <div className="card p-5"><h2 className="section-title">Standards suggestions</h2>{data.standards?.map((s:any)=><div key={s.id} className="mt-3 rounded-xl border p-4"><b>{s.is_number}</b> — {s.title}<div className="mt-1 text-sm text-slate-600">{s.evidence}</div></div>)}</div>
    </div>}
  </div>
}

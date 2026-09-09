import { useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { api } from "../lib/api";
import StandardCard from "../components/StandardCard";
import TrustNotice from "../components/TrustNotice";

export default function SearchPage() {
  const [q, setQ] = useState("LED street light");
  const [domain, setDomain] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function search() {
    setLoading(true);
    try { setResults((await api.search(q, domain || undefined)).results); }
    catch (e: any) { alert(e.message); } finally { setLoading(false); }
  }

  return <div className="space-y-6">
    <TrustNotice />
    <div>
      <h1 className="text-3xl font-black">Standards Search</h1>
      <p className="body-lg mt-2 text-slate-600">This is a dedicated search page. Ask in normal language; the production engine can combine semantic, keyword and evidence-based retrieval.</p>
    </div>
    <div className="card p-5">
      <label className="font-bold">What do you need a standard for?</label>
      <textarea value={q} onChange={e => setQ(e.target.value)} className="mt-2 min-h-28 w-full rounded-xl border p-3"/>
      <div className="mt-3 flex flex-wrap gap-2">
        {["Lighting & Electrical","Electrical Safety","Lighting & Testing","Water & Pumps","Cables & Wiring","Construction","Medical Devices","Food & Agriculture","Automotive","Textiles","IT & Electronics","Mechanical","Environment","Energy","Fire & Safety"].map(d =>
          <button key={d} onClick={() => setDomain(d)} className={`rounded-full border px-3 py-2 text-sm font-bold ${domain===d ? "bg-blue-50 border-blue-500 text-blue-800" : "bg-white"}`}>{d}</button>
        )}
      </div>
      <button onClick={search} disabled={loading} className="mt-4 rounded-xl bg-[#0f3d62] px-5 py-3 font-extrabold text-white">
        <SearchIcon className="mr-2 inline" size={18}/>{loading ? "Searching…" : "Search standards"}
      </button>
    </div>
    <div className="space-y-4">{results.map(s => <StandardCard key={s.id} standard={s}/>)}</div>
  </div>
}

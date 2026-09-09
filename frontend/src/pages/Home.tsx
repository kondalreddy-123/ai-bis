import { Link, useNavigate } from "react-router-dom";
import { Mic, Search, Upload, ShieldCheck, GitCompare, ArrowRight } from "lucide-react";
import { useState } from "react";
import { api } from "../lib/api";
import TrustNotice from "../components/TrustNotice";

export default function Home() {
  const [query, setQuery] = useState("Need standards for outdoor LED street lights for a government tender.");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function run() {
    setLoading(true);
    try {
      const data = await api.analyze(query);
      sessionStorage.setItem("analysis", JSON.stringify(data));
      navigate("/analysis");
    } catch (e: any) { alert(e.message); } finally { setLoading(false); }
  }

  function voice() {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return alert("Speech recognition is not supported by this browser.");
    const r = new SR();
    r.lang = "en-IN";
    r.onresult = (e: any) => setQuery(e.results[0][0].transcript);
    r.start();
  }

  return (
    <div className="space-y-7">
      <TrustNotice />
      <section className="rounded-3xl bg-[#0f3d62] p-7 text-white md:p-10">
        <div className="max-w-4xl">
          <div className="mb-3 text-sm font-extrabold uppercase tracking-widest text-blue-200">AI Standards Intelligence + Procurement Assistant</div>
          <h1 className="text-3xl font-black leading-tight md:text-5xl">Turn a procurement requirement into understandable standards evidence.</h1>
          <p className="body-lg mt-5 text-blue-50">Describe a product, upload a tender, or speak a requirement. AI BIS SENSOR extracts requirements, searches standards evidence, flags missing information, and explains the result without pretending to be BIS.</p>
        </div>
        <div className="mt-8 rounded-2xl bg-white p-3 text-slate-900">
          <textarea aria-label="Product or procurement requirement" value={query} onChange={e => setQuery(e.target.value)}
            className="min-h-32 w-full resize-y rounded-xl border-0 p-3 text-base outline-none" />
          <div className="flex flex-wrap gap-2 border-t pt-3">
            <button onClick={run} disabled={loading} className="focus-ring rounded-xl bg-[#0f3d62] px-5 py-3 font-extrabold text-white disabled:opacity-50">
              <Search className="mr-2 inline" size={18}/>{loading ? "Analyzing…" : "Analyze requirements"}
            </button>
            <button onClick={voice} className="focus-ring rounded-xl border px-5 py-3 font-extrabold"><Mic className="mr-2 inline" size={18}/>Voice</button>
            <Link to="/tender" className="focus-ring rounded-xl border px-5 py-3 font-extrabold"><Upload className="mr-2 inline" size={18}/>Upload tender</Link>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["Standards Search", "Search standards on a dedicated page with simple results and evidence.", "/search", Search],
          ["Safety & Buying", "Understand what to verify before purchase or tender submission.", "/safety", ShieldCheck],
          ["Compare Products", "Compare suitability, safety, quality level and evidence side-by-side.", "/comparison", GitCompare]
        ].map(([title, text, to, Icon]: any) => (
          <Link key={to} to={to} className="card focus-ring p-5 hover:-translate-y-0.5">
            <Icon className="text-[#0f3d62]" />
            <h2 className="mt-4 text-xl font-extrabold">{title}</h2>
            <p className="mt-2 text-slate-600">{text}</p>
            <div className="mt-4 font-bold text-blue-700">Open section <ArrowRight className="inline" size={16}/></div>
          </Link>
        ))}
      </div>

      <div className="card p-6">
        <h2 className="section-title">How the system makes a recommendation</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-5">
          {["Your requirement", "AI extracts facts", "Evidence retrieval", "Compliance analysis", "Decision support"].map((x, i) =>
            <div key={x} className="rounded-xl bg-slate-50 p-4 text-center font-bold"><div className="text-2xl font-black text-[#0f3d62]">{i+1}</div>{x}</div>
          )}
        </div>
      </div>

      <div className="rounded-2xl bg-slate-900 p-5 text-sm leading-6 text-slate-200">
        <b>Responsible AI:</b> AI BIS SENSOR provides AI-assisted recommendations and decision support. It does not replace official BIS publications, laws, regulations, certification authorities, procurement rules, or professional technical judgment. Always verify critical requirements against authoritative sources before procurement.
      </div>
    </div>
  );
}

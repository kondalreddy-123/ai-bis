import { useState } from "react";
import { api } from "../lib/api";
import TrustNotice from "../components/TrustNotice";
import TrustBadge from "../components/TrustBadge";

export default function Recommendation() {
  const [form,setForm]=useState<any>({budget_max:"",environment:"Outdoor",quality_level:"Level 2",safety_priority:"High",technical_requirements:{min_power:100,ip_rating:"IP65"}});
  const [products,setProducts]=useState<any[]>([]);
  async function run(){const d=await api.recommend({...form,budget_max:form.budget_max?Number(form.budget_max):null});setProducts(d.products)}
  return <div className="space-y-6"><TrustNotice/><div><h1 className="text-3xl font-black">Personalized Product Recommendation</h1><p className="body-lg mt-2 text-slate-600">Tell us what matters. The system compares the available evidence and explains why a product is recommended. Unknown information is not treated as a pass.</p></div>
    <div className="card grid gap-4 p-6 md:grid-cols-2">
      <label className="font-bold">Budget maximum<input className="mt-1 w-full rounded-xl border p-3" type="number" value={form.budget_max} onChange={e=>setForm({...form,budget_max:e.target.value})} placeholder="Leave blank if unknown"/></label>
      <label className="font-bold">Environment<select className="mt-1 w-full rounded-xl border p-3" value={form.environment} onChange={e=>setForm({...form,environment:e.target.value})}><option>Outdoor</option><option>Indoor</option><option>Industrial</option><option>Coastal</option></select></label>
      <label className="font-bold">Minimum power<select className="mt-1 w-full rounded-xl border p-3" value={form.technical_requirements.min_power} onChange={e=>setForm({...form,technical_requirements:{...form.technical_requirements,min_power:Number(e.target.value)}})}><option value="60">60 W</option><option value="90">90 W</option><option value="100">100 W</option><option value="120">120 W</option></select></label>
      <label className="font-bold">Required IP rating<select className="mt-1 w-full rounded-xl border p-3" value={form.technical_requirements.ip_rating} onChange={e=>setForm({...form,technical_requirements:{...form.technical_requirements,ip_rating:e.target.value}})}><option>IP44</option><option>IP54</option><option>IP65</option><option>IP66</option></select></label>
      <label className="font-bold">Preferred quality<select className="mt-1 w-full rounded-xl border p-3" value={form.quality_level} onChange={e=>setForm({...form,quality_level:e.target.value})}><option>Level 1</option><option>Level 2</option><option>Level 3</option></select></label>
      <button onClick={run} className="rounded-xl bg-[#0f3d62] px-5 py-3 font-extrabold text-white md:self-end">Generate recommendation</button>
    </div>
    <div className="space-y-4">{products.map((p,i)=><div className="card p-5" key={p.id}><div className="flex flex-wrap justify-between gap-3"><div><div className="text-xs font-extrabold uppercase text-slate-500">Rank {i+1}</div><h2 className="text-xl font-black">{p.name}</h2></div><div className="text-right"><div className="text-3xl font-black text-[#0f3d62]">{p.score}/100</div><TrustBadge status="AI_DERIVED"/></div></div><div className="mt-4 grid gap-3 md:grid-cols-4"><div><b>Quality</b><div>{p.quality}</div></div><div><b>Quality level</b><div>{p.quality_level}</div></div><div><b>Power</b><div>{p.technical_specs.power_w} W</div></div><div><b>IP</b><div>{p.technical_specs.ip_rating || "Not provided"}</div></div></div><div className="mt-4 rounded-xl bg-blue-50 p-4"><b>Recommended because:</b> the score reflects the selected technical requirements and the evidence available in this demo dataset. It is not an official BIS score.</div></div>)}</div>
  </div>
}

import { useEffect, useState } from "react";
import { api } from "../lib/api";
import TrustNotice from "../components/TrustNotice";

const ids=[101,102,103];

export default function Comparison() {
  const [products,setProducts]=useState<any[]>([]);
  const [selected,setSelected]=useState(ids);
  useEffect(()=>{Promise.all(ids.map(id=>api.product(id))).then(x=>setProducts(x.map(v=>v.product))).catch(e=>alert(e.message))},[]);
  const shown=products.filter(p=>selected.includes(p.id));
  return <div className="space-y-6"><TrustNotice/><div><h1 className="text-3xl font-black">Product Comparison</h1><p className="body-lg mt-2 text-slate-600">Compare only information that the system actually has. Missing data appears as “Not provided” rather than a guessed value.</p></div>
    <div className="flex flex-wrap gap-2">{products.map(p=><label key={p.id} className="rounded-xl border bg-white px-4 py-3"><input type="checkbox" checked={selected.includes(p.id)} onChange={()=>setSelected(selected.includes(p.id)?selected.filter(x=>x!==p.id):[...selected,p.id])}/> <b className="ml-2">{p.name}</b></label>)}</div>
    <div className="card overflow-x-auto p-4"><table className="w-full min-w-[700px] border-collapse text-left"><thead><tr><th className="border-b p-3">Feature</th>{shown.map(p=><th className="border-b p-3" key={p.id}>{p.name}</th>)}</tr></thead><tbody>
      {[
        ["Power",p=>`${p.technical_specs.power_w ?? "Not provided"} W`],
        ["IP rating",p=>p.technical_specs.ip_rating ?? "Not provided"],
        ["Efficacy",p=>`${p.technical_specs.efficacy_lm_w ?? "Not provided"} lm/W`],
        ["Certification",p=>p.certifications?.length?p.certifications.join(", "):"Not provided"],
        ["Price",p=>p.price==null?"Price information unavailable":`₹${p.price}`],
        ["Reviews",p=>p.rating==null?"Third-party review data unavailable":`${p.rating} (${p.review_count})`],
        ["Data status",p=>p.data_status]
      ].map(([label,fn]:any)=><tr key={label}><td className="border-b p-3 font-bold">{label}</td>{shown.map(p=><td className="border-b p-3" key={p.id}>{fn(p)}</td>)}</tr>)}
    </tbody></table></div>
  </div>
}

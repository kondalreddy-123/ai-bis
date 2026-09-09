import { useState } from "react";
import { api } from "../lib/api";
import SectionIntro from "../components/SectionIntro";
import TrustNotice from "../components/TrustNotice";

export default function Safety() {
  const [text,setText]=useState("Outdoor LED street light for a government tender, minimum 100W.");
  const [data,setData]=useState<any>(null);
  async function run(){setData(await api.safety(text))}
  return <div className="space-y-6"><TrustNotice/><SectionIntro title="Safety & Compliance" text="This section is a practical checklist of what you should verify before buying, installing or approving a product. It is not a legal certificate. The checklist is generated from the requirements you provide and the standards evidence available to the system."/>
    <div className="card p-5"><label className="font-bold">What are you buying or specifying?<textarea className="mt-2 min-h-28 w-full rounded-xl border p-3" value={text} onChange={e=>setText(e.target.value)}/></label><button onClick={run} className="mt-3 rounded-xl bg-[#0f3d62] px-5 py-3 font-extrabold text-white">Generate safety checklist</button></div>
    {data && <div className="grid gap-4 md:grid-cols-2">{data.checklist.map((x:any)=><div className="card p-5" key={x.item}><div className="text-lg font-extrabold">⚠ {x.item}</div><p className="mt-2 text-slate-600">Verify this requirement using the authoritative product/standard evidence before approval.</p></div>)}</div>}
    <SectionIntro title="Buying Checklist" text="Use this before purchase or tender evaluation. It helps you remember the important evidence to check: applicable IS standard, certification evidence, technical specifications, safety claims, installation requirements, warranty, seller/source information and important product claims."/>
    <div className="card p-5">{["Applicable IS standard checked","Certification evidence verified","Technical specifications complete","Safety requirements checked","Installation requirements understood","Warranty and maintenance terms checked","Price/source recorded","Seller information verified","Important claims supported by evidence"].map(x=><div key={x} className="flex gap-3 border-b py-3 last:border-0"><span>□</span><span className="font-semibold">{x}</span></div>)}</div>
  </div>
}

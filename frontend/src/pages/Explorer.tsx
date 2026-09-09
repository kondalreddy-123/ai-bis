import { Link } from "react-router-dom";
import TrustNotice from "../components/TrustNotice";

const domains = ["Lighting & Electrical","Electrical Safety","Lighting & Testing","Water & Pumps","Cables & Wiring","Construction","Medical Devices","Food & Agriculture","Automotive","Textiles","IT & Electronics","Mechanical","Environment","Energy","Fire & Safety"];

export default function Explorer() {
  return <div className="space-y-6"><TrustNotice/><div><h1 className="text-3xl font-black">Standards Explorer</h1><p className="body-lg mt-2 text-slate-600">Start broad by domain, then open a standard to see its scope, status, evidence and AI interpretation.</p></div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{domains.map(d=><Link key={d} to={`/search?domain=${encodeURIComponent(d)}`} className="card p-5 hover:border-blue-400"><div className="text-lg font-extrabold">{d}</div><p className="mt-2 text-sm text-slate-600">Explore applicable records →</p></Link>)}</div>
  </div>
}

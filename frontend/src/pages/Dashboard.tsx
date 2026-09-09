import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import TrustNotice from "../components/TrustNotice";

export default function Dashboard() {
  const data=[{name:"Standards",value:3},{name:"Requirements",value:5},{name:"Safety checks",value:5},{name:"Products",value:3}];
  return <div className="space-y-6"><TrustNotice/><div><h1 className="text-3xl font-black">Unified Dashboard</h1><p className="body-lg mt-2 text-slate-600">A single view of the current demo analysis: product → requirements → standards → evidence → compliance → recommendation.</p></div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[["Product","Outdoor LED Street Light"],["Compliance","Needs Verification"],["Quality level","Level 2"],["Evidence","Demo / Unverified"]].map(([a,b])=><div className="card p-5" key={a}><div className="text-sm font-bold text-slate-500">{a}</div><div className="mt-2 text-xl font-black">{b}</div></div>)}</div>
    <div className="card p-6"><h2 className="section-title">Analysis coverage</h2><div className="mt-5 h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={data}><XAxis dataKey="name"/><YAxis allowDecimals={false}/><Tooltip/><Bar dataKey="value" /></BarChart></ResponsiveContainer></div></div>
  </div>
}

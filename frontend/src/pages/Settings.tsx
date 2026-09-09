import SectionIntro from "../components/SectionIntro";

export default function Settings() {
  return <div className="space-y-6"><SectionIntro title="Settings" text="Choose how the application should communicate results. Official standard identifiers remain unchanged across languages. In a production deployment, user preferences can be stored in PostgreSQL and applied to recommendations."/>
    <div className="card grid gap-5 p-6 md:grid-cols-2">
      <label className="font-bold">Preferred language<select className="mt-2 w-full rounded-xl border p-3"><option>English</option><option>Hindi</option><option>Telugu</option><option>Tamil</option><option>Kannada</option><option>Marathi</option><option>Bengali</option><option>Gujarati</option><option>Punjabi</option><option>Malayalam</option><option>Odia</option><option>Assamese</option><option>Urdu</option></select></label>
      <label className="font-bold">Default quality level<select className="mt-2 w-full rounded-xl border p-3"><option>Level 1 — Basic</option><option>Level 2 — Good</option><option>Level 3 — Advanced</option></select></label>
      <label className="font-bold">Safety priority<select className="mt-2 w-full rounded-xl border p-3"><option>High</option><option>Medium</option><option>Low</option></select></label>
      <label className="font-bold">Evidence preference<select className="mt-2 w-full rounded-xl border p-3"><option>Official first</option><option>Verified first</option><option>Show all with badges</option></select></label>
    </div>
  </div>
}

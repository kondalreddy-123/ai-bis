import {useEffect,useMemo,useState} from "react";
import {Routes,Route,Link,useLocation,useNavigate} from "react-router-dom";
import {Search,Mic,Upload,ShieldCheck,GitCompare,ChevronRight,CheckCircle2,AlertTriangle,Info,ExternalLink,Languages,Menu,X,SlidersHorizontal,FileText,Lightbulb,Database,ArrowRight} from "lucide-react";
import {api} from "./api";
import {languages,Lang,tx} from "./i18n";

type Standard=any; type Product=any;


function localizedStandard(s:any, lang:Lang) {
  const tr=s.translations?.[lang];
  return tr ? {...s, title:tr.title, scope:tr.scope} : s;
}

const examplePrompt="Need standards for outdoor LED street lights for a government tender.";

function Layout({
  lang,
  setLang,
  children,
}: {
  lang: Lang;
  setLang: (x: Lang) => void;
  children: React.ReactNode;
}) {
  const [mobile,setMobile]=useState(false);
  const loc=useLocation();
  const nav=[
    ["/","home"],["/search","search"],["/analysis","analysis"],["/tender","tender"],
    ["/explorer","explorer"],["/compare","compare"],["/recommend","recommend"],
    ["/safety","safety"],["/evidence","evidence"],["/dashboard","dashboard"],["/settings","settings"]
  ];
  return <div className="app-shell">
    <header className="topbar">
      <Link to="/" className="brand"><span className="brand-mark">B</span><span>BIS SENSOR</span></Link>
      <button className="mobile-menu" onClick={()=>setMobile(!mobile)} aria-label="Menu">{mobile?<X/>:<Menu/>}</button>
      <nav className={mobile?"nav open":"nav"}>{nav.map(([path,key])=><Link key={path} onClick={()=>setMobile(false)} className={loc.pathname===path?"active":""} to={path}>{tx(lang,key)}</Link>)}</nav>
      <label className="lang"><Languages size={17}/><select value={lang} onChange={e=>setLang(e.target.value as Lang)} aria-label="Language">{languages.map(l=><option key={l.code} value={l.code}>{l.label}</option>)}</select></label>
    </header>
    <main>{/* page */}</main>
    <footer><span>BIS SENSOR</span><span>{tx(lang,"disclaimer")}</span></footer>
  </div>
}

function useAppLanguage(){ return (window as any).__bissensor_lang as Lang || "en"; }

function Home({lang}:{lang:Lang}) {
  const [text,setText]=useState(""); const [loading,setLoading]=useState(false); const [result,setResult]=useState<any>(null); const [error,setError]=useState("");
  const nav=useNavigate();
  const run=async()=>{setError("");setLoading(true);try{const r=await api.analyze(text||examplePrompt,lang);setResult(r)}catch(e:any){setError(e.message)}finally{setLoading(false)}};
  return <div className="page home">
    <section className="hero">
      <div className="eyebrow"><span className="live-dot"/> AI STANDARDS INTELLIGENCE</div>
      <h1>{tx(lang,"hero")}</h1><p>{tx(lang,"heroSub")}</p>
      <div className="hero-input">
        <textarea value={text} onChange={e=>setText(e.target.value)} placeholder={tx(lang,"searchPlaceholder")} aria-label={tx(lang,"searchPlaceholder")}/>
        <div className="input-actions">
          <button className="icon-btn" title={tx(lang,"voice")} onClick={()=>startVoice(setText,lang)}><Mic size={20}/></button>
          <Link className="secondary-btn" to="/tender"><Upload size={18}/>{tx(lang,"upload")}</Link>
          <button className="primary-btn" disabled={loading} onClick={run}>{loading?"Analyzing…":tx(lang,"analyze")}<ArrowRight size={18}/></button>
        </div>
      </div>
      <div className="demo-row"><button className="text-btn" onClick={()=>setText(examplePrompt)}>Try an example: “{examplePrompt}”</button></div>
    </section>
    <section className="trust-strip">
      <div><ShieldCheck/><b>Evidence-first</b><span>Every major result has a source status.</span></div>
      <div><Database/><b>Standards graph</b><span>Primary → related → test → safety.</span></div>
      <div><GitCompare/><b>Decision support</b><span>Compare products against requirements.</span></div>
    </section>
    {error&&<div className="alert danger">{error}</div>}
    {result&&<AnalysisResult lang={lang} result={result}/>}
    {!result&&<section className="feature-grid">
      {[
        ["Natural-language standards search","Ask in normal language instead of remembering exact terminology.",Search],
        ["Incomplete-input guidance","When details are missing, BIS SENSOR asks for useful choices.",SlidersHorizontal],
        ["Simple explanations","Technical requirements are translated into plain-language guidance.",Lightbulb],
        ["Evidence separation","Official, third-party, AI-derived and unverified information are visually distinct.",ShieldCheck]
      ].map(([title,desc,Icon])=><div className="card feature" key={title as string}><Icon/><h3>{title as string}</h3><p>{desc as string}</p></div>)}
    </section>}
  </div>
}

function AnalysisResult({lang,result}:{lang:Lang;result:any}) {
  const nav=useNavigate(); const a=result.analysis;
  return <section className="results">
    <div className="section-head"><div><span className="eyebrow">ANALYSIS</span><h2>{a.product}</h2></div><span className="badge verified">OFFICIAL SOURCES</span></div>
    <div className="requirement-grid">
      {a.requirements.map((r:any)=><div className="req" key={r.name}><CheckCircle2/><span><small>{r.name}</small><b>{r.value}</b></span></div>)}
    </div>
    {a.missing.length>0&&<MissingQuestions lang={lang} missing={a.missing}/>}
    <h3>{tx(lang,"applicable")}</h3>
    <div className="standard-cards">{result.recommendations.map((r:any)=><StandardCard key={r.standard.id} lang={lang} item={r} onClick={()=>nav(`/standards/${r.standard.id}`)}/>)}</div>
  </section>
}

function MissingQuestions({lang,missing}:{lang:Lang;missing:any[]}) {
  const [values,setValues]=useState<Record<string,string>>({});
  return <div className="card missing-box"><div className="missing-title"><AlertTriangle/><div><b>{tx(lang,"missing")}</b><p>{tx(lang,"selectRequired")}</p></div></div>
    <div className="question-grid">{missing.map(q=><label key={q.key}><span>{q.label}</span><select value={values[q.key]||""} onChange={e=>setValues({...values,[q.key]:e.target.value})}><option value="">Select…</option>{q.options.map((o:string)=><option key={o}>{o}</option>)}</select></label>)}</div>
  </div>
}

function StandardCard({lang,item,onClick}:{lang:Lang;item:any;onClick:()=>void}) {
  const s=localizedStandard(item.standard, lang);
  return <div className="card standard-card">
    <div className="standard-top"><div><span className="is-number">{s.is_number}</span><h3>{s.title}</h3></div><span className="badge verified">{s.verification_status || tx(lang,"official")}</span></div>
    <p>{item.why_it_matches}</p>
    <div className="standard-meta"><span>Edition / Year <b>{s.edition}</b></span><span>Confidence <b>{item.confidence}%</b></span></div>
    <div className="standard-actions"><button className="link-btn" onClick={onClick}>{tx(lang,"details")}<ChevronRight size={16}/></button>{s.source_url&&<a className="link-btn" href={s.source_url} target="_blank" rel="noreferrer">Official BIS evidence <ExternalLink size={15}/></a>}</div>
  </div>
}

function SearchPage({lang}:{lang:Lang}) {
  const [q,setQ]=useState(""); const [domain,setDomain]=useState(""); const [results,setResults]=useState<any[]>([]); const [loading,setLoading]=useState(false);
  const doSearch=async()=>{setLoading(true);try{const r=await api.search(q,domain||undefined);setResults(r.results)}finally{setLoading(false)}};
  return <Page title={tx(lang,"search")} intro="Search by product, requirement, domain or an IS identifier. Results start with a simple identifier; select one to open the full record.">
    <div className="search-panel card"><div className="search-row"><Search/><input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doSearch()} placeholder="e.g. outdoor LED street lights, water pump, electrical cable…"/><button className="primary-btn" onClick={doSearch}>{loading?"Searching…":tx(lang,"search")}</button></div>
      <div className="filter-row"><select value={domain} onChange={e=>setDomain(e.target.value)}><option value="">All domains</option>{["Lighting & Electrical","Electrical Safety","Cables & Wires","Water & Pumps","Construction","Mechanical","Industrial Automation","Textiles","Food & Agriculture","Medical Devices","IT & Electronics","Solar & Renewable Energy","Fire & Safety","Automotive","Environment & Energy"].map(d=><option key={d}>{d}</option>)}</select></div>
    </div>
    <div className="search-results">{results.map(s=>{const ls=localizedStandard(s,lang); return <Link className="search-result card" to={`/standards/${s.id}`} key={s.id}><div><span className="is-number">{ls.is_number}</span><h3>{ls.title}</h3><p>{s.domain} · {s.product_category}</p></div><ChevronRight/></Link>})}</div>
    {results.length===0&&<div className="empty card"><Info/><p>Search results will appear here. Try <b>outdoor LED street lights</b>.</p></div>}
  </Page>
}

function StandardDetails({lang}:{lang:Lang}) {
  const id=useLocation().pathname.split("/").pop()!; const [data,setData]=useState<any>(); const [err,setErr]=useState("");
  useEffect(()=>{api.standard(id).then(setData).catch(e=>setErr(e.message))},[id]);
  if(err)return <Page title="Standard details"><div className="alert danger">{err}</div></Page>;
  if(!data)return <Page title="Standard details"><div className="loading">Loading…</div></Page>;
  const s=localizedStandard(data.standard, lang);
  return <Page title={s.is_number} intro="The identifier is shown first for quick scanning. Opened details separate standard metadata, relationships and evidence.">
    <div className="detail-grid"><div className="card detail-main"><span className="is-number">{s.is_number}</span><h2>{s.title}</h2><div className="badge verified">{s.verification_status}</div><dl><dt>Edition / Year</dt><dd>{s.edition}</dd><dt>Status</dt><dd>{s.status}</dd><dt>Scope</dt><dd>{s.scope}</dd><dt>Domain</dt><dd>{s.domain}</dd><dt>Product category</dt><dd>{s.product_category}</dd></dl></div>
      <aside className="card evidence-card"><h3>{tx(lang,"source")}</h3><div className="evidence-badge">BIS</div><p>{s.source_name}</p>{s.source_url&&<a className="primary-btn" href={s.source_url} target="_blank" rel="noreferrer">Official BIS evidence <ExternalLink size={15}/></a>}</aside></div>
    <h3>{tx(lang,"related")}</h3><div className="relationship-list">{data.relationships.map((r:any)=>{const rs=localizedStandard(r.standard,lang); return <div className="card relation" key={r.standard.id}><span className="relation-type">{r.relationship}</span><span className="is-number">{rs.is_number}</span><b>{rs.title}</b></div>})}</div>
  </Page>
}

function ComparePage({lang}:{lang:Lang}) {
  const [selected,setSelected]=useState(["prod-led-a","prod-led-b","prod-led-c"]); const [rows,setRows]=useState<any[]>([]);
  const load=async()=>setRows((await api.compareProducts(selected)).products);
  useEffect(()=>{load()},[]);
  return <Page title={tx(lang,"compare")} intro="Compare products using the available product specifications. Verify procurement requirements against official sources.">
    <div className="card select-products">{["prod-led-a","prod-led-b","prod-led-c"].map((id,i)=><label key={id}><input type="checkbox" checked={selected.includes(id)} onChange={e=>setSelected(e.target.checked?[...selected,id]:selected.filter(x=>x!==id))}/>{["Outdoor LED Street Light A","Outdoor LED Street Light B","Outdoor LED Street Light C"][i]}</label>)}<button className="primary-btn" onClick={load}>{tx(lang,"compareNow")}</button></div>
    <div className="table-wrap card"><table><thead><tr><th>Feature</th>{rows.map(p=><th key={p.id}>{p.name}</th>)}</tr></thead><tbody>
      {[
        ["Quality level",(p:any)=>p.quality_level],["AI-assisted score",(p:any)=>`${p.score}/100`],["Power",(p:any)=>`${p.technical_specs.power_w} W`],["Ingress protection",(p:any)=>p.technical_specs.ip_rating],["Certification",(p:any)=>p.certifications.length?"Available":"Not present"],["Price",(p:any)=>`₹${p.price.toLocaleString("en-IN")}`],["Warranty",(p:any)=>`${p.technical_specs.warranty_years} years`]
      ].map(([label,fn])=><tr key={label as string}><td><b>{label as string}</b></td>{rows.map(p=><td key={p.id}>{(fn as any)(p)}</td>)}</tr>)}
    </tbody></table></div>
    <div className="chart-bars card"><h3>Requirement dimensions</h3>{rows.map(p=><div className="bar-row" key={p.id}><span>{p.name}</span><div><i style={{width:`${p.score}%`}}/></div><b>{p.score}</b></div>)}</div>
  </Page>
}

function RecommendationPage({lang}:{lang:Lang}) {
  const [form,setForm]=useState<any>({budget_min:5000,budget_max:10000,use_case:"Government street lighting",environment:"Outdoor",safety_priority:"High",quality_level:"Level 3",text:examplePrompt});
  const [rows,setRows]=useState<any[]>([]);
  const submit=async()=>setRows((await api.recommendProduct({...form,language:lang})).recommendations);
  return <Page title={tx(lang,"recommend")} intro="Tell BIS SENSOR what matters to you. The result is a decision-support ranking, not an official certification or procurement authority.">
    <div className="form-grid card">{[
      ["budget_min","Minimum budget","number"],["budget_max","Maximum budget","number"],["use_case","Intended use","text"]
    ].map(([k,l,type])=><label key={k}><span>{l}</span><input type={type} value={form[k]} onChange={e=>setForm({...form,[k]:type==="number"?Number(e.target.value):e.target.value})}/></label>)}
      <label><span>{tx(lang,"environment")}</span><select value={form.environment} onChange={e=>setForm({...form,environment:e.target.value})}><option>Outdoor</option><option>Indoor</option><option>Industrial</option></select></label>
      <label><span>{tx(lang,"safetyPriority")}</span><select value={form.safety_priority} onChange={e=>setForm({...form,safety_priority:e.target.value})}><option>High</option><option>Medium</option><option>Low</option></select></label>
      <label><span>{tx(lang,"quality")}</span><select value={form.quality_level} onChange={e=>setForm({...form,quality_level:e.target.value})}><option>Level 1</option><option>Level 2</option><option>Level 3</option></select></label>
      <button className="primary-btn full" onClick={submit}>{tx(lang,"generate")}</button>
    </div>
    <div className="recommend-grid">{rows.map((p,i)=><div className="card recommend-card" key={p.id}><div className="rank">#{i+1}</div><span className="is-number">{i===0?tx(lang,"best"):i===1?tx(lang,"value"):tx(lang,"budgetChoice")}</span><h3>{p.name}</h3><div className="score-ring">{p.score}<small>/100</small></div><b>{p.quality_level}</b><p><strong>{tx(lang,"why")}:</strong> {p.recommended_because.join("; ")}.</p></div>)}</div>
  </Page>
}

function SafetyPage({lang}:{lang:Lang}) {
  const [items,setItems]=useState<any[]>([]);
  useEffect(()=>{api.safety({product:"Outdoor LED Street Light",requirements:["Outdoor","Government tender"],environment:"Outdoor"}).then(r=>setItems(r.items))},[]);
  return <Page title={tx(lang,"safety")} intro={tx(lang,"safetyIntro") + " " + tx(lang,"buyingIntro")}>
    <div className="notice"><ShieldCheck/><div><b>Safety is a verification workflow</b><p>Use each item to check the product documentation, installation conditions and authoritative requirements before purchase.</p></div></div>
    <div className="checklist">{items.map(x=><div className="card checklist-item" key={x.title}><CheckCircle2/><div><b>{x.title}</b><p>{x.description}</p></div><span>{x.type}</span></div>)}</div>
  </Page>
}

function TenderPage({lang}:{lang:Lang}) {
  const [file,setFile]=useState<File>(); const [res,setRes]=useState<any>(); const [loading,setLoading]=useState(false); const [error,setError]=useState("");
  const submit=async()=>{if(!file)return;setLoading(true);try{setRes(await api.tender(file))}catch(e:any){setError(e.message)}finally{setLoading(false)}};
  return <Page title={tx(lang,"tender")} intro="Upload a PDF, DOCX or TXT tender. BIS SENSOR extracts text, identifies requirements and flags areas that require verification.">
    <div className="upload-card card"><FileText size={30}/><h3>Upload tender document</h3><p>Supported: PDF, DOCX, TXT. Scanned PDFs may require OCR.</p><input type="file" accept=".pdf,.docx,.txt" onChange={e=>setFile(e.target.files?.[0])}/>{file&&<b>{file.name}</b>}<button className="primary-btn" disabled={!file||loading} onClick={submit}>{loading?"Analyzing…":"Run Tender Standards Review"}</button></div>
    {error&&<div className="alert danger">{error}</div>}{res&&<div className="card tender-result"><h3>Extracted product</h3><p>{res.review.analysis.product}</p><h3>{tx(lang,"applicable")}</h3>{res.review.recommendations.map((r:any)=><div className="mini-standard" key={r.standard.id}><span className="is-number">{r.standard.is_number}</span><p>{r.applicability}</p><span>{r.confidence}%</span></div>)}</div>}
  </Page>
}

function EvidencePage({lang}:{lang:Lang}) {
  return <Page title={tx(lang,"evidence")} intro="Evidence is deliberately separated from AI interpretation. A missing source is shown as missing, never invented.">
    <div className="evidence-grid">{[
      ["OFFICIAL","Authoritative publication or authority source. Not populated in the current source set."],
      ["VERIFIED","A source whose identity and content have been checked."],
      ["THIRD-PARTY","Seller, marketplace or customer information. Requires source-level scrutiny."],
      ["AI-DERIVED","Interpretation generated from retrieved evidence, not an authority."],
      ["UNVERIFIED","Requires verification before procurement use."]
    ].map(([a,b])=><div className="card" key={a}><span className={`badge ${a.toLowerCase().replace("-","")}`}>{a}</span><p>{b}</p></div>)}</div>
  </Page>
}

function Dashboard({lang}:{lang:Lang}) {
  return <Page title={tx(lang,"dashboard")} intro="A unified view of requirement understanding, standards, compliance signals, product evaluation and evidence.">
    <div className="dashboard-grid">{[
      ["Requirement","Outdoor LED street lighting","Detected from user input"],
      ["Standards","3 standards","Relationship-aware"],
      ["Compliance","Needs Verification","No official certification claim"],
      ["Products","3 products","Prototype comparison data"],
      ["Score","AI-assisted","Explainable weighted dimensions"],
      ["Evidence","Verification status varies","Authoritative sources not fabricated"]
    ].map(x=><div className="card metric" key={x[0]}><small>{x[0]}</small><strong>{x[1]}</strong><span>{x[2]}</span></div>)}</div>
  </Page>
}

function Explorer({lang}:{lang:Lang}) {
  const [results,setResults]=useState<any[]>([]);
  useEffect(()=>{api.search("",undefined).then(r=>setResults(r.results))},[]);
  return <Page title={tx(lang,"explorer")} intro="Browse the standards knowledge layer by domain. Select a simple IS identifier to open the complete record.">
    <div className="domain-grid">{["Lighting & Electrical","Electrical Safety","Cables & Wires","Water & Pumps","Construction","Mechanical","Industrial Automation","Textiles","Food & Agriculture","Medical Devices","IT & Electronics","Solar & Renewable Energy","Fire & Safety","Automotive","Environment & Energy"].map(d=><Link key={d} to={`/search?domain=${encodeURIComponent(d)}`} className="domain-card card">{d}<ChevronRight/></Link>)}</div>
    <div className="standard-list">{results.map(s=><Link className="card standard-line" to={`/standards/${s.id}`} key={s.id}><span className="is-number">{s.is_number}</span><span>{s.title}</span><ChevronRight/></Link>)}</div>
  </Page>
}

function AnalysisPage({lang}:{lang:Lang}) {
  const [text,setText]=useState(examplePrompt); const [result,setResult]=useState<any>();
  return <Page title={tx(lang,"analysis")} intro="Paste a product specification or requirement. The system extracts what is known, asks for missing fields and links recommendations to evidence.">
    <div className="card analysis-input"><textarea value={text} onChange={e=>setText(e.target.value)}/><button className="primary-btn" onClick={()=>api.analyze(text,lang).then(setResult)}>{tx(lang,"analyze")}</button></div>
    {result&&<AnalysisResult lang={lang} result={result}/>}
  </Page>
}

function Settings({lang,setLang}:{lang:Lang;setLang:(x:Lang)=>void}) {
  return <Page title={tx(lang,"settings")} intro="Language and interface preferences. Language changes all supported interface text and standard explanations without changing official identifiers.">
    <div className="card setting"><Languages/><div><h3>Interface language</h3><p>Official standard identifiers such as IS numbers remain unchanged.</p><select value={lang} onChange={e=>setLang(e.target.value as Lang)}>{languages.map(l=><option value={l.code} key={l.code}>{l.label}</option>)}</select></div></div>
  </Page>
}

function Page({title,intro,children}:{title:string;intro?:string;children:any}) {
  return <div className="page"><div className="page-title"><span className="eyebrow">BIS SENSOR</span><h1>{title}</h1>{intro&&<p>{intro}</p>}</div>{children}</div>
}

function startVoice(setText:(x:string)=>void,lang:Lang){
  const SR=(window as any).SpeechRecognition||(window as any).webkitSpeechRecognition;
  if(!SR){alert("Voice input is not supported by this browser.");return}
  const r=new SR(); r.lang=lang==="hi"?"hi-IN":lang==="te"?"te-IN":"en-IN"; r.interimResults=false; r.onresult=(e:any)=>setText(e.results[0][0].transcript); r.start();
}

export default function App(){
  const [lang,setLangState]=useState<Lang>((localStorage.getItem("bissensor-lang") as Lang)||"en");
  useEffect(()=>{localStorage.setItem("bissensor-lang",lang);(window as any).__bissensor_lang=lang;document.documentElement.lang=lang},[lang]);
  const setLang=(x:Lang)=>setLangState(x);
  return <Layout lang={lang} setLang={setLang}><Routes>
    <Route path="/" element={<Home lang={lang}/>}/><Route path="/search" element={<SearchPage lang={lang}/>}/>
    <Route path="/standards/:id" element={<StandardDetails lang={lang}/>}/><Route path="/analysis" element={<AnalysisPage lang={lang}/>}/>
    <Route path="/tender" element={<TenderPage lang={lang}/>}/><Route path="/explorer" element={<Explorer lang={lang}/>}/>
    <Route path="/compare" element={<ComparePage lang={lang}/>}/><Route path="/recommend" element={<RecommendationPage lang={lang}/>}/>
    <Route path="/safety" element={<SafetyPage lang={lang}/>}/><Route path="/evidence" element={<EvidencePage lang={lang}/>}/>
    <Route path="/dashboard" element={<Dashboard lang={lang}/>}/><Route path="/settings" element={<Settings lang={lang} setLang={setLang}/>}/>
  </Routes></Layout>
}

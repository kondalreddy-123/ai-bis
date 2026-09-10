const BASE = "https://ai-bis-sensor-1.onrender.com";

async function request(path:string, options:RequestInit = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: {"Content-Type":"application/json", ...(options.headers||{})},
    ...options
  });
  if (!res.ok) {
    const body = await res.json().catch(()=>({}));
    throw new Error(body.detail || `Request failed (${res.status})`);
  }
  return res.json();
}
export const api = {
  analyze:(text:string, language:string)=>request("/api/analyze-specification",{method:"POST",body:JSON.stringify({text,language})}),
  search:(query:string, domain?:string)=>request("/api/search-standards",{method:"POST",body:JSON.stringify({query,domain})}),
  standard:(id:string)=>request(`/api/standards/${id}`),
  compareProducts:(ids:string[])=>request("/api/compare-products",{method:"POST",body:JSON.stringify({product_ids:ids})}),
  recommendProduct:(payload:any)=>request("/api/recommend-product",{method:"POST",body:JSON.stringify(payload)}),
  safety:(payload:any)=>request("/api/safety-checklist",{method:"POST",body:JSON.stringify(payload)}),
  explain:(requirement:string,language:string)=>request("/api/explain-requirement",{method:"POST",body:JSON.stringify({requirement,language})}),
  tender:async(file:File)=>{
    const fd=new FormData(); fd.append("file",file);
    const res=await fetch(`${BASE}/api/analyze-tender`,{method:"POST",body:fd});
    if(!res.ok) throw new Error("Tender analysis failed");
    return res.json();
  }
};

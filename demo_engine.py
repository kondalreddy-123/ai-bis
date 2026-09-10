"""
Safe local demo engine.

The records below are SYNTHETIC and are never presented as official BIS data.
They exist to demonstrate the workflow without fabricating real standards.
Replace the repository with verified BIS/licensed records for production.
"""

DEMO_NOTICE = "DEMO DATA — NOT OFFICIAL BIS DATA"

DEMO_STANDARDS = [
    {
        "id": 1,
        "is_number": "IS-DEMO-LED-001",
        "title": "Synthetic LED Street Lighting Product Standard (Demo)",
        "edition": "Demo edition",
        "status": "DEMO_ONLY",
        "domain": "Lighting & Electrical",
        "product_category": "Outdoor LED street lighting",
        "scope": "Synthetic record used to demonstrate standards retrieval and procurement reasoning.",
        "abstract": "Not an actual Indian Standard.",
        "verification_status": "UNVERIFIED",
        "source_name": "Synthetic demonstration dataset",
        "source_url": None,
        "evidence": "Synthetic demo record. Verify against the authoritative BIS publication before procurement.",
    },
    {
        "id": 2,
        "is_number": "IS-DEMO-IP-002",
        "title": "Synthetic Enclosure Protection Test Standard (Demo)",
        "edition": "Demo edition",
        "status": "DEMO_ONLY",
        "domain": "Electrical Safety",
        "product_category": "Outdoor electrical equipment",
        "scope": "Synthetic record for demonstrating ingress-protection reasoning.",
        "abstract": "Not an actual Indian Standard.",
        "verification_status": "UNVERIFIED",
        "source_name": "Synthetic demonstration dataset",
        "source_url": None,
        "evidence": "Synthetic demo record. Verify the required IP test standard and edition from an authoritative source.",
    },
    {
        "id": 3,
        "is_number": "IS-DEMO-PHOTO-003",
        "title": "Synthetic Photometric Test Method (Demo)",
        "edition": "Demo edition",
        "status": "DEMO_ONLY",
        "domain": "Lighting & Testing",
        "product_category": "LED lighting",
        "scope": "Synthetic record for demonstrating test-method relationships.",
        "abstract": "Not an actual Indian Standard.",
        "verification_status": "UNVERIFIED",
        "source_name": "Synthetic demonstration dataset",
        "source_url": None,
        "evidence": "Synthetic demo record. Verify the applicable photometric test method from an authoritative source.",
    },
]

DEMO_PRODUCTS = [
    {
        "id": 101, "name": "Demo Street Light A", "brand": "Demo Brand A", "category": "Outdoor LED",
        "technical_specs": {"power_w": 120, "ip_rating": "IP65", "efficacy_lm_w": 120, "cct_k": 4000},
        "certifications": ["Demo certificate — verify"], "price": None, "rating": None,
        "review_count": None, "data_status": "SYNTHETIC_DEMO"
    },
    {
        "id": 102, "name": "Demo Street Light B", "brand": "Demo Brand B", "category": "Outdoor LED",
        "technical_specs": {"power_w": 100, "ip_rating": "IP54", "efficacy_lm_w": 105, "cct_k": 3000},
        "certifications": ["Demo certificate — verify"], "price": None, "rating": None,
        "review_count": None, "data_status": "SYNTHETIC_DEMO"
    },
    {
        "id": 103, "name": "Demo Street Light C", "brand": "Demo Brand C", "category": "Outdoor LED",
        "technical_specs": {"power_w": 150, "ip_rating": None, "efficacy_lm_w": 130, "cct_k": 5000},
        "certifications": [], "price": None, "rating": None,
        "review_count": None, "data_status": "SYNTHETIC_DEMO"
    },
]

def detect_requirements(text: str):
    t = text.lower()
    req = []
    if "outdoor" in t or "street" in t:
        req.append({"name": "Environment", "value": "Outdoor", "status": "detected"})
    if "100w" in t or "100 w" in t:
        req.append({"name": "Minimum power", "value": "100 W", "status": "detected"})
    if "ip65" in t:
        req.append({"name": "Ingress protection", "value": "IP65", "status": "detected"})
    if "durab" in t:
        req.append({"name": "Durability", "value": "High", "status": "detected"})
    if "energy" in t or "efficient" in t:
        req.append({"name": "Energy efficiency", "value": "Required", "status": "detected"})
    missing = []
    if not any(r["name"] == "Minimum power" for r in req):
        missing.append({"field": "Minimum power", "options": ["60 W", "90 W", "100 W", "120 W+", "Not sure"]})
    if not any(r["name"] == "Ingress protection" for r in req):
        missing.append({"field": "Ingress protection", "options": ["IP44", "IP54", "IP65", "IP66", "Not sure"]})
    if not any(r["name"] == "Environment" for r in req):
        missing.append({"field": "Environment", "options": ["Indoor", "Outdoor", "Industrial", "Coastal", "Not sure"]})
    return req, missing

def search_standards(query: str, domain: str | None = None):
    q = query.lower()
    results = []
    for s in DEMO_STANDARDS:
        hay = f"{s['title']} {s['domain']} {s['product_category']} {s['scope']}".lower()
        score = 0
        for token in q.split():
            if len(token) >= 3 and token in hay:
                score += 10
        if domain and domain.lower() in s["domain"].lower():
            score += 15
        if "led" in q and "led" in hay:
            score += 20
        if "street" in q and "street" in hay:
            score += 20
        if score:
            results.append({**s, "ai_confidence": min(99, 55 + score)})
    results.sort(key=lambda x: x["ai_confidence"], reverse=True)
    return results

def analyze(text: str):
    req, missing = detect_requirements(text)
    standards = search_standards(text)
    if not standards:
        return {
            "demo_notice": DEMO_NOTICE, "requirements": req, "missing_information": missing,
            "standards": [], "message": "No verified applicable standard found."
        }
    return {
        "demo_notice": DEMO_NOTICE,
        "requirements": req,
        "missing_information": missing,
        "standards": standards,
        "compliance": {"known": 72 if not missing else 58, "status": "Needs verification"},
        "safety_checklist": [
            {"item": "Electrical safety requirements", "status": "verify"},
            {"item": "Environmental / enclosure protection", "status": "verify"},
            {"item": "Installation requirements", "status": "verify"},
            {"item": "Certification / conformity evidence", "status": "verify"},
            {"item": "Maintenance and warranty requirements", "status": "verify"},
        ],
    }

def product_score(product, user_req: dict):
    score = 50.0
    specs = product["technical_specs"]
    if user_req.get("environment", "").lower() == "outdoor":
        score += 10 if specs.get("ip_rating") else 0
    min_power = user_req.get("min_power")
    if min_power:
        score += 15 if specs.get("power_w", 0) >= min_power else -15
    if user_req.get("ip_rating"):
        score += 15 if specs.get("ip_rating") == user_req["ip_rating"] else -10
    score += 5 if product["certifications"] else 0
    score += 5 if specs.get("efficacy_lm_w", 0) >= 110 else 0
    return max(0, min(100, round(score)))

def recommend_products(req: dict):
    enriched = []
    for p in DEMO_PRODUCTS:
        s = product_score(p, req)
        level = "Level 3" if s >= 85 else "Level 2" if s >= 70 else "Level 1"
        quality = "Excellent" if s >= 90 else "Good" if s >= 75 else "Acceptable" if s >= 60 else "Needs Verification"
        enriched.append({**p, "score": s, "quality_level": level, "quality": quality})
    enriched.sort(key=lambda x: x["score"], reverse=True)
    return enriched

def explain_requirement(requirement: str, language="en"):
    r = requirement.lower()
    if "ip65" in r:
        return "IP65 is an enclosure-protection classification. In simple terms, it indicates a stated level of protection against dust and water jets. Verify the exact test method and product claim against the authoritative standard."
    if "efficacy" in r:
        return "Efficacy describes how much light output is produced for each watt of electrical power. Higher values can indicate better energy efficiency, but the procurement requirement should define the measurement method and acceptable conditions."
    if "cct" in r or "colour temperature" in r:
        return "Colour temperature describes the apparent colour of the light, such as warmer or cooler white. Choose it according to the application rather than assuming a higher number is better."
    return "This requirement needs to be interpreted from the applicable verified standard and product evidence. AI BIS SENSOR will show the source before treating an interpretation as verified."

from fastapi import APIRouter, UploadFile, File, HTTPException
from app.schemas.api import SearchRequest, AnalyzeRequest, RecommendationRequest, ExplainRequest, TranslateRequest, CompareRequest
from app.services.demo_engine import (
    analyze, search_standards, recommend_products, explain_requirement, DEMO_PRODUCTS, DEMO_STANDARDS, DEMO_NOTICE
)
from app.services.documents import extract_text

router = APIRouter(prefix="/api")

@router.get("/health")
def health():
    return {"status": "ok", "project": "AI BIS SENSOR"}

@router.post("/search-standards")
def search(req: SearchRequest):
    return {"demo_notice": DEMO_NOTICE, "results": search_standards(req.query, req.domain)}

@router.post("/recommend-standards")
def recommend_standards(req: AnalyzeRequest):
    return analyze(req.text)

@router.post("/analyze-specification")
def analyze_spec(req: AnalyzeRequest):
    return analyze(req.text)

@router.post("/analyze-tender")
async def analyze_tender(file: UploadFile = File(...)):
    try:
        text = extract_text(file.filename or "document.txt", await file.read())
        result = analyze(text)
        result["review_type"] = "Tender Standards Review"
        result["source_file"] = file.filename
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/explain-requirement")
def explain(req: ExplainRequest):
    return {"text": explain_requirement(req.requirement, req.language), "evidence_status": "AI_DERIVED"}

@router.post("/recommend-product")
def recommend(req: RecommendationRequest):
    user_req = {
        "environment": req.environment,
        "min_power": req.technical_requirements.get("min_power"),
        "ip_rating": req.technical_requirements.get("ip_rating"),
    }
    products = recommend_products(user_req)
    return {"demo_notice": DEMO_NOTICE, "products": products}

@router.post("/compare-products")
def compare(req: CompareRequest):
    products = [p for p in DEMO_PRODUCTS if p["id"] in req.product_ids]
    return {"demo_notice": DEMO_NOTICE, "products": products}

@router.post("/safety-checklist")
def safety(req: AnalyzeRequest):
    result = analyze(req.text)
    return {"demo_notice": DEMO_NOTICE, "checklist": result["safety_checklist"], "missing_information": result["missing_information"]}

@router.post("/compare-standards")
def compare_standards(req: SearchRequest):
    results = search_standards(req.query, req.domain)
    return {"demo_notice": DEMO_NOTICE, "standards": results}

@router.post("/voice-query")
def voice_query(req: AnalyzeRequest):
    # Browser speech recognition is performed client-side; this endpoint processes its transcript.
    return analyze(req.text)

@router.post("/translate")
def translate(req: TranslateRequest):
    # Conservative demo: preserve identifiers and return an explicit AI-derived label.
    return {
        "translated_text": req.text,
        "target_language": req.target_language,
        "status": "AI_DERIVED_DEMO",
        "message": "For production, connect a vetted translation service. Official IS identifiers and titles must remain unchanged unless an authoritative translated title exists."
    }

@router.get("/standards/{standard_id}")
def standard_detail(standard_id: int):
    item = next((s for s in DEMO_STANDARDS if s["id"] == standard_id), None)
    if not item:
        raise HTTPException(status_code=404, detail="Standard not found")
    return {"demo_notice": DEMO_NOTICE, "standard": item}

@router.get("/products/{product_id}")
def product_detail(product_id: int):
    item = next((p for p in DEMO_PRODUCTS if p["id"] == product_id), None)
    if not item:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"demo_notice": DEMO_NOTICE, "product": item}

@router.get("/evidence/{evidence_id}")
def evidence_detail(evidence_id: int):
    return {
        "id": evidence_id,
        "status": "UNVERIFIED",
        "source": "Synthetic demonstration dataset",
        "message": "No authoritative evidence is attached to this demo record."
    }

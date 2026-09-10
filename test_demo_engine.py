from app.services.demo_engine import analyze, recommend_products

def test_incomplete_spec_returns_questions():
    result = analyze("Need a street light")
    assert result["missing_information"]
    assert result["standards"]

def test_product_score_is_bounded():
    result = recommend_products({"environment": "outdoor", "min_power": 100, "ip_rating": "IP65"})
    assert all(0 <= p["score"] <= 100 for p in result)

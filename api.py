from pydantic import BaseModel, Field
from typing import Any

class SearchRequest(BaseModel):
    query: str = Field(min_length=2)
    domain: str | None = None
    language: str = "en"

class AnalyzeRequest(BaseModel):
    text: str = Field(min_length=3)
    language: str = "en"

class RecommendationRequest(BaseModel):
    budget_min: float | None = None
    budget_max: float | None = None
    intended_use: str = ""
    environment: str = ""
    performance: str = ""
    safety_priority: str = "high"
    quality_level: str = "Level 2"
    technical_requirements: dict[str, Any] = {}

class ExplainRequest(BaseModel):
    requirement: str = Field(min_length=2)
    language: str = "en"

class TranslateRequest(BaseModel):
    text: str = Field(min_length=1)
    target_language: str

class CompareRequest(BaseModel):
    product_ids: list[int] = Field(min_length=1, max_length=5)

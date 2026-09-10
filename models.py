from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, Text, JSON
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from datetime import datetime

class Base(DeclarativeBase):
    pass

class Standard(Base):
    __tablename__ = "standards"
    id: Mapped[int] = mapped_column(primary_key=True)
    is_number: Mapped[str] = mapped_column(String(80), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(500))
    edition: Mapped[str | None] = mapped_column(String(80))
    publication_date: Mapped[str | None] = mapped_column(String(80))
    status: Mapped[str] = mapped_column(String(80), default="UNKNOWN")
    scope: Mapped[str] = mapped_column(Text, default="")
    abstract: Mapped[str] = mapped_column(Text, default="")
    keywords: Mapped[list] = mapped_column(JSON, default=list)
    domain: Mapped[str] = mapped_column(String(160), default="General")
    product_category: Mapped[str] = mapped_column(String(160), default="")
    source_url: Mapped[str | None] = mapped_column(String(1000))
    verification_status: Mapped[str] = mapped_column(String(40), default="UNVERIFIED")

class StandardRelationship(Base):
    __tablename__ = "standard_relationships"
    id: Mapped[int] = mapped_column(primary_key=True)
    from_standard_id: Mapped[int] = mapped_column(ForeignKey("standards.id"))
    to_standard_id: Mapped[int] = mapped_column(ForeignKey("standards.id"))
    relationship_type: Mapped[str] = mapped_column(String(80))
    evidence_id: Mapped[int | None] = mapped_column(nullable=True)

class Evidence(Base):
    __tablename__ = "evidence"
    id: Mapped[int] = mapped_column(primary_key=True)
    source_name: Mapped[str] = mapped_column(String(300))
    source_url: Mapped[str | None] = mapped_column(String(1000))
    evidence_type: Mapped[str] = mapped_column(String(80))
    excerpt: Mapped[str] = mapped_column(Text)
    source_date: Mapped[str | None] = mapped_column(String(80))
    verification_status: Mapped[str] = mapped_column(String(40), default="UNVERIFIED")

class Product(Base):
    __tablename__ = "products"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(300))
    brand: Mapped[str] = mapped_column(String(200), default="")
    category: Mapped[str] = mapped_column(String(160))
    technical_specs: Mapped[dict] = mapped_column(JSON, default=dict)
    certifications: Mapped[list] = mapped_column(JSON, default=list)
    price: Mapped[float | None] = mapped_column(Float)
    price_source: Mapped[str | None] = mapped_column(String(500))
    rating: Mapped[float | None] = mapped_column(Float)
    review_count: Mapped[int | None] = mapped_column(Integer)
    review_source: Mapped[str | None] = mapped_column(String(500))
    source_url: Mapped[str | None] = mapped_column(String(1000))
    data_status: Mapped[str] = mapped_column(String(40), default="UNVERIFIED")

class UserPreference(Base):
    __tablename__ = "user_preferences"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_key: Mapped[str] = mapped_column(String(120), unique=True)
    preferences: Mapped[dict] = mapped_column(JSON, default=dict)

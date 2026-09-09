export type Standard = {
  id: number;
  is_number: string;
  title: string;
  edition?: string;
  status: string;
  domain: string;
  product_category: string;
  scope: string;
  abstract: string;
  verification_status: string;
  source_name: string;
  source_url?: string | null;
  evidence: string;
  ai_confidence?: number;
};

export type Product = {
  id: number;
  name: string;
  brand: string;
  category: string;
  technical_specs: Record<string, any>;
  certifications: string[];
  price?: number | null;
  rating?: number | null;
  review_count?: number | null;
  score?: number;
  quality_level?: string;
  quality?: string;
};

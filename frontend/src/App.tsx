import React, { useEffect, useMemo, useState } from "react";
import {
  Home,
  Search,
  FileSearch,
  GitCompare,
  Sparkles,
  ShieldCheck,
  LayoutDashboard,
  Upload,
  Mic,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Menu,
  X,
  Database,
  FileText,
  Award,
} from "lucide-react";
import { api } from "./api";

type Standard = {
  id?: string;
  standard_id?: string;
  number?: string;
  title?: string;
  name?: string;
  edition?: string;
  year?: string | number;
  description?: string;
  domain?: string;
  category?: string;
  relevance?: number;
  score?: number;
  source_url?: string;
  bis_url?: string;
  official_url?: string;
  status?: string;
};

type AnalysisResult = {
  recommendations?: Standard[];
  standards?: Standard[];
  results?: Standard[];
  summary?: string;
  explanation?: string;
  message?: string;
};

type NavItem = {
  label: string;
  path: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
};

const navItems: NavItem[] = [
  { label: "Home", path: "/", icon: Home },
  { label: "Search Standards", path: "/search", icon: Search },
  { label: "Product Analysis", path: "/analysis", icon: FileSearch },
  { label: "AI Recommendation", path: "/recommend", icon: Sparkles },
  { label: "Compare Standards", path: "/compare", icon: GitCompare },
  { label: "Safety", path: "/safety", icon: ShieldCheck },
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
];

function getPath() {
  return window.location.pathname;
}

function navigate(path: string) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function getStandardId(s: Standard) {
  return s.id || s.standard_id || s.number || "";
}

function getStandardNumber(s: Standard) {
  return s.number || s.standard_id || s.id || "Indian Standard";
}

function getStandardTitle(s: Standard) {
  return s.title || s.name || "Indian Standard";
}

function getStandardUrl(s: Standard) {
  return s.source_url || s.bis_url || s.official_url || "";
}

function App() {
  const [path, setPath] = useState(getPath());
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setPath(getPath());
    window.addEventListener("popstate", handler);

    return () => window.removeEventListener("popstate", handler);
  }, []);

  const go = (newPath: string) => {
    navigate(newPath);
    setPath(newPath);
    setMobileOpen(false);
  };

  const current = useMemo(() => {
    return navItems.find((item) => item.path === path);
  }, [path]);

  return (
    <div className="app">
      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: Inter, Arial, sans-serif;
          background: #f5f7fb;
          color: #172033;
        }

        button,
        input,
        textarea,
        select {
          font: inherit;
        }

        button {
          cursor: pointer;
        }

        .app {
          min-height: 100vh;
          display: flex;
        }

        .sidebar {
          width: 260px;
          min-height: 100vh;
          background: #111827;
          color: white;
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          padding: 22px 14px;
          z-index: 20;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 10px 25px;
        }

        .brand-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #2563eb;
        }

        .brand-title {
          font-size: 18px;
          font-weight: 800;
        }

        .brand-sub {
          font-size: 11px;
          color: #9ca3af;
          margin-top: 2px;
        }

        .nav {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .nav-btn {
          width: 100%;
          border: 0;
          background: transparent;
          color: #cbd5e1;
          padding: 12px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 12px;
          text-align: left;
        }

        .nav-btn:hover {
          background: #1f2937;
          color: white;
        }

        .nav-btn.active {
          background: #2563eb;
          color: white;
        }

        .main {
          margin-left: 260px;
          width: calc(100% - 260px);
          min-height: 100vh;
        }

        .topbar {
          height: 68px;
          background: white;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 28px;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .top-title {
          font-weight: 700;
        }

        .status {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #15803d;
          font-size: 13px;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #22c55e;
        }

        .content {
          padding: 30px;
          max-width: 1400px;
          margin: auto;
        }

        .hero {
          background: linear-gradient(135deg, #172554, #2563eb);
          color: white;
          border-radius: 20px;
          padding: 45px;
          margin-bottom: 25px;
        }

        .hero h1 {
          font-size: 38px;
          margin: 0 0 12px;
        }

        .hero p {
          max-width: 800px;
          color: #dbeafe;
          line-height: 1.7;
        }

        .btn-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 25px;
        }

        .btn {
          border: 0;
          border-radius: 10px;
          padding: 12px 18px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .btn-primary {
          background: #2563eb;
          color: white;
        }

        .btn-primary:hover {
          background: #1d4ed8;
        }

        .btn-light {
          background: white;
          color: #172033;
        }

        .btn-secondary {
          background: #e5e7eb;
          color: #172033;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 22px;
          box-shadow: 0 4px 16px rgba(0,0,0,.04);
        }

        .feature-card {
          cursor: pointer;
          transition: transform .15s ease, box-shadow .15s ease;
        }

        .feature-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(0,0,0,.08);
        }

        .feature-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: #eff6ff;
          color: #2563eb;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 15px;
        }

        .page-title {
          font-size: 30px;
          margin: 0 0 8px;
        }

        .page-description {
          color: #64748b;
          margin-bottom: 25px;
        }

        .input,
        .textarea,
        .select {
          width: 100%;
          border: 1px solid #d1d5db;
          border-radius: 10px;
          padding: 12px 14px;
          outline: none;
          background: white;
        }

        .input:focus,
        .textarea:focus,
        .select:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37,99,235,.1);
        }

        .textarea {
          min-height: 160px;
          resize: vertical;
        }

        .search-row {
          display: flex;
          gap: 10px;
        }

        .search-row .input {
          flex: 1;
        }

        .standard-list {
          display: grid;
          gap: 16px;
          margin-top: 20px;
        }

        .standard-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 15px;
          padding: 20px;
        }

        .standard-header {
          display: flex;
          justify-content: space-between;
          gap: 20px;
        }

        .standard-number {
          color: #2563eb;
          font-weight: 800;
          font-size: 17px;
        }

        .standard-title {
          font-size: 18px;
          font-weight: 750;
          margin-top: 6px;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          border-radius: 999px;
          padding: 5px 10px;
          background: #eff6ff;
          color: #1d4ed8;
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
        }

        .meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 12px;
        }

        .meta span {
          padding: 5px 9px;
          background: #f1f5f9;
          border-radius: 7px;
          font-size: 12px;
          color: #475569;
        }

        .standard-description {
          color: #64748b;
          line-height: 1.6;
          margin: 14px 0;
        }

        .official-link {
          color: #2563eb;
          font-size: 13px;
          display: inline-flex;
          gap: 5px;
          align-items: center;
          text-decoration: none;
          font-weight: 650;
        }

        .alert {
          padding: 14px 16px;
          border-radius: 10px;
          margin-top: 15px;
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }

        .alert-error {
          background: #fef2f2;
          color: #b91c1c;
        }

        .alert-success {
          background: #f0fdf4;
          color: #15803d;
        }

        .loading {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 20px 0;
          color: #64748b;
        }

        .empty {
          text-align: center;
          padding: 45px;
          color: #64748b;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
          margin-bottom: 25px;
        }

        .stat-number {
          font-size: 30px;
          font-weight: 800;
          margin-top: 8px;
        }

        .upload-box {
          border: 2px dashed #cbd5e1;
          border-radius: 15px;
          padding: 35px;
          text-align: center;
          background: white;
        }

        .upload-box input {
          display: none;
        }

        .compare-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }

        .check-row {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          margin: 12px 0;
        }

        .mobile-menu {
          display: none;
        }

        @media (max-width: 900px) {
          .sidebar {
            transform: translateX(-100%);
            transition: transform .2s;
          }

          .sidebar.open {
            transform: translateX(0);
          }

          .main {
            margin-left: 0;
            width: 100%;
          }

          .mobile-menu {
            display: inline-flex;
            border: 0;
            background: transparent;
          }

          .grid {
            grid-template-columns: 1fr;
          }

          .stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .compare-grid {
            grid-template-columns: 1fr;
          }

          .content {
            padding: 18px;
          }

          .hero {
            padding: 28px;
          }

          .hero h1 {
            font-size: 29px;
          }
        }

        @media (max-width: 550px) {
          .stats {
            grid-template-columns: 1fr;
          }

          .search-row {
            flex-direction: column;
          }

          .topbar {
            padding: 0 15px;
          }
        }
      `}</style>

      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-icon">
            <Database size={23} />
          </div>

          <div>
            <div className="brand-title">AI BIS SENSOR</div>
            <div className="brand-sub">Standards Intelligence</div>
          </div>

          <button
            className="mobile-menu"
            style={{ color: "white", marginLeft: "auto" }}
            onClick={() => setMobileOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="nav">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                className={`nav-btn ${path === item.path ? "active" : ""}`}
                onClick={() => go(item.path)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      <main className="main">
        <header className="topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              className="mobile-menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={23} />
            </button>

            <div className="top-title">
              {current?.label || "AI BIS SENSOR"}
            </div>
          </div>

          <div className="status">
            <span className="status-dot" />
            System Online
          </div>
        </header>

        <div className="content">
          {path === "/" && <HomePage go={go} />}
          {path === "/search" && <SearchPage />}
          {path === "/analysis" && <AnalysisPage />}
          {path === "/recommend" && <RecommendationPage />}
          {path === "/compare" && <ComparePage />}
          {path === "/safety" && <SafetyPage />}
          {path === "/dashboard" && <DashboardPage />}
          {!navItems.some((x) => x.path === path) && (
            <NotFoundPage go={go} />
          )}
        </div>
      </main>
    </div>
  );
}

function HomePage({ go }: { go: (path: string) => void }) {
  const features = [
    {
      title: "Search Standards",
      description:
        "Search applicable Indian Standards across multiple technical domains.",
      icon: Search,
      path: "/search",
    },
    {
      title: "Product Analysis",
      description:
        "Analyze a product or procurement specification and identify relevant standards.",
      icon: FileSearch,
      path: "/analysis",
    },
    {
      title: "AI Recommendation",
      description:
        "Get standards recommendations based on natural-language requirements.",
      icon: Sparkles,
      path: "/recommend",
    },
    {
      title: "Compare Standards",
      description:
        "Compare multiple Indian Standards side by side.",
      icon: GitCompare,
      path: "/compare",
    },
    {
      title: "Safety",
      description:
        "Review important compliance and safety considerations.",
      icon: ShieldCheck,
      path: "/safety",
    },
    {
      title: "Dashboard",
      description:
        "View platform capabilities and system information.",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
  ];

  return (
    <>
      <section className="hero">
        <h1>AI-Powered Standards Intelligence</h1>

        <p>
          AI BIS SENSOR helps procurement teams, government departments,
          engineers and organizations identify applicable Indian Standards
          from product descriptions and procurement specifications.
        </p>

        <div className="btn-row">
          <button
            className="btn btn-light"
            onClick={() => go("/analysis")}
          >
            <FileSearch size={18} />
            Analyze Specification
          </button>

          <button
            className="btn btn-light"
            onClick={() => go("/search")}
          >
            <Search size={18} />
            Search Standards
          </button>
        </div>
      </section>

      <div className="grid">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <div
              className="card feature-card"
              key={feature.path}
              onClick={() => go(feature.path)}
            >
              <div className="feature-icon">
                <Icon size={22} />
              </div>

              <h3>{feature.title}</h3>

              <p style={{ color: "#64748b", lineHeight: 1.6 }}>
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </>
  );
}

function SearchPage() {
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState("");
  const [results, setResults] = useState<Standard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const search = async () => {
    if (!query.trim()) {
      setError("Please enter a product or standard to search.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.search(
        query.trim(),
        domain || undefined
      );

      setResults(
        response.results ||
          response.standards ||
          response.recommendations ||
          []
      );
    } catch (err: any) {
      setError(
        err?.message ||
          "Unable to search standards. Please check the backend."
      );
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="page-title">Search Indian Standards</h1>

      <p className="page-description">
        Search by product, material, technical requirement or IS number.
      </p>

      <div className="card">
        <div className="search-row">
          <input
            className="input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") search();
            }}
            placeholder="Example: cement, LED street lighting, EV charger, electrical cable"
          />

          <select
            className="select"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            style={{ maxWidth: 220 }}
          >
            <option value="">All Domains</option>
            <option value="Lighting">Lighting</option>
            <option value="Electrical">Electrical</option>
            <option value="EV">EV</option>
            <option value="Construction">Construction</option>
            <option value="Water">Water</option>
            <option value="Food">Food</option>
            <option value="Safety">Safety</option>
            <option value="Appliances">Appliances</option>
            <option value="Engineering">Engineering</option>
          </select>

          <button
            className="btn btn-primary"
            onClick={search}
            disabled={loading}
          >
            {loading ? (
              <Loader2 size={18} />
            ) : (
              <Search size={18} />
            )}
            Search
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}
      </div>

      {loading && (
        <div className="loading">
          <Loader2 size={20} />
          Searching BIS standards...
        </div>
      )}

      <div className="standard-list">
        {!loading &&
          results.map((standard, index) => (
            <StandardCard
              key={getStandardId(standard) || index}
              standard={standard}
            />
          ))}

        {!loading && query && results.length === 0 && !error && (
          <div className="card empty">
            No matching standards found.
          </div>
        )}
      </div>
    </>
  );
}

function AnalysisPage() {
  const [text, setText] = useState(
    "We need standards for cement used in government construction procurement."
  );

  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = async () => {
    if (!text.trim()) {
      setError("Please enter a product specification.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await api.analyze(text.trim(), "English");
      setResult(response);
    } catch (err: any) {
      setError(
        err?.message ||
          "Product analysis failed. Please check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const standards =
    result?.recommendations ||
    result?.standards ||
    result?.results ||
    [];

  return (
    <>
      <h1 className="page-title">Product Analysis</h1>

      <p className="page-description">
        Enter a procurement specification to identify applicable Indian
        Standards.
      </p>

      <div className="card">
        <textarea
          className="textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Describe the product, material or procurement requirement..."
        />

        <div className="btn-row">
          <button
            className="btn btn-primary"
            onClick={analyze}
            disabled={loading}
          >
            {loading ? (
              <Loader2 size={18} />
            ) : (
              <FileSearch size={18} />
            )}
            Analyze Specification
          </button>

          <button
            className="btn btn-secondary"
            onClick={() =>
              setText(
                "We need BIS standards applicable to an electric vehicle charging station for a public parking facility."
              )
            }
          >
            Try Example
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}
      </div>

      {loading && (
        <div className="loading">
          <Loader2 size={20} />
          Analyzing specification...
        </div>
      )}

      {result && !loading && (
        <div style={{ marginTop: 25 }}>
          {result.summary && (
            <div className="card" style={{ marginBottom: 15 }}>
              <h3>Analysis Summary</h3>
              <p style={{ color: "#64748b", lineHeight: 1.7 }}>
                {result.summary}
              </p>
            </div>
          )}

          {result.explanation && (
            <div className="card" style={{ marginBottom: 15 }}>
              <h3>Explanation</h3>
              <p style={{ color: "#64748b", lineHeight: 1.7 }}>
                {result.explanation}
              </p>
            </div>
          )}

          <h2>Applicable Standards</h2>

          <div className="standard-list">
            {standards.map((standard, index) => (
              <StandardCard
                key={getStandardId(standard) || index}
                standard={standard}
              />
            ))}
          </div>

          {standards.length === 0 && (
            <div className="card empty">
              The backend returned an analysis, but no standards were
              included in the response.
            </div>
          )}
        </div>
      )}
    </>
  );
}

function RecommendationPage() {
  const [text, setText] = useState(
    "We are preparing a government procurement tender for outdoor LED street lighting. Identify the applicable Indian Standards and important related requirements."
  );

  const [results, setResults] = useState<Standard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const recommend = async () => {
    if (!text.trim()) {
      setError("Please describe your procurement requirement.");
      return;
    }

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const response = await api.recommend(
        text.trim(),
        "English"
      );

      setResults(
        response.recommendations ||
          response.standards ||
          response.results ||
          []
      );
    } catch (err: any) {
      setError(
        err?.message ||
          "Recommendation failed. Please check the backend connection."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="page-title">AI Recommendation Engine</h1>

      <p className="page-description">
        Describe your procurement requirement and receive applicable
        Indian Standards.
      </p>

      <div className="card">
        <textarea
          className="textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Describe your procurement requirement..."
        />

        <div className="btn-row">
          <button
            className="btn btn-primary"
            onClick={recommend}
            disabled={loading}
          >
            {loading ? (
              <Loader2 size={18} />
            ) : (
              <Sparkles size={18} />
            )}
            Get AI Recommendations
          </button>

          <button
            className="btn btn-secondary"
            onClick={() =>
              setText(
                "We need BIS standards for Portland cement for a government building construction project."
              )
            }
          >
            Cement Example
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}
      </div>

      {loading && (
        <div className="loading">
          <Loader2 size={20} />
          Finding applicable standards...
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="standard-list">
          {results.map((standard, index) => (
            <StandardCard
              key={getStandardId(standard) || index}
              standard={standard}
            />
          ))}
        </div>
      )}
    </>
  );
}

function ComparePage() {
  const [input, setInput] = useState(
    "IS 10322 (Part 5/Sec 3):2012, IS/IEC 60529:2001"
  );

  const [results, setResults] = useState<Standard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const compare = async () => {
    const ids = input
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);

    if (ids.length < 2) {
      setError("Enter at least two standard IDs separated by commas.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.compareStandards(ids);

      setResults(
        response.results ||
          response.standards ||
          response.comparison ||
          []
      );
    } catch (err: any) {
      setError(
        err?.message ||
          "Comparison failed. Please check the backend endpoint."
      );
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="page-title">Compare Standards</h1>

      <p className="page-description">
        Compare applicable Indian Standards side by side.
      </p>

      <div className="card">
        <label style={{ fontWeight: 700 }}>
          Standard IDs
        </label>

        <input
          className="input"
          style={{ marginTop: 8 }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="IS 10322, IS/IEC 60529"
        />

        <div className="btn-row">
          <button
            className="btn btn-primary"
            onClick={compare}
            disabled={loading}
          >
            {loading ? (
              <Loader2 size={18} />
            ) : (
              <GitCompare size={18} />
            )}
            Compare
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}
      </div>

      {loading && (
        <div className="loading">
          <Loader2 size={20} />
          Comparing standards...
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="compare-grid" style={{ marginTop: 20 }}>
          {results.map((standard, index) => (
            <StandardCard
              key={getStandardId(standard) || index}
              standard={standard}
            />
          ))}
        </div>
      )}

      {!loading && results.length === 0 && !error && (
        <div className="card empty">
          Enter two or more standard IDs to compare them.
        </div>
      )}
    </>
  );
}

function SafetyPage() {
  const [items] = useState([
    "Verify that the latest applicable Indian Standard edition is referenced.",
    "Check whether allied or cross-referenced standards are required.",
    "Check applicable testing and inspection requirements.",
    "Verify safety, installation and operating requirements.",
    "Ensure tender specifications do not contain ambiguous compliance language.",
    "Keep documentary evidence of applicable standards and test reports.",
  ]);

  return (
    <>
      <h1 className="page-title">Safety & Compliance</h1>

      <p className="page-description">
        Important checks before using standards in procurement
        specifications.
      </p>

      <div className="card">
        {items.map((item) => (
          <div className="check-row" key={item}>
            <CheckCircle2
              size={20}
              style={{ color: "#16a34a", flexShrink: 0 }}
            />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function DashboardPage() {
  return (
    <>
      <h1 className="page-title">Dashboard</h1>

      <p className="page-description">
        AI BIS SENSOR standards intelligence platform.
      </p>

      <div className="stats">
        <div className="card">
          <Database size={20} />
          <div className="stat-number">BIS</div>
          <div style={{ color: "#64748b" }}>Standards Knowledge</div>
        </div>

        <div className="card">
          <FileSearch size={20} />
          <div className="stat-number">AI</div>
          <div style={{ color: "#64748b" }}>Specification Analysis</div>
        </div>

        <div className="card">
          <Sparkles size={20} />
          <div className="stat-number">Smart</div>
          <div style={{ color: "#64748b" }}>Recommendations</div>
        </div>

        <div className="card">
          <Award size={20} />
          <div className="stat-number">IS</div>
          <div style={{ color: "#64748b" }}>Compliance Support</div>
        </div>
      </div>

      <div className="card">
        <h2>Platform Capabilities</h2>

        <div className="grid" style={{ marginTop: 15 }}>
          <Capability
            icon={Search}
            title="Standards Search"
            text="Find relevant standards using natural language."
          />

          <Capability
            icon={FileSearch}
            title="Specification Analysis"
            text="Analyze procurement specifications."
          />

          <Capability
            icon={Sparkles}
            title="Recommendations"
            text="Recommend applicable standards."
          />

          <Capability
            icon={GitCompare}
            title="Comparison"
            text="Compare standards for procurement decisions."
          />

          <Capability
            icon={ShieldCheck}
            title="Safety"
            text="Highlight important compliance checks."
          />

          <Capability
            icon={ExternalLink}
            title="Evidence"
            text="Link standards to official BIS sources where available."
          />
        </div>
      </div>
    </>
  );
}

function Capability({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ComponentType<{ size?: number }>;
  title: string;
  text: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        padding: 15,
        background: "#f8fafc",
        borderRadius: 10,
      }}
    >
      <Icon size={21} />

      <div>
        <strong>{title}</strong>
        <div style={{ color: "#64748b", marginTop: 4 }}>
          {text}
        </div>
      </div>
    </div>
  );
}

function StandardCard({
  standard,
}: {
  standard: Standard;
}) {
  const url = getStandardUrl(standard);

  return (
    <div className="standard-card">
      <div className="standard-header">
        <div>
          <div className="standard-number">
            {getStandardNumber(standard)}
          </div>

          <div className="standard-title">
            {getStandardTitle(standard)}
          </div>
        </div>

        {(standard.relevance !== undefined ||
          standard.score !== undefined) && (
          <div className="badge">
            {standard.relevance !== undefined
              ? `${Math.round(standard.relevance)}% relevant`
              : `${standard.score} score`}
          </div>
        )}
      </div>

      <div className="meta">
        {standard.edition && (
          <span>Edition: {standard.edition}</span>
        )}

        {standard.year && (
          <span>Year: {standard.year}</span>
        )}

        {standard.domain && (
          <span>{standard.domain}</span>
        )}

        {standard.category && (
          <span>{standard.category}</span>
        )}

        {standard.status && (
          <span>{standard.status}</span>
        )}
      </div>

      {standard.description && (
        <div className="standard-description">
          {standard.description}
        </div>
      )}

      {url && (
        <a
          className="official-link"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLink size={14} />
          Official BIS Source
        </a>
      )}
    </div>
  );
}

function NotFoundPage({
  go,
}: {
  go: (path: string) => void;
}) {
  return (
    <div className="card empty">
      <h2>Page not found</h2>

      <button
        className="btn btn-primary"
        onClick={() => go("/")}
      >
        <Home size={18} />
        Go Home
      </button>
    </div>
  );
}

export default App;

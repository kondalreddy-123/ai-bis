import React, { useEffect, useMemo, useState } from "react";
import {
  Home,
  Search,
  ScanSearch,
  Sparkles,
  GitCompare,
  ShieldCheck,
  LayoutDashboard,
  Menu,
  X,
  Upload,
  Mic,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ArrowRight,
  Languages,
  Building2,
  Lightbulb,
  Zap,
  Car,
  Droplets,
  Utensils,
  HardHat,
  Cpu,
  RefreshCw,
} from "lucide-react";

import { api } from "./api";

type IconType = React.ComponentType<{
  size?: number;
  className?: string;
  strokeWidth?: number;
}>;

type Lang = "English" | "Hindi" | "Telugu" | "Marathi";

type NavItem = {
  label: string;
  path: string;
  icon: IconType;
};

type Standard = {
  id?: string;
  standard_id?: string;
  sid?: string;

  number?: string;
  standard_number?: string;
  is_number?: string;

  title?: string;
  name?: string;

  edition?: string;
  year?: string;

  domain?: string;
  category?: string;

  description?: string;
  scope?: string;

  status?: string;

  source_url?: string;
  bis_url?: string;
  official_url?: string;

  relevance_score?: number;
  score?: number;

  reason?: string;
  why?: string;

  requirements?: string[];
  related_standards?: string[];
};

const LANGUAGES: Lang[] = [
  "English",
  "Hindi",
  "Telugu",
  "Marathi",
];

const navItems: NavItem[] = [
  {
    label: "Home",
    path: "/",
    icon: Home,
  },
  {
    label: "Search Standards",
    path: "/search",
    icon: Search,
  },
  {
    label: "Product Analysis",
    path: "/analysis",
    icon: ScanSearch,
  },
  {
    label: "AI Recommendation",
    path: "/recommend",
    icon: Sparkles,
  },
  {
    label: "Compare Standards",
    path: "/compare",
    icon: GitCompare,
  },
  {
    label: "Safety",
    path: "/safety",
    icon: ShieldCheck,
  },
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
];

function navigate(path: string) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function getStandardId(item: Standard): string {
  return (
    item.id ||
    item.standard_id ||
    item.sid ||
    item.number ||
    item.standard_number ||
    item.is_number ||
    ""
  );
}

function getStandardNumber(item: Standard): string {
  return (
    item.number ||
    item.standard_number ||
    item.is_number ||
    item.id ||
    item.standard_id ||
    "Indian Standard"
  );
}

function getStandardTitle(item: Standard): string {
  return item.title || item.name || "Indian Standard";
}

function getStandardUrl(item: Standard): string {
  return item.source_url || item.bis_url || item.official_url || "";
}

function getStandardScore(item: Standard): number | null {
  const value = item.relevance_score ?? item.score;

  if (typeof value !== "number") {
    return null;
  }

  return Math.round(value);
}

function listFromResponse(data: any): Standard[] {
  if (Array.isArray(data)) {
    return data;
  }

  const possibleKeys = [
    "results",
    "standards",
    "recommendations",
    "comparison",
    "products",
    "items",
    "data",
  ];

  for (const key of possibleKeys) {
    if (Array.isArray(data?.[key])) {
      return data[key];
    }
  }

  return [];
}

function App() {
  const [path, setPath] = useState(window.location.pathname);

  const [lang, setLang] = useState<Lang>("English");

  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const handler = () => {
      setPath(window.location.pathname);
      setMobileMenu(false);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

    window.addEventListener("popstate", handler);

    return () => {
      window.removeEventListener("popstate", handler);
    };
  }, []);

  const currentPage = useMemo(() => {
    if (path === "/search") return "search";
    if (path === "/analysis") return "analysis";
    if (path === "/recommend") return "recommend";
    if (path === "/compare") return "compare";
    if (path === "/safety") return "safety";
    if (path === "/dashboard") return "dashboard";

    return "home";
  }, [path]);

  return (
    <div className="app">
      <style>{styles}</style>

      <header className="topbar">
        <div className="brand" onClick={() => navigate("/")}>
          <div className="brand-icon">
            <ShieldCheck size={24} />
          </div>

          <div>
            <div className="brand-title">AI BIS SENSOR</div>
            <div className="brand-subtitle">
              Standards Intelligence Platform
            </div>
          </div>
        </div>

        <nav className="desktop-nav">
          {navItems.map((item) => {
            const Icon = item.icon;

            const active =
              item.path === "/"
                ? currentPage === "home"
                : path.startsWith(item.path);

            return (
              <button
                key={item.label}
                className={`nav-button ${
                  active ? "active" : ""
                }`}
                onClick={() => navigate(item.path)}
              >
                <Icon size={17} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="top-actions">
          <div className="language-control">
            <Languages size={16} />

            <select
              value={lang}
              onChange={(e) =>
                setLang(e.target.value as Lang)
              }
            >
              {LANGUAGES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <button
            className="mobile-menu-button"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            {mobileMenu ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {mobileMenu && (
        <div className="mobile-nav">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}

      <main>
        {currentPage === "home" && (
          <HomePage lang={lang} />
        )}

        {currentPage === "search" && (
          <SearchPage lang={lang} />
        )}

        {currentPage === "analysis" && (
          <AnalysisPage lang={lang} />
        )}

        {currentPage === "recommend" && (
          <RecommendationPage lang={lang} />
        )}

        {currentPage === "compare" && (
          <ComparePage lang={lang} />
        )}

        {currentPage === "safety" && (
          <SafetyPage lang={lang} />
        )}

        {currentPage === "dashboard" && (
          <DashboardPage lang={lang} />
        )}
      </main>

      <footer>
        <div>
          <strong>AI BIS SENSOR</strong>
          <span>
            AI-powered Indian Standards intelligence for
            procurement decisions.
          </span>
        </div>

        <div>
          BIS Standards • Procurement • Compliance • Safety
        </div>
      </footer>
    </div>
  );
}

/* =========================================================
   HOME
========================================================= */

function HomePage({ lang }: { lang: Lang }) {
  const cards: {
    title: string;
    text: string;
    path: string;
    icon: IconType;
  }[] = [
    {
      title: "Search Standards",
      text: "Find relevant Indian Standards using natural-language search.",
      path: "/search",
      icon: Search,
    },
    {
      title: "Product Analysis",
      text: "Analyze procurement specifications and identify applicable standards.",
      path: "/analysis",
      icon: ScanSearch,
    },
    {
      title: "AI Recommendation",
      text: "Get intelligent recommendations based on your requirements.",
      path: "/recommend",
      icon: Sparkles,
    },
    {
      title: "Compare Standards",
      text: "Compare multiple standards and understand their differences.",
      path: "/compare",
      icon: GitCompare,
    },
    {
      title: "Safety Checklist",
      text: "Generate practical safety and compliance checkpoints.",
      path: "/safety",
      icon: ShieldCheck,
    },
    {
      title: "Dashboard",
      text: "View platform statistics, domains and compliance insights.",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
  ];

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <div className="badge">
            <Sparkles size={15} />
            AI-Powered Standards Intelligence
          </div>

          <h1>
            Make Procurement
            <br />
            <span>Standards-Smart.</span>
          </h1>

          <p>
            AI BIS SENSOR analyzes procurement specifications,
            recommends applicable Indian Standards, compares
            requirements and helps procurement teams make
            safer, evidence-based decisions.
          </p>

          <div className="hero-buttons">
            <button
              className="primary-button"
              onClick={() => navigate("/analysis")}
            >
              Analyze Specification
              <ArrowRight size={18} />
            </button>

            <button
              className="secondary-button"
              onClick={() => navigate("/search")}
            >
              Search Standards
            </button>
          </div>

          <div className="hero-stats">
            <div>
              <strong>25+</strong>
              <span>Standards Domains</span>
            </div>

            <div>
              <strong>AI</strong>
              <span>Semantic Analysis</span>
            </div>

            <div>
              <strong>BIS</strong>
              <span>Official Evidence</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="sensor-card">
            <div className="sensor-header">
              <div className="sensor-icon">
                <Cpu size={25} />
              </div>

              <div>
                <strong>Standards Sensor</strong>
                <span>Live Analysis Engine</span>
              </div>

              <div className="online-dot" />
            </div>

            <div className="sensor-line">
              <span>Specification</span>
              <b>Outdoor LED Lighting</b>
            </div>

            <div className="sensor-line">
              <span>Domain</span>
              <b>Electrical / Lighting</b>
            </div>

            <div className="sensor-line">
              <span>Standards Found</span>
              <b>3 Applicable</b>
            </div>

            <div className="confidence">
              <div>
                <span>Recommendation confidence</span>
                <strong>94%</strong>
              </div>

              <div className="progress">
                <div style={{ width: "94%" }} />
              </div>
            </div>

            <div className="sensor-result">
              <CheckCircle2 size={18} />

              <div>
                <strong>Standards identified</strong>
                <span>
                  Applicable BIS references detected
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <span className="eyebrow">PLATFORM CAPABILITIES</span>

          <h2>One platform for standards intelligence</h2>

          <p>
            From product specifications to procurement
            decisions, AI BIS SENSOR connects requirements
            with relevant Indian Standards.
          </p>
        </div>

        <div className="feature-grid">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <button
                className="feature-card"
                key={card.title}
                onClick={() => navigate(card.path)}
              >
                <div className="feature-icon">
                  <Icon size={22} />
                </div>

                <h3>{card.title}</h3>

                <p>{card.text}</p>

                <span className="feature-link">
                  Open
                  <ArrowRight size={15} />
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="section dark-section">
        <div className="section-heading light">
          <span className="eyebrow">WHY AI BIS SENSOR</span>

          <h2>From specification to evidence</h2>

          <p>
            Reduce missed standards, outdated references and
            unclear procurement requirements.
          </p>
        </div>

        <div className="workflow">
          <WorkflowStep
            number="01"
            icon={FileText}
            title="Input"
            text="Enter a product description, technical specification or tender requirement."
          />

          <WorkflowStep
            number="02"
            icon={Sparkles}
            title="Analyze"
            text="AI identifies product characteristics, technical requirements and relevant domains."
          />

          <WorkflowStep
            number="03"
            icon={GitCompare}
            title="Recommend"
            text="Applicable Indian Standards and related references are recommended."
          />

          <WorkflowStep
            number="04"
            icon={ShieldCheck}
            title="Decide"
            text="Compare requirements, evidence and safety considerations before procurement."
          />
        </div>
      </section>
    </>
  );
}

function WorkflowStep({
  number,
  icon,
  title,
  text,
}: {
  number: string;
  icon: IconType;
  title: string;
  text: string;
}) {
  const Icon = icon;

  return (
    <div className="workflow-step">
      <div className="workflow-number">{number}</div>

      <Icon size={26} />

      <h3>{title}</h3>

      <p>{text}</p>
    </div>
  );
}

/* =========================================================
   SEARCH
========================================================= */

function SearchPage({ lang }: { lang: Lang }) {
  const [query, setQuery] = useState(
    "cement for construction"
  );

  const [domain, setDomain] = useState("");

  const [results, setResults] = useState<Standard[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  async function search() {
    if (!query.trim()) return;

    setLoading(true);
    setError("");

    try {
      const data = await api.search(
        query,
        domain || undefined
      );

      setResults(listFromResponse(data));
    } catch (err: any) {
      setError(
        err?.message ||
          "Unable to search standards."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageHeader
      eyebrow="STANDARDS DISCOVERY"
      title="Search Indian Standards"
      text="Search BIS standards using simple natural-language queries."
    >
      <div className="search-panel">
        <div className="search-input">
          <Search size={20} />

          <input
            value={query}
            onChange={(e) =>
              setQuery(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") search();
            }}
            placeholder="Example: cement for construction"
          />
        </div>

        <select
          value={domain}
          onChange={(e) =>
            setDomain(e.target.value)
          }
          className="select-input"
        >
          <option value="">All domains</option>
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
          className="primary-button"
          onClick={search}
          disabled={loading}
        >
          {loading ? (
            <RefreshCw
              size={18}
              className="spin"
            />
          ) : (
            <Search size={18} />
          )}

          Search
        </button>
      </div>

      <div className="example-row">
        <span>Try:</span>

        {[
          "cement for construction",
          "EV charging station",
          "house wiring",
          "drinking water",
          "LED street lighting",
        ].map((item) => (
          <button
            key={item}
            onClick={() => setQuery(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {error && <ErrorBox message={error} />}

      <div className="results-heading">
        <h2>
          {results.length
            ? `${results.length} standards found`
            : "Standards"}
        </h2>
      </div>

      {loading ? (
        <Loading />
      ) : results.length ? (
        <div className="standard-list">
          {results.map((standard, index) => (
            <StandardCard
              key={
                getStandardId(standard) ||
                `standard-${index}`
              }
              standard={standard}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Search}
          title="Search for a standard"
          text="Enter a product, material or technical requirement above."
        />
      )}
    </PageHeader>
  );
}

/* =========================================================
   ANALYSIS
========================================================= */

function AnalysisPage({ lang }: { lang: Lang }) {
  const [text, setText] = useState(
    "Supply and installation of OPC cement for reinforced concrete construction."
  );

  const [result, setResult] = useState<any>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  async function analyze() {
    if (!text.trim()) return;

    setLoading(true);
    setError("");

    try {
      const data = await api.analyze(
        text,
        lang
      );

      setResult(data);
    } catch (err: any) {
      setError(
        err?.message ||
          "Unable to analyze specification."
      );
    } finally {
      setLoading(false);
    }
  }

  const standards = listFromResponse(result);

  return (
    <PageHeader
      eyebrow="PRODUCT ANALYSIS"
      title="Analyze a Procurement Specification"
      text="Paste a product or procurement specification and identify potentially applicable Indian Standards."
    >
      <div className="analysis-grid">
        <div className="input-card">
          <div className="card-title">
            <FileText size={20} />

            <div>
              <h3>Specification</h3>
              <p>Enter technical requirements</p>
            </div>
          </div>

          <textarea
            value={text}
            onChange={(e) =>
              setText(e.target.value)
            }
            rows={12}
            placeholder="Enter procurement specification..."
          />

          <div className="input-actions">
            <button
              className="secondary-button"
              onClick={() =>
                setText(
                  "Supply and installation of EV charging station with AC charging, outdoor enclosure and electrical protection."
                )
              }
            >
              EV Example
            </button>

            <button
              className="secondary-button"
              onClick={() =>
                setText(
                  "Supply of OPC cement conforming to requirements for reinforced concrete construction."
                )
              }
            >
              Cement Example
            </button>

            <button
              className="primary-button"
              onClick={analyze}
              disabled={loading}
            >
              {loading ? (
                <RefreshCw
                  size={18}
                  className="spin"
                />
              ) : (
                <ScanSearch size={18} />
              )}

              Analyze
            </button>
          </div>
        </div>

        <div className="info-card">
          <div className="card-title">
            <Sparkles size={20} />

            <div>
              <h3>AI Analysis</h3>
              <p>
                Extracted procurement intelligence
              </p>
            </div>
          </div>

          {!result && !loading && (
            <div className="placeholder">
              <ScanSearch size={40} />

              <h3>Ready to analyze</h3>

              <p>
                Submit the specification to identify
                relevant standards.
              </p>
            </div>
          )}

          {loading && <Loading />}

          {result && !loading && (
            <AnalysisResult
              data={result}
              standards={standards}
            />
          )}
        </div>
      </div>

      {error && <ErrorBox message={error} />}
    </PageHeader>
  );
}

function AnalysisResult({
  data,
  standards,
}: {
  data: any;
  standards: Standard[];
}) {
  return (
    <div>
      <div className="analysis-summary">
        <div>
          <span>Detected domain</span>
          <strong>
            {data?.domain ||
              data?.category ||
              "Procurement"}
          </strong>
        </div>

        <div>
          <span>Standards</span>
          <strong>
            {standards.length}
          </strong>
        </div>

        <div>
          <span>Status</span>
          <strong>Analyzed</strong>
        </div>
      </div>

      {data?.summary && (
        <div className="summary-box">
          <strong>AI Summary</strong>
          <p>{data.summary}</p>
        </div>
      )}

      {standards.length > 0 && (
        <div className="mini-results">
          {standards.map((item, index) => (
            <StandardCard
              key={
                getStandardId(item) ||
                `analysis-${index}`
              }
              standard={item}
            />
          ))}
        </div>
      )}

      {!standards.length && (
        <EmptyState
          icon={AlertTriangle}
          title="No standards returned"
          text="The backend did not return standard records for this specification."
        />
      )}
    </div>
  );
}

/* =========================================================
   RECOMMENDATION
========================================================= */

function RecommendationPage({
  lang,
}: {
  lang: Lang;
}) {
  const [text, setText] = useState(
    "We are preparing a procurement requirement for OPC cement used in reinforced concrete construction."
  );

  const [results, setResults] = useState<Standard[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  async function recommend() {
    if (!text.trim()) return;

    setLoading(true);
    setError("");

    try {
      const data = await api.recommend(
        text,
        lang
      );

      setResults(listFromResponse(data));
    } catch (err: any) {
      setError(
        err?.message ||
          "Unable to generate recommendations."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageHeader
      eyebrow="AI RECOMMENDATION"
      title="Find Applicable Standards"
      text="Describe what you are buying or specifying. AI BIS SENSOR recommends potentially applicable Indian Standards."
    >
      <div className="recommend-card">
        <div className="card-title">
          <Sparkles size={21} />

          <div>
            <h3>Procurement Requirement</h3>
            <p>
              Describe the product and its intended use.
            </p>
          </div>
        </div>

        <textarea
          rows={8}
          value={text}
          onChange={(e) =>
            setText(e.target.value)
          }
        />

        <div className="input-actions">
          <button
            className="secondary-button"
            onClick={() =>
              setText(
                "Outdoor LED street lighting luminaire for roads, with protection against dust and water."
              )
            }
          >
            Lighting Example
          </button>

          <button
            className="secondary-button"
            onClick={() =>
              setText(
                "EV charging station for electric vehicles with AC charging and outdoor installation."
              )
            }
          >
            EV Example
          </button>

          <button
            className="primary-button"
            onClick={recommend}
            disabled={loading}
          >
            {loading ? (
              <RefreshCw
                size={18}
                className="spin"
              />
            ) : (
              <Sparkles size={18} />
            )}

            Recommend Standards
          </button>
        </div>
      </div>

      {error && <ErrorBox message={error} />}

      <div className="results-heading">
        <h2>Recommended Standards</h2>

        {results.length > 0 && (
          <span className="result-count">
            {results.length} results
          </span>
        )}
      </div>

      {loading ? (
        <Loading />
      ) : results.length ? (
        <div className="standard-list">
          {results.map((standard, index) => (
            <StandardCard
              key={
                getStandardId(standard) ||
                `recommend-${index}`
              }
              standard={standard}
              recommended
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Sparkles}
          title="No recommendations yet"
          text="Submit a procurement requirement to generate recommendations."
        />
      )}
    </PageHeader>
  );
}

/* =========================================================
   COMPARE
========================================================= */

function ComparePage({ lang }: { lang: Lang }) {
  const [ids, setIds] = useState(
    "IS 269:2015, IS 1489:2015"
  );

  const [results, setResults] = useState<Standard[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  async function compare() {
    const standardIds = ids
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (!standardIds.length) return;

    setLoading(true);
    setError("");

    try {
      const data =
        await api.compareStandards(
          standardIds
        );

      setResults(listFromResponse(data));
    } catch (err: any) {
      setError(
        err?.message ||
          "Unable to compare standards."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageHeader
      eyebrow="STANDARD COMPARISON"
      title="Compare Indian Standards"
      text="Compare applicable standards to understand scope, requirements and evidence."
    >
      <div className="compare-input-card">
        <div className="card-title">
          <GitCompare size={20} />

          <div>
            <h3>Standard IDs</h3>
            <p>
              Enter standard numbers separated by commas.
            </p>
          </div>
        </div>

        <input
          value={ids}
          onChange={(e) =>
            setIds(e.target.value)
          }
          placeholder="IS 269:2015, IS 1489:2015"
        />

        <button
          className="primary-button"
          onClick={compare}
          disabled={loading}
        >
          {loading ? (
            <RefreshCw
              size={18}
              className="spin"
            />
          ) : (
            <GitCompare size={18} />
          )}

          Compare
        </button>
      </div>

      {error && <ErrorBox message={error} />}

      {loading ? (
        <Loading />
      ) : results.length ? (
        <ComparisonTable standards={results} />
      ) : (
        <EmptyState
          icon={GitCompare}
          title="Ready for comparison"
          text="Enter two or more standards and click Compare."
        />
      )}
    </PageHeader>
  );
}

function ComparisonTable({
  standards,
}: {
  standards: Standard[];
}) {
  return (
    <div className="comparison-wrapper">
      <div className="comparison-grid">
        {standards.map((item, index) => (
          <div
            className="comparison-column"
            key={
              getStandardId(item) ||
              `compare-${index}`
            }
          >
            <div className="comparison-top">
              <span className="standard-pill">
                {getStandardNumber(item)}
              </span>

              <h3>
                {getStandardTitle(item)}
              </h3>

              <p>
                {item.description ||
                  item.scope ||
                  "Indian Standard for specified requirements."}
              </p>
            </div>

            <div className="comparison-section">
              <span>Edition / Year</span>

              <strong>
                {item.edition ||
                  item.year ||
                  "—"}
              </strong>
            </div>

            <div className="comparison-section">
              <span>Domain</span>

              <strong>
                {item.domain ||
                  item.category ||
                  "—"}
              </strong>
            </div>

            <div className="comparison-section">
              <span>Status</span>

              <strong>
                {item.status || "Active"}
              </strong>
            </div>

            <div className="comparison-section">
              <span>Scope</span>

              <p>
                {item.scope ||
                  item.description ||
                  "Scope information available from BIS reference."}
              </p>
            </div>

            {getStandardUrl(item) && (
              <a
                className="official-link"
                href={getStandardUrl(item)}
                target="_blank"
                rel="noreferrer"
              >
                Official BIS Evidence
                <ExternalLink size={15} />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   SAFETY
========================================================= */

function SafetyPage({ lang }: { lang: Lang }) {
  const [text, setText] = useState(
    "Outdoor electrical installation for LED lighting."
  );

  const [result, setResult] = useState<any>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  async function generateChecklist() {
    setLoading(true);
    setError("");

    try {
      const data = await api.safety({
        text,
        language: lang,
      });

      setResult(data);
    } catch (err: any) {
      setError(
        err?.message ||
          "Unable to generate safety checklist."
      );
    } finally {
      setLoading(false);
    }
  }

  const items: string[] =
    result?.checklist ||
    result?.items ||
    result?.requirements ||
    [];

  return (
    <PageHeader
      eyebrow="SAFETY & COMPLIANCE"
      title="Safety Checklist"
      text="Generate practical safety and compliance checkpoints for procurement requirements."
    >
      <div className="safety-grid">
        <div className="input-card">
          <div className="card-title">
            <ShieldCheck size={20} />

            <div>
              <h3>Requirement</h3>
              <p>
                Enter the product or installation details.
              </p>
            </div>
          </div>

          <textarea
            rows={9}
            value={text}
            onChange={(e) =>
              setText(e.target.value)
            }
          />

          <button
            className="primary-button"
            onClick={generateChecklist}
            disabled={loading}
          >
            {loading ? (
              <RefreshCw
                size={18}
                className="spin"
              />
            ) : (
              <ShieldCheck size={18} />
            )}

            Generate Checklist
          </button>
        </div>

        <div className="info-card">
          <div className="card-title">
            <CheckCircle2 size={20} />

            <div>
              <h3>Safety Checks</h3>
              <p>
                Review before procurement or installation.
              </p>
            </div>
          </div>

          {loading && <Loading />}

          {!loading &&
            result &&
            items.length > 0 && (
              <div className="checklist">
                {items.map((item, index) => (
                  <div
                    className="check-item"
                    key={index}
                  >
                    <CheckCircle2 size={18} />

                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}

          {!loading &&
            (!result || !items.length) && (
              <div className="placeholder">
                <ShieldCheck size={40} />

                <h3>Safety-first procurement</h3>

                <p>
                  Generate a checklist from your requirement.
                </p>
              </div>
            )}
        </div>
      </div>

      {error && <ErrorBox message={error} />}
    </PageHeader>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

function DashboardPage({ lang }: { lang: Lang }) {
  const capabilities: {
    icon: IconType;
    title: string;
    value: string;
    text: string;
  }[] = [
    {
      icon: Building2,
      title: "Construction",
      value: "Active",
      text: "Cement, concrete and construction standards",
    },
    {
      icon: Lightbulb,
      title: "Lighting",
      value: "Active",
      text: "Luminaires and road lighting standards",
    },
    {
      icon: Zap,
      title: "Electrical",
      value: "Active",
      text: "Wiring, cables and electrical safety",
    },
    {
      icon: Car,
      title: "EV",
      value: "Active",
      text: "Electric vehicle charging requirements",
    },
    {
      icon: Droplets,
      title: "Water",
      value: "Active",
      text: "Water quality and supply standards",
    },
    {
      icon: Utensils,
      title: "Food",
      value: "Active",
      text: "Food and drinking-water related standards",
    },
    {
      icon: HardHat,
      title: "Safety",
      value: "Active",
      text: "Safety and protective requirements",
    },
    {
      icon: Cpu,
      title: "Engineering",
      value: "Active",
      text: "General engineering standards",
    },
  ];

  return (
    <PageHeader
      eyebrow="PLATFORM DASHBOARD"
      title="Standards Intelligence Dashboard"
      text="Overview of AI BIS SENSOR capabilities and supported procurement domains."
    >
      <div className="dashboard-stats">
        <StatCard
          value="25+"
          label="Standards Domains"
        />

        <StatCard
          value="AI"
          label="Semantic Matching"
        />

        <StatCard
          value="BIS"
          label="Evidence Links"
        />

        <StatCard
          value="24/7"
          label="Procurement Support"
        />
      </div>

      <div className="section-heading dashboard-heading">
        <span className="eyebrow">
          COVERAGE
        </span>

        <h2>Supported procurement domains</h2>
      </div>

      <div className="capability-grid">
        {capabilities.map((item) => {
          const Icon = item.icon;

          return (
            <div
              className="capability-card"
              key={item.title}
            >
              <div className="feature-icon">
                <Icon size={22} />
              </div>

              <div>
                <h3>{item.title}</h3>

                <span className="active-label">
                  {item.value}
                </span>

                <p>{item.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </PageHeader>
  );
}

function StatCard({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="stat-card">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

/* =========================================================
   SHARED COMPONENTS
========================================================= */

function PageHeader({
  eyebrow,
  title,
  text,
  children,
}: {
  eyebrow: string;
  title: string;
  text: string;
  children: React.ReactNode;
}) {
  return (
    <section className="page">
      <div className="page-heading">
        <span className="eyebrow">{eyebrow}</span>

        <h1>{title}</h1>

        <p>{text}</p>
      </div>

      {children}
    </section>
  );
}

function StandardCard({
  standard,
  recommended = false,
}: {
  standard: Standard;
  recommended?: boolean;
}) {
  const url = getStandardUrl(standard);

  const score = getStandardScore(standard);

  return (
    <div className="standard-card">
      <div className="standard-main">
        <div className="standard-topline">
          <span className="standard-pill">
            {getStandardNumber(standard)}
          </span>

          {recommended && (
            <span className="recommended-pill">
              <Sparkles size={13} />
              Recommended
            </span>
          )}

          {score !== null && (
            <span className="score-pill">
              {score}% match
            </span>
          )}
        </div>

        <h3>
          {getStandardTitle(standard)}
        </h3>

        <p>
          {standard.description ||
            standard.scope ||
            "Applicable Indian Standard reference."}
        </p>

        <div className="standard-meta">
          <span>
            <strong>Edition:</strong>{" "}
            {standard.edition ||
              standard.year ||
              "—"}
          </span>

          <span>
            <strong>Domain:</strong>{" "}
            {standard.domain ||
              standard.category ||
              "—"}
          </span>

          <span>
            <strong>Status:</strong>{" "}
            {standard.status ||
              "Active"}
          </span>
        </div>

        {(standard.reason ||
          standard.why) && (
          <div className="reason-box">
            <Sparkles size={15} />

            <span>
              {standard.reason ||
                standard.why}
            </span>
          </div>
        )}
      </div>

      {url && (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="bis-link"
        >
          <span>
            <ShieldCheck size={16} />
            Official BIS Evidence
          </span>

          <ExternalLink size={15} />
        </a>
      )}
    </div>
  );
}

function Loading() {
  return (
    <div className="loading">
      <RefreshCw
        size={24}
        className="spin"
      />

      <span>
        Analyzing standards...
      </span>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  text,
}: {
  icon: IconType;
  title: string;
  text: string;
}) {
  const Icon = icon;

  return (
    <div className="empty-state">
      <div className="empty-icon">
        <Icon size={30} />
      </div>

      <h3>{title}</h3>

      <p>{text}</p>
    </div>
  );
}

function ErrorBox({
  message,
}: {
  message: string;
}) {
  return (
    <div className="error-box">
      <AlertTriangle size={19} />

      <div>
        <strong>Something went wrong</strong>
        <p>{message}</p>
      </div>
    </div>
  );
}

/* =========================================================
   CSS
========================================================= */

const styles = `
* {
  box-sizing: border-box;
}

:root {
  font-family:
    Inter,
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;

  color: #172033;
  background: #f6f8fc;
}

body {
  margin: 0;
  background: #f6f8fc;
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
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 50;

  height: 72px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 28px;

  background: rgba(255,255,255,.96);
  border-bottom: 1px solid #e6eaf1;

  backdrop-filter: blur(14px);
}

.brand {
  display: flex;
  align-items: center;
  gap: 11px;

  cursor: pointer;

  min-width: 220px;
}

.brand-icon {
  width: 42px;
  height: 42px;

  display: grid;
  place-items: center;

  border-radius: 12px;

  background: #102a43;
  color: white;
}

.brand-title {
  font-weight: 800;
  letter-spacing: .4px;
}

.brand-subtitle {
  color: #7a8597;
  font-size: 11px;
  margin-top: 2px;
}

.desktop-nav {
  display: flex;
  align-items: center;
  gap: 3px;
}

.nav-button {
  display: flex;
  align-items: center;
  gap: 7px;

  border: 0;
  background: transparent;

  color: #667085;

  padding: 10px 11px;

  border-radius: 9px;

  font-size: 13px;
}

.nav-button:hover {
  background: #f0f3f8;
  color: #172033;
}

.nav-button.active {
  background: #e9f0f8;
  color: #102a43;
  font-weight: 700;
}

.top-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.language-control {
  display: flex;
  align-items: center;
  gap: 5px;

  border: 1px solid #dce2eb;
  border-radius: 8px;

  padding: 7px 9px;

  color: #596579;
}

.language-control select {
  border: 0;
  outline: 0;
  background: transparent;
  color: #27364a;
  font-size: 13px;
}

.mobile-menu-button {
  display: none;

  border: 0;
  background: transparent;
}

.mobile-nav {
  display: none;
}

.hero {
  min-height: 590px;

  display: grid;
  grid-template-columns: 1.05fr .95fr;
  gap: 50px;

  align-items: center;

  padding: 80px max(6vw, 30px);

  background:
    radial-gradient(
      circle at 85% 20%,
      rgba(70, 126, 170, .18),
      transparent 35%
    ),
    linear-gradient(
      135deg,
      #f8fbff,
      #edf3f9
    );
}

.hero-content {
  max-width: 720px;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;

  padding: 8px 12px;

  border-radius: 999px;

  background: white;
  border: 1px solid #dce5ef;

  color: #315675;

  font-size: 12px;
  font-weight: 700;
}

.hero h1 {
  margin: 22px 0 16px;

  font-size: clamp(42px, 6vw, 72px);

  line-height: 1.02;

  letter-spacing: -3px;
}

.hero h1 span {
  color: #2d668e;
}

.hero p {
  max-width: 680px;

  color: #667085;

  font-size: 17px;
  line-height: 1.75;
}

.hero-buttons {
  display: flex;
  flex-wrap: wrap;

  gap: 10px;

  margin-top: 28px;
}

.primary-button,
.secondary-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  border-radius: 9px;

  padding: 12px 17px;

  font-weight: 700;

  transition: .2s ease;
}

.primary-button {
  border: 1px solid #102a43;

  background: #102a43;
  color: white;
}

.primary-button:hover {
  background: #173d5d;
  transform: translateY(-1px);
}

.primary-button:disabled {
  opacity: .55;
  cursor: not-allowed;
}

.secondary-button {
  border: 1px solid #ccd5e1;
  background: white;
  color: #27364a;
}

.secondary-button:hover {
  background: #f3f6fa;
}

.hero-stats {
  display: flex;
  gap: 35px;

  margin-top: 42px;
}

.hero-stats div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.hero-stats strong {
  font-size: 24px;
}

.hero-stats span {
  color: #7a8597;
  font-size: 12px;
}

.hero-visual {
  display: flex;
  justify-content: center;
}

.sensor-card {
  width: min(450px, 100%);

  padding: 25px;

  border-radius: 18px;

  background: white;

  border: 1px solid #dce4ed;

  box-shadow:
    0 30px 80px rgba(35, 60, 80, .13);
}

.sensor-header {
  display: flex;
  align-items: center;
  gap: 12px;

  padding-bottom: 22px;

  border-bottom: 1px solid #edf0f4;
}

.sensor-icon {
  width: 46px;
  height: 46px;

  display: grid;
  place-items: center;

  border-radius: 12px;

  background: #e9f2f8;
  color: #285b7f;
}

.sensor-header strong,
.sensor-header span {
  display: block;
}

.sensor-header span {
  color: #8993a3;
  font-size: 11px;
  margin-top: 3px;
}

.online-dot {
  width: 9px;
  height: 9px;

  margin-left: auto;

  border-radius: 50%;

  background: #37a169;
}

.sensor-line {
  display: flex;
  justify-content: space-between;

  gap: 15px;

  padding: 17px 0;

  border-bottom: 1px solid #f0f2f5;

  font-size: 13px;
}

.sensor-line span {
  color: #8993a3;
}

.sensor-line b {
  text-align: right;
}

.confidence {
  margin-top: 20px;
}

.confidence > div:first-child {
  display: flex;
  justify-content: space-between;

  font-size: 12px;
}

.confidence span {
  color: #7d8797;
}

.progress {
  height: 7px;

  margin-top: 8px;

  overflow: hidden;

  border-radius: 20px;

  background: #edf0f4;
}

.progress div {
  height: 100%;

  border-radius: inherit;

  background: #3c759d;
}

.sensor-result {
  display: flex;
  align-items: center;
  gap: 10px;

  margin-top: 20px;
  padding: 13px;

  border-radius: 9px;

  background: #f0f7f3;

  color: #27734c;
}

.sensor-result strong,
.sensor-result span {
  display: block;
}

.sensor-result span {
  color: #62806f;
  font-size: 11px;
  margin-top: 2px;
}

.section {
  padding: 90px max(6vw, 30px);
}

.section-heading {
  max-width: 720px;
  margin-bottom: 38px;
}

.eyebrow {
  display: inline-block;

  color: #47789c;

  font-size: 11px;
  font-weight: 800;

  letter-spacing: 1.3px;
}

.section-heading h2 {
  margin: 10px 0;

  font-size: 38px;

  letter-spacing: -1.3px;
}

.section-heading p {
  color: #718096;

  line-height: 1.7;
}

.feature-grid {
  display: grid;

  grid-template-columns:
    repeat(3, minmax(0, 1fr));

  gap: 17px;
}

.feature-card {
  text-align: left;

  border: 1px solid #e0e6ee;

  background: white;

  border-radius: 14px;

  padding: 23px;

  min-height: 205px;

  transition: .2s ease;
}

.feature-card:hover {
  transform: translateY(-3px);

  border-color: #b9c9d8;

  box-shadow:
    0 14px 35px rgba(30,50,70,.08);
}

.feature-icon {
  width: 43px;
  height: 43px;

  display: grid;
  place-items: center;

  border-radius: 11px;

  background: #edf3f7;

  color: #2e6286;

  flex: 0 0 auto;
}

.feature-card h3 {
  margin: 18px 0 8px;
}

.feature-card p {
  color: #788394;

  line-height: 1.55;

  font-size: 13px;
}

.feature-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;

  color: #2d668e;

  font-size: 12px;
  font-weight: 700;
}

.dark-section {
  background: #102a43;
  color: white;
}

.section-heading.light p {
  color: #b9c8d6;
}

.workflow {
  display: grid;
  grid-template-columns: repeat(4, 1fr);

  gap: 20px;
}

.workflow-step {
  padding: 25px;

  border: 1px solid rgba(255,255,255,.1);

  border-radius: 14px;

  background: rgba(255,255,255,.04);
}

.workflow-number {
  color: #9db7c9;

  font-size: 12px;
  font-weight: 800;

  margin-bottom: 25px;
}

.workflow-step h3 {
  margin: 18px 0 8px;
}

.workflow-step p {
  color: #b9c8d6;

  font-size: 13px;
  line-height: 1.6;
}

.page {
  max-width: 1200px;

  margin: auto;

  padding: 65px 25px 90px;
}

.page-heading {
  max-width: 800px;

  margin-bottom: 40px;
}

.page-heading h1 {
  margin: 10px 0;

  font-size: clamp(36px, 5vw, 54px);

  letter-spacing: -2px;
}

.page-heading p {
  color: #707b8d;

  line-height: 1.7;

  font-size: 16px;
}

.search-panel {
  display: grid;

  grid-template-columns: 1fr 180px auto;

  gap: 10px;

  padding: 14px;

  background: white;

  border: 1px solid #e0e6ee;

  border-radius: 13px;
}

.search-input {
  display: flex;
  align-items: center;
  gap: 10px;

  padding: 0 12px;

  border: 1px solid #dce3eb;

  border-radius: 8px;

  color: #8490a0;
}

.search-input input {
  width: 100%;

  border: 0;
  outline: 0;

  padding: 12px 0;

  background: transparent;
}

.select-input,
.compare-input-card input {
  border: 1px solid #dce3eb;

  outline: 0;

  border-radius: 8px;

  padding: 12px;

  background: white;

  color: #27364a;
}

.example-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 7px;

  margin: 13px 0 35px;

  font-size: 12px;
}

.example-row span {
  color: #8791a0;
}

.example-row button {
  border: 1px solid #dce4ec;

  background: white;

  color: #4f6072;

  padding: 6px 9px;

  border-radius: 6px;

  font-size: 11px;
}

.results-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin: 30px 0 15px;
}

.results-heading h2 {
  font-size: 21px;
}

.result-count {
  color: #7b8797;
  font-size: 12px;
}

.standard-list {
  display: flex;
  flex-direction: column;
  gap: 13px;
}

.standard-card {
  background: white;

  border: 1px solid #e0e6ee;

  border-radius: 13px;

  padding: 21px;
}

.standard-topline {
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  gap: 7px;
}

.standard-pill,
.recommended-pill,
.score-pill,
.active-label {
  display: inline-flex;
  align-items: center;
  gap: 5px;

  padding: 5px 8px;

  border-radius: 6px;

  font-size: 10px;

  font-weight: 800;
}

.standard-pill {
  background: #e9f1f7;
  color: #315c7a;
}

.recommended-pill {
  background: #eef8f1;
  color: #29704a;
}

.score-pill {
  background: #f5f0df;
  color: #79682f;
}

.standard-card h3 {
  margin: 13px 0 7px;

  font-size: 19px;
}

.standard-card p {
  color: #707b8d;

  line-height: 1.6;

  font-size: 13px;
}

.standard-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;

  margin-top: 15px;

  color: #687588;

  font-size: 11px;
}

.standard-meta strong {
  color: #3b4656;
}

.bis-link {
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-top: 18px;

  padding-top: 14px;

  border-top: 1px solid #edf0f3;

  color: #286187;

  text-decoration: none;

  font-size: 12px;

  font-weight: 700;
}

.bis-link span {
  display: flex;
  align-items: center;
  gap: 7px;
}

.reason-box {
  display: flex;
  gap: 8px;

  margin-top: 15px;
  padding: 11px;

  border-radius: 8px;

  background: #f5f8fb;

  color: #526273;

  font-size: 12px;
}

.analysis-grid,
.safety-grid {
  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 18px;
}

.input-card,
.info-card,
.recommend-card,
.compare-input-card {
  background: white;

  border: 1px solid #e0e6ee;

  border-radius: 14px;

  padding: 22px;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 10px;

  margin-bottom: 17px;

  color: #2e6286;
}

.card-title h3 {
  margin: 0;

  color: #172033;
  font-size: 16px;
}

.card-title p {
  margin: 3px 0 0;

  color: #8a94a3;

  font-size: 11px;
}

textarea {
  width: 100%;

  resize: vertical;

  border: 1px solid #dce3eb;

  border-radius: 9px;

  outline: 0;

  padding: 13px;

  color: #27364a;

  line-height: 1.6;
}

textarea:focus,
input:focus,
select:focus {
  border-color: #8eafc5;

  box-shadow:
    0 0 0 3px rgba(60,117,157,.08);
}

.input-actions {
  display: flex;

  flex-wrap: wrap;

  justify-content: flex-end;

  gap: 8px;

  margin-top: 12px;
}

.placeholder {
  min-height: 280px;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  text-align: center;

  color: #94a0af;
}

.placeholder h3 {
  color: #4c5868;
  margin: 15px 0 5px;
}

.placeholder p {
  max-width: 300px;

  font-size: 12px;

  line-height: 1.6;
}

.analysis-summary {
  display: grid;

  grid-template-columns: repeat(3, 1fr);

  gap: 8px;

  margin-bottom: 15px;
}

.analysis-summary div {
  padding: 13px;

  border-radius: 9px;

  background: #f5f8fb;
}

.analysis-summary span,
.analysis-summary strong {
  display: block;
}

.analysis-summary span {
  color: #8893a1;

  font-size: 10px;
}

.analysis-summary strong {
  margin-top: 4px;

  font-size: 13px;
}

.summary-box {
  padding: 13px;

  border-radius: 9px;

  background: #f4f8fb;
}

.summary-box strong {
  font-size: 12px;
}

.summary-box p {
  margin-bottom: 0;
}

.mini-results {
  margin-top: 13px;

  display: flex;
  flex-direction: column;
  gap: 10px;
}

.mini-results .standard-card {
  padding: 15px;
}

.recommend-card {
  margin-bottom: 30px;
}

.recommend-card textarea {
  margin-bottom: 2px;
}

.compare-input-card {
  display: grid;

  grid-template-columns: 1fr auto;

  gap: 12px;

  margin-bottom: 30px;
}

.compare-input-card .card-title {
  grid-column: 1 / -1;
}

.comparison-wrapper {
  overflow-x: auto;
}

.comparison-grid {
  display: grid;

  grid-template-columns:
    repeat(
      auto-fit,
      minmax(280px, 1fr)
    );

  gap: 13px;

  min-width: 650px;
}

.comparison-column {
  background: white;

  border: 1px solid #e0e6ee;

  border-radius: 13px;

  overflow: hidden;
}

.comparison-top {
  padding: 21px;

  border-bottom: 1px solid #edf0f3;
}

.comparison-top h3 {
  margin: 12px 0 7px;

  font-size: 17px;
}

.comparison-top p {
  color: #748091;

  font-size: 12px;

  line-height: 1.6;
}

.comparison-section {
  padding: 15px 21px;

  border-bottom: 1px solid #edf0f3;
}

.comparison-section span {
  display: block;

  color: #8993a2;

  font-size: 10px;

  margin-bottom: 5px;
}

.comparison-section strong,
.comparison-section p {
  font-size: 12px;

  line-height: 1.55;
}

.comparison-section p {
  color: #687588;
}

.official-link {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 15px 21px;

  color: #286187;

  text-decoration: none;

  font-size: 11px;

  font-weight: 700;
}

.safety-grid {
  margin-bottom: 25px;
}

.checklist {
  display: flex;
  flex-direction: column;

  gap: 8px;
}

.check-item {
  display: flex;
  align-items: flex-start;

  gap: 9px;

  padding: 12px;

  border-radius: 8px;

  background: #f3f8f5;

  color: #355848;

  font-size: 12px;

  line-height: 1.5;
}

.check-item svg {
  flex: 0 0 auto;
  margin-top: 1px;
}

.error-box {
  display: flex;
  align-items: flex-start;

  gap: 10px;

  margin-top: 15px;
  padding: 14px;

  border: 1px solid #efd0d0;

  border-radius: 9px;

  background: #fff6f6;

  color: #9b3b3b;
}

.error-box strong {
  font-size: 12px;
}

.error-box p {
  margin: 3px 0 0;

  font-size: 11px;
  line-height: 1.5;
}

.loading {
  min-height: 180px;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 10px;

  color: #718096;

  font-size: 13px;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty-state {
  display: flex;
  flex-direction: column;

  align-items: center;
  text-align: center;

  padding: 70px 20px;

  color: #8b96a5;
}

.empty-icon {
  width: 58px;
  height: 58px;

  display: grid;
  place-items: center;

  border-radius: 15px;

  background: #edf3f7;

  color: #3c7195;
}

.empty-state h3 {
  margin: 15px 0 5px;

  color: #4a5667;
}

.empty-state p {
  max-width: 390px;

  font-size: 12px;

  line-height: 1.6;
}

.dashboard-stats {
  display: grid;

  grid-template-columns: repeat(4, 1fr);

  gap: 13px;

  margin-bottom: 60px;
}

.stat-card {
  background: white;

  border: 1px solid #e0e6ee;

  border-radius: 13px;

  padding: 22px;
}

.stat-card strong {
  display: block;

  font-size: 29px;

  color: #2d668e;
}

.stat-card span {
  color: #7d8797;

  font-size: 11px;
}

.dashboard-heading {
  margin-bottom: 20px;
}

.capability-grid {
  display: grid;

  grid-template-columns:
    repeat(4, 1fr);

  gap: 13px;
}

.capability-card {
  display: flex;

  gap: 13px;

  background: white;

  border: 1px solid #e0e6ee;

  border-radius: 13px;

  padding: 18px;
}

.capability-card h3 {
  margin: 0 0 4px;

  font-size: 15px;
}

.active-label {
  padding: 3px 6px;

  background: #eef8f1;

  color: #29704a;
}

.capability-card p {
  color: #7b8797;

  font-size: 11px;

  line-height: 1.5;
}

footer {
  display: flex;
  justify-content: space-between;

  gap: 30px;

  padding: 28px max(6vw, 25px);

  background: #0b2033;

  color: #aabaca;

  font-size: 11px;
}

footer div:first-child {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

footer strong {
  color: white;
}

@media (max-width: 1050px) {
  .desktop-nav {
    display: none;
  }

  .mobile-menu-button {
    display: block;
  }

  .mobile-nav {
    position: fixed;

    top: 72px;
    left: 0;
    right: 0;

    z-index: 40;

    display: flex;
    flex-direction: column;

    padding: 12px;

    background: white;

    border-bottom: 1px solid #e0e6ee;

    box-shadow:
      0 12px 30px rgba(0,0,0,.08);
  }

  .mobile-nav button {
    display: flex;
    align-items: center;
    gap: 9px;

    border: 0;

    background: white;

    padding: 12px;

    text-align: left;

    color: #4f5c6d;
  }

  .mobile-nav button:hover {
    background: #f2f5f8;
  }

  .hero {
    grid-template-columns: 1fr;

    padding-top: 60px;
  }

  .hero-visual {
    justify-content: flex-start;
  }

  .feature-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .workflow {
    grid-template-columns: repeat(2, 1fr);
  }

  .capability-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 700px) {
  .topbar {
    padding: 0 16px;
  }

  .brand {
    min-width: auto;
  }

  .brand-subtitle {
    display: none;
  }

  .language-control {
    display: none;
  }

  .hero {
    padding: 55px 20px;

    min-height: auto;
  }

  .hero h1 {
    letter-spacing: -2px;
  }

  .hero p {
    font-size: 15px;
  }

  .hero-stats {
    gap: 18px;
  }

  .section,
  .page {
    padding-left: 18px;
    padding-right: 18px;
  }

  .section-heading h2 {
    font-size: 29px;
  }

  .feature-grid,
  .workflow,
  .analysis-grid,
  .safety-grid,
  .dashboard-stats,
  .capability-grid {
    grid-template-columns: 1fr;
  }

  .search-panel {
    grid-template-columns: 1fr;
  }

  .compare-input-card {
    grid-template-columns: 1fr;
  }

  .input-actions {
    justify-content: stretch;
  }

  .input-actions button {
    flex: 1;
  }

  footer {
    flex-direction: column;
  }
}
`;

export default App;


import React, { useEffect, useMemo, useState } from "react";
import {
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  Search,
  Mic,
  Upload,
  ShieldCheck,
  GitCompare,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Info,
  ExternalLink,
  Languages,
  Menu,
  X,
  SlidersHorizontal,
  FileText,
  Lightbulb,
  Database,
  ArrowRight,
  RefreshCw,
  Star,
  Check,
} from "lucide-react";

import { api } from "./api";
import { languages, Lang, tx } from "./i18n";

type Standard = any;

const examplePrompt =
  "Need applicable Indian standards for cement used in building construction.";

/* =========================================================
   HELPERS
========================================================= */

function localizedStandard(s: any, lang: Lang) {
  const tr = s?.translations?.[lang];

  return tr
    ? {
        ...s,
        title: tr.title,
        scope: tr.scope,
      }
    : s;
}

function getStandardId(s: any) {
  return s?.id || s?.standard_id || s?.standard?.id;
}

function getStandardNumber(s: any) {
  return (
    s?.is_number ||
    s?.standard_number ||
    s?.standard?.is_number ||
    "IS Standard"
  );
}

function getStandardTitle(s: any, lang: Lang) {
  const standard = s?.standard || s;
  return localizedStandard(standard, lang)?.title || "Indian Standard";
}

function getConfidence(item: any) {
  return Number(
    item?.confidence ??
      item?.match_score ??
      item?.applicability_score ??
      item?.score ??
      0
  );
}

/* =========================================================
   VOICE
========================================================= */

function startVoice(
  setText: (x: string) => void,
  lang: Lang,
  onError?: (message: string) => void
) {
  const SR =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;

  if (!SR) {
    onError?.("Voice input is not supported by this browser.");
    return;
  }

  try {
    const recognition = new SR();

    recognition.lang =
      lang === "hi"
        ? "hi-IN"
        : lang === "te"
        ? "te-IN"
        : lang === "ta"
        ? "ta-IN"
        : lang === "kn"
        ? "kn-IN"
        : lang === "mr"
        ? "mr-IN"
        : lang === "bn"
        ? "bn-IN"
        : "en-IN";

    recognition.interimResults = false;

    recognition.onresult = (e: any) => {
      setText(e.results[0][0].transcript);
    };

    recognition.onerror = () => {
      onError?.("Voice input could not be completed.");
    };

    recognition.start();
  } catch {
    onError?.("Unable to start voice input.");
  }
}

/* =========================================================
   LAYOUT
========================================================= */

function Layout({
  lang,
  setLang,
  children,
}: {
  lang: Lang;
  setLang: (x: Lang) => void;
  children: React.ReactNode;
}) {
  const [mobile, setMobile] = useState(false);
  const loc = useLocation();

  const nav = [
    ["/", "home"],
    ["/search", "search"],
    ["/analysis", "analysis"],
    ["/tender", "tender"],
    ["/explorer", "explorer"],
    ["/compare", "compare"],
    ["/recommend", "recommend"],
    ["/safety", "safety"],
    ["/evidence", "evidence"],
    ["/dashboard", "dashboard"],
    ["/settings", "settings"],
  ];

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand">
          <span className="brand-mark">B</span>
          <span>BIS SENSOR</span>
        </Link>

        <button
          className="mobile-menu"
          onClick={() => setMobile(!mobile)}
          aria-label="Menu"
        >
          {mobile ? <X /> : <Menu />}
        </button>

        <nav className={mobile ? "nav open" : "nav"}>
          {nav.map(([path, key]) => (
            <Link
              key={path}
              onClick={() => setMobile(false)}
              className={loc.pathname === path ? "active" : ""}
              to={path}
            >
              {tx(lang, key)}
            </Link>
          ))}
        </nav>

        <label className="lang">
          <Languages size={17} />

          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as Lang)}
            aria-label="Language"
          >
            {languages.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>
        </label>
      </header>

      <main>{children}</main>

      <footer>
        <span>BIS SENSOR</span>
        <span>{tx(lang, "disclaimer")}</span>
      </footer>
    </div>
  );
}

/* =========================================================
   HOME
========================================================= */

function Home({ lang }: { lang: Lang }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const run = async () => {
    setError("");

    const input = text.trim() || examplePrompt;

    setLoading(true);

    try {
      const r = await api.analyze(input, lang);
      setResult(r);
    } catch (e: any) {
      setError(e?.message || "Analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page home">
      <section className="hero">
        <div className="eyebrow">
          <span className="live-dot" />
          AI STANDARDS INTELLIGENCE
        </div>

        <h1>{tx(lang, "hero")}</h1>

        <p>{tx(lang, "heroSub")}</p>

        <div className="hero-input">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={tx(lang, "searchPlaceholder")}
            aria-label={tx(lang, "searchPlaceholder")}
          />

          <div className="input-actions">
            <button
              className="icon-btn"
              title={tx(lang, "voice")}
              onClick={() =>
                startVoice(setText, lang, (m) => setError(m))
              }
            >
              <Mic size={20} />
            </button>

            <Link className="secondary-btn" to="/tender">
              <Upload size={18} />
              {tx(lang, "upload")}
            </Link>

            <button
              className="primary-btn"
              disabled={loading}
              onClick={run}
            >
              {loading ? "Analyzing…" : tx(lang, "analyze")}
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div className="demo-row">
          <button
            className="text-btn"
            onClick={() => setText(examplePrompt)}
          >
            Try an example: “{examplePrompt}”
          </button>
        </div>
      </section>

      <section className="trust-strip">
        <div>
          <ShieldCheck />
          <b>Evidence-first</b>
          <span>Every major result has a source status.</span>
        </div>

        <div>
          <Database />
          <b>Standards graph</b>
          <span>Primary → related → test → safety.</span>
        </div>

        <div>
          <GitCompare />
          <b>Decision support</b>
          <span>Compare standards against requirements.</span>
        </div>
      </section>

      {error && <div className="alert danger">{error}</div>}

      {result ? (
        <AnalysisResult lang={lang} result={result} />
      ) : (
        <section className="feature-grid">
          {[
            [
              "Natural-language standards search",
              "Ask in normal language instead of remembering exact terminology.",
              Search,
            ],
            [
              "Incomplete-input guidance",
              "Identify important missing procurement information.",
              SlidersHorizontal,
            ],
            [
              "Simple explanations",
              "Understand technical requirements in plain language.",
              Lightbulb,
            ],
            [
              "Evidence separation",
              "Official and interpreted information are clearly separated.",
              ShieldCheck,
            ],
          ].map(([title, desc, Icon]) => {
            const IconComponent = Icon as any;

            return (
              <div
                className="card feature"
                key={title as string}
              >
                <IconComponent />
                <h3>{title as string}</h3>
                <p>{desc as string}</p>
              </div>
            );
          })}
        </section>
      )}
    </div>
  );
}

/* =========================================================
   ANALYSIS RESULT
========================================================= */

function AnalysisResult({
  lang,
  result,
}: {
  lang: Lang;
  result: any;
}) {
  const nav = useNavigate();

  const analysis = result?.analysis || {
    product: "Requirement",
    requirements: [],
    missing: [],
  };

  const recommendations = result?.recommendations || [];

  return (
    <section className="results">
      <div className="section-head">
        <div>
          <span className="eyebrow">ANALYSIS</span>
          <h2>{analysis.product || "Procurement Requirement"}</h2>
        </div>

        <span className="badge verified">STANDARDS ANALYSIS</span>
      </div>

      {analysis.requirements?.length > 0 && (
        <div className="requirement-grid">
          {analysis.requirements.map((r: any, index: number) => (
            <div
              className="req"
              key={`${r.name || "requirement"}-${index}`}
            >
              <CheckCircle2 />

              <span>
                <small>{r.name}</small>
                <b>{r.value}</b>
              </span>
            </div>
          ))}
        </div>
      )}

      {analysis.missing?.length > 0 && (
        <MissingQuestions
          lang={lang}
          missing={analysis.missing}
        />
      )}

      <h3>{tx(lang, "applicable")}</h3>

      {recommendations.length > 0 ? (
        <div className="standard-cards">
          {recommendations.map((r: any, index: number) => (
            <StandardCard
              key={getStandardId(r) || index}
              lang={lang}
              item={r}
              onClick={() =>
                nav(`/standards/${getStandardId(r)}`)
              }
            />
          ))}
        </div>
      ) : (
        <div className="empty card">
          <Info />
          <p>
            No applicable standards were returned. Try adding
            the product type, application, material, or technical
            requirement.
          </p>
        </div>
      )}
    </section>
  );
}

/* =========================================================
   MISSING QUESTIONS
========================================================= */

function MissingQuestions({
  lang,
  missing,
}: {
  lang: Lang;
  missing: any[];
}) {
  const [values, setValues] = useState<Record<string, string>>({});

  return (
    <div className="card missing-box">
      <div className="missing-title">
        <AlertTriangle />

        <div>
          <b>{tx(lang, "missing")}</b>
          <p>{tx(lang, "selectRequired")}</p>
        </div>
      </div>

      <div className="question-grid">
        {missing.map((q) => (
          <label key={q.key}>
            <span>{q.label}</span>

            <select
              value={values[q.key] || ""}
              onChange={(e) =>
                setValues({
                  ...values,
                  [q.key]: e.target.value,
                })
              }
            >
              <option value="">Select…</option>

              {(q.options || []).map((o: string) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </label>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   STANDARD CARD
========================================================= */

function StandardCard({
  lang,
  item,
  onClick,
}: {
  lang: Lang;
  item: any;
  onClick: () => void;
}) {
  const s = localizedStandard(item?.standard || item, lang);

  const confidence = getConfidence(item);

  return (
    <div className="card standard-card">
      <div className="standard-top">
        <div>
          <span className="is-number">
            {s?.is_number || "IS Standard"}
          </span>

          <h3>{s?.title || "Indian Standard"}</h3>
        </div>

        <span className="badge verified">
          {s?.verification_status || tx(lang, "official")}
        </span>
      </div>

      <p>
        {item?.why_it_matches ||
          item?.applicability ||
          s?.scope ||
          "Potentially relevant standard based on the supplied requirement."}
      </p>

      <div className="standard-meta">
        <span>
          Edition / Year <b>{s?.edition || "—"}</b>
        </span>

        <span>
          Confidence <b>{confidence}%</b>
        </span>
      </div>

      <div className="standard-actions">
        <button className="link-btn" onClick={onClick}>
          {tx(lang, "details")}
          <ChevronRight size={16} />
        </button>

        {s?.source_url && (
          <a
            className="link-btn"
            href={s.source_url}
            target="_blank"
            rel="noreferrer"
          >
            Official BIS evidence
            <ExternalLink size={15} />
          </a>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   SEARCH
========================================================= */

function SearchPage({ lang }: { lang: Lang }) {
  const [q, setQ] = useState("");
  const [domain, setDomain] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const doSearch = async () => {
    if (!q.trim()) {
      setError("Enter a product, material, requirement or IS number.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const r = await api.search(
        q.trim(),
        domain || undefined
      );

      setResults(r?.results || []);
    } catch (e: any) {
      setError(e?.message || "Search failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page
      title={tx(lang, "search")}
      intro="Search by product, requirement, domain or an IS identifier."
    >
      <div className="search-panel card">
        <div className="search-row">
          <Search />

          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && doSearch()
            }
            placeholder="e.g. cement, water pump, electrical cable, EV charger…"
          />

          <button
            className="primary-btn"
            onClick={doSearch}
            disabled={loading}
          >
            {loading ? "Searching…" : tx(lang, "search")}
          </button>
        </div>

        <div className="filter-row">
          <select
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          >
            <option value="">All domains</option>

            {[
              "Lighting & Electrical",
              "Electrical Safety",
              "Cables & Wires",
              "Water & Pumps",
              "Construction",
              "Mechanical",
              "Industrial Automation",
              "Textiles",
              "Food & Agriculture",
              "Medical Devices",
              "IT & Electronics",
              "Solar & Renewable Energy",
              "Fire & Safety",
              "Automotive",
              "Environment & Energy",
            ].map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="alert danger">{error}</div>}

      <div className="search-results">
        {results.map((s) => {
          const ls = localizedStandard(s, lang);

          return (
            <Link
              className="search-result card"
              to={`/standards/${s.id}`}
              key={s.id}
            >
              <div>
                <span className="is-number">
                  {ls.is_number}
                </span>

                <h3>{ls.title}</h3>

                <p>
                  {s.domain} · {s.product_category}
                </p>
              </div>

              <ChevronRight />
            </Link>
          );
        })}
      </div>

      {results.length === 0 && !loading && (
        <div className="empty card">
          <Info />

          <p>
            Search results will appear here. Try
            <b> cement for building construction</b>.
          </p>
        </div>
      )}
    </Page>
  );
}

/* =========================================================
   STANDARD DETAILS
========================================================= */

function StandardDetails({ lang }: { lang: Lang }) {
  const id = useLocation().pathname.split("/").pop()!;

  const [data, setData] = useState<any>();
  const [err, setErr] = useState("");

  useEffect(() => {
    setData(undefined);
    setErr("");

    api
      .standard(id)
      .then(setData)
      .catch((e) => setErr(e?.message || "Unable to load standard."));
  }, [id]);

  if (err) {
    return (
      <Page title="Standard details">
        <div className="alert danger">{err}</div>
      </Page>
    );
  }

  if (!data) {
    return (
      <Page title="Standard details">
        <div className="loading">Loading…</div>
      </Page>
    );
  }

  const s = localizedStandard(data.standard, lang);

  return (
    <Page
      title={s.is_number}
      intro="Complete standard record, scope, relationships and evidence."
    >
      <div className="detail-grid">
        <div className="card detail-main">
          <span className="is-number">{s.is_number}</span>

          <h2>{s.title}</h2>

          <div className="badge verified">
            {s.verification_status}
          </div>

          <dl>
            <dt>Edition / Year</dt>
            <dd>{s.edition || "—"}</dd>

            <dt>Status</dt>
            <dd>{s.status || "—"}</dd>

            <dt>Scope</dt>
            <dd>{s.scope || "—"}</dd>

            <dt>Domain</dt>
            <dd>{s.domain || "—"}</dd>

            <dt>Product category</dt>
            <dd>{s.product_category || "—"}</dd>
          </dl>
        </div>

        <aside className="card evidence-card">
          <h3>{tx(lang, "source")}</h3>

          <div className="evidence-badge">BIS</div>

          <p>
            {s.source_name || "Bureau of Indian Standards"}
          </p>

          {s.source_url && (
            <a
              className="primary-btn"
              href={s.source_url}
              target="_blank"
              rel="noreferrer"
            >
              Official BIS evidence
              <ExternalLink size={15} />
            </a>
          )}
        </aside>
      </div>

      <h3>{tx(lang, "related")}</h3>

      <div className="relationship-list">
        {(data.relationships || []).map((r: any) => {
          const rs = localizedStandard(r.standard, lang);

          return (
            <div
              className="card relation"
              key={r.standard.id}
            >
              <span className="relation-type">
                {r.relationship}
              </span>

              <span className="is-number">
                {rs.is_number}
              </span>

              <b>{rs.title}</b>
            </div>
          );
        })}
      </div>
    </Page>
  );
}

/* =========================================================
   COMPARE STANDARDS PAGE
========================================================= */

function ComparePage({ lang }: { lang: Lang }) {
  const [query, setQuery] = useState("cement for building construction");
  const [standards, setStandards] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingCompare, setLoadingCompare] = useState(false);
  const [error, setError] = useState("");

  const findStandards = async () => {
    if (!query.trim()) return;

    setError("");
    setLoadingSearch(true);

    try {
      const r = await api.search(query.trim());

      const found = r?.results || [];

      setStandards(found);

      setSelected(
        found
          .slice(0, 3)
          .map((s: any) => s.id)
          .filter(Boolean)
      );

      setRows([]);
    } catch (e: any) {
      setError(e?.message || "Unable to find standards.");
    } finally {
      setLoadingSearch(false);
    }
  };

  const toggleStandard = (id: string) => {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((x) => x !== id)
        : current.length < 4
        ? [...current, id]
        : current
    );
  };

  const compare = async () => {
    if (selected.length < 2) {
      setError("Select at least 2 standards to compare.");
      return;
    }

    setError("");
    setLoadingCompare(true);

    try {
      const result = await api.compareStandards(selected);

      setRows(
        result?.standards ||
          result?.results ||
          result?.comparisons ||
          []
      );
    } catch (e: any) {
      setError(e?.message || "Comparison failed.");
    } finally {
      setLoadingCompare(false);
    }
  };

  return (
    <Page
      title={tx(lang, "compare")}
      intro="Find relevant Indian Standards and compare their scope, edition, domain and applicability."
    >
      <div className="card search-panel">
        <div className="search-row">
          <Search />

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && findStandards()
            }
            placeholder="Search standards to compare…"
          />

          <button
            className="primary-btn"
            onClick={findStandards}
            disabled={loadingSearch}
          >
            {loadingSearch ? "Finding…" : "Find Standards"}
          </button>
        </div>
      </div>

      {error && <div className="alert danger">{error}</div>}

      {standards.length > 0 && (
        <div className="card compare-selector">
          <div className="section-head">
            <div>
              <span className="eyebrow">SELECT</span>
              <h2>Standards to compare</h2>
            </div>

            <span>
              {selected.length}/4 selected
            </span>
          </div>

          <div className="standard-select-grid">
            {standards.map((s) => {
              const active = selected.includes(s.id);
              const ls = localizedStandard(s, lang);

              return (
                <button
                  type="button"
                  className={`standard-select-card ${
                    active ? "selected" : ""
                  }`}
                  key={s.id}
                  onClick={() => toggleStandard(s.id)}
                >
                  <span className="is-number">
                    {ls.is_number}
                  </span>

                  <strong>{ls.title}</strong>

                  <small>
                    {s.domain} · {s.product_category}
                  </small>

                  {active && (
                    <span className="selected-check">
                      <Check size={16} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            className="primary-btn"
            onClick={compare}
            disabled={
              loadingCompare || selected.length < 2
            }
          >
            <GitCompare size={18} />

            {loadingCompare
              ? "Comparing…"
              : "Compare Selected Standards"}
          </button>
        </div>
      )}

      {rows.length > 0 && (
        <StandardComparisonTable
          lang={lang}
          rows={rows}
        />
      )}

      {standards.length === 0 && !loadingSearch && (
        <div className="empty card">
          <GitCompare />

          <p>
            Search for a product or requirement first.
            Example: <b>cement for building construction</b>.
          </p>
        </div>
      )}
    </Page>
  );
}

/* =========================================================
   COMPARISON TABLE
========================================================= */

function StandardComparisonTable({
  lang,
  rows,
}: {
  lang: Lang;
  rows: any[];
}) {
  const normalized = rows.map((item) =>
    item?.standard ? item.standard : item
  );

  const attributes = [
    {
      label: "IS Number",
      get: (s: any) => s?.is_number || "—",
    },
    {
      label: "Title",
      get: (s: any) =>
        localizedStandard(s, lang)?.title || "—",
    },
    {
      label: "Edition / Year",
      get: (s: any) => s?.edition || "—",
    },
    {
      label: "Status",
      get: (s: any) => s?.status || "—",
    },
    {
      label: "Domain",
      get: (s: any) => s?.domain || "—",
    },
    {
      label: "Product Category",
      get: (s: any) =>
        s?.product_category || "—",
    },
    {
      label: "Scope",
      get: (s: any) =>
        localizedStandard(s, lang)?.scope || "—",
    },
  ];

  return (
    <div className="card table-wrap">
      <div className="section-head">
        <div>
          <span className="eyebrow">COMPARISON</span>
          <h2>Standards side by side</h2>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Feature</th>

            {normalized.map((s: any, index: number) => (
              <th key={s?.id || index}>
                {s?.is_number || "Standard"}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {attributes.map((attribute) => (
            <tr key={attribute.label}>
              <td>
                <b>{attribute.label}</b>
              </td>

              {normalized.map((s: any, index: number) => (
                <td key={`${attribute.label}-${index}`}>
                  {attribute.get(s)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* =========================================================
   RECOMMENDATION PAGE
========================================================= */

function RecommendationPage({ lang }: { lang: Lang }) {
  const [text, setText] = useState(
    "cement for building construction"
  );

  const [domain, setDomain] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!text.trim()) {
      setError(
        "Enter a product or procurement specification."
      );
      return;
    }

    setError("");
    setLoading(true);

    try {
      const result = await api.recommend(
        text.trim(),
        lang
      );

      let recommendations =
        result?.recommendations ||
        result?.results ||
        [];

      if (
        recommendations.length === 0 &&
        result?.analysis
      ) {
        recommendations =
          result?.recommendations || [];
      }

      setResults(recommendations);
    } catch (e: any) {
      setError(
        e?.message || "Standards recommendation failed."
      );
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const quickExamples = useMemo(
    () => [
      "cement for building construction",
      "PVC electrical cable for residential wiring",
      "EV charging equipment",
      "drinking water supply",
      "concrete for structural construction",
      "industrial safety equipment",
    ],
    []
  );

  return (
    <Page
      title={tx(lang, "recommend")}
      intro="Enter a procurement requirement and BIS SENSOR recommends potentially applicable Indian Standards."
    >
      <div className="card recommendation-input">
        <div className="section-head">
          <div>
            <span className="eyebrow">
              STANDARDS RECOMMENDATION
            </span>

            <h2>What are you procuring?</h2>
          </div>

          <ShieldCheck />
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Describe the product, material or procurement requirement…"
          rows={5}
        />

        <div className="form-grid">
          <label>
            <span>Domain</span>

            <select
              value={domain}
              onChange={(e) =>
                setDomain(e.target.value)
              }
            >
              <option value="">Auto detect</option>
              <option>Construction</option>
              <option>Cables & Wires</option>
              <option>Water & Pumps</option>
              <option>Electrical Safety</option>
              <option>EV</option>
              <option>Food & Agriculture</option>
              <option>Fire & Safety</option>
              <option>Mechanical</option>
              <option>Medical Devices</option>
            </select>
          </label>
        </div>

        <button
          className="primary-btn"
          onClick={submit}
          disabled={loading}
        >
          {loading ? (
            <>
              <RefreshCw size={18} />
              Analyzing…
            </>
          ) : (
            <>
              <Star size={18} />
              {tx(lang, "generate")}
            </>
          )}
        </button>
      </div>

      <div className="quick-examples">
        <span>Examples:</span>

        {quickExamples.map((example) => (
          <button
            key={example}
            onClick={() => setText(example)}
          >
            {example}
          </button>
        ))}
      </div>

      {error && <div className="alert danger">{error}</div>}

      {results.length > 0 && (
        <section className="recommend-section">
          <div className="section-head">
            <div>
              <span className="eyebrow">
                RECOMMENDED STANDARDS
              </span>

              <h2>
                {results.length} potentially relevant
                standard
                {results.length === 1 ? "" : "s"}
              </h2>
            </div>
          </div>

          <div className="recommend-grid">
            {results.map((item, index) => {
              const standard =
                item?.standard || item;

              const confidence =
                getConfidence(item);

              return (
                <RecommendationCard
                  key={
                    getStandardId(item) ||
                    `recommendation-${index}`
                  }
                  lang={lang}
                  item={item}
                  rank={index + 1}
                  standard={standard}
                  confidence={confidence}
                />
              );
            })}
          </div>
        </section>
      )}

      {!loading && results.length === 0 && !error && (
        <div className="empty card">
          <Lightbulb />

          <p>
            Enter a requirement above to get applicable
            Indian Standard recommendations.
          </p>
        </div>
      )}
    </Page>
  );
}

/* =========================================================
   RECOMMENDATION CARD
========================================================= */

function RecommendationCard({
  lang,
  item,
  rank,
  standard,
  confidence,
}: {
  lang: Lang;
  item: any;
  rank: number;
  standard: any;
  confidence: number;
}) {
  const navigate = useNavigate();

  const s = localizedStandard(standard, lang);

  return (
    <div className="card recommend-card">
      <div className="rank">#{rank}</div>

      <span className="is-number">
        {s?.is_number || "IS Standard"}
      </span>

      <h3>{s?.title || "Indian Standard"}</h3>

      <div className="score-ring">
        {confidence}
        <small>/100</small>
      </div>

      <div className="recommend-meta">
        <span>
          <b>Edition:</b> {s?.edition || "—"}
        </span>

        <span>
          <b>Domain:</b> {s?.domain || "—"}
        </span>
      </div>

      <p>
        <strong>Why it matches:</strong>{" "}
        {item?.why_it_matches ||
          item?.applicability ||
          "The standard appears relevant to the supplied requirement."}
      </p>

      {item?.why_matters && (
        <p>
          <strong>Why it matters:</strong>{" "}
          {item.why_matters}
        </p>
      )}

      <div className="standard-actions">
        <button
          className="link-btn"
          onClick={() =>
            navigate(`/standards/${s.id}`)
          }
        >
          View standard
          <ChevronRight size={16} />
        </button>

        {s?.source_url && (
          <a
            className="link-btn"
            href={s.source_url}
            target="_blank"
            rel="noreferrer"
          >
            BIS Source
            <ExternalLink size={15} />
          </a>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   SAFETY
========================================================= */

function SafetyPage({ lang }: { lang: Lang }) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .safety({
        product: "Procurement item",
        requirements: ["Government procurement"],
        environment: "General",
      })
      .then((r) => setItems(r?.items || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Page
      title={tx(lang, "safety")}
      intro={
        tx(lang, "safetyIntro") +
        " " +
        tx(lang, "buyingIntro")
      }
    >
      <div className="notice">
        <ShieldCheck />

        <div>
          <b>Safety is a verification workflow</b>

          <p>
            Use each item to check product documentation,
            installation conditions and authoritative
            requirements before procurement.
          </p>
        </div>
      </div>

      {loading && (
        <div className="loading">Loading safety checklist…</div>
      )}

      <div className="checklist">
        {items.map((x) => (
          <div
            className="card checklist-item"
            key={x.title}
          >
            <CheckCircle2 />

            <div>
              <b>{x.title}</b>
              <p>{x.description}</p>
            </div>

            <span>{x.type}</span>
          </div>
        ))}
      </div>

      {!loading && items.length === 0 && (
        <div className="empty card">
          <Info />
          <p>No safety checklist items returned.</p>
        </div>
      )}
    </Page>
  );
}

/* =========================================================
   TENDER
========================================================= */

function TenderPage({ lang }: { lang: Lang }) {
  const [file, setFile] = useState<File>();
  const [res, setRes] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!file) return;

    setLoading(true);
    setError("");

    try {
      setRes(await api.tender(file));
    } catch (e: any) {
      setError(
        e?.message || "Tender analysis failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page
      title={tx(lang, "tender")}
      intro="Upload a PDF, DOCX or TXT tender. BIS SENSOR extracts requirements and identifies potentially applicable standards."
    >
      <div className="upload-card card">
        <FileText size={30} />

        <h3>Upload tender document</h3>

        <p>
          Supported: PDF, DOCX, TXT. Scanned PDFs may require
          OCR.
        </p>

        <input
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={(e) =>
            setFile(e.target.files?.[0])
          }
        />

        {file && <b>{file.name}</b>}

        <button
          className="primary-btn"
          disabled={!file || loading}
          onClick={submit}
        >
          {loading
            ? "Analyzing…"
            : "Run Tender Standards Review"}
        </button>
      </div>

      {error && (
        <div className="alert danger">{error}</div>
      )}

      {res && (
        <div className="card tender-result">
          <h3>Extracted product</h3>

          <p>
            {res?.review?.analysis?.product ||
              "Requirement extracted"}
          </p>

          <h3>{tx(lang, "applicable")}</h3>

          {(res?.review?.recommendations || []).map(
            (r: any) => (
              <div
                className="mini-standard"
                key={r.standard.id}
              >
                <span className="is-number">
                  {r.standard.is_number}
                </span>

                <p>
                  {r.applicability ||
                    r.why_it_matches}
                </p>

                <span>
                  {getConfidence(r)}%
                </span>
              </div>
            )
          )}
        </div>
      )}
    </Page>
  );
}

/* =========================================================
   EVIDENCE
========================================================= */

function EvidencePage({ lang }: { lang: Lang }) {
  return (
    <Page
      title={tx(lang, "evidence")}
      intro="Evidence is deliberately separated from AI interpretation. A missing source is shown as missing, never invented."
    >
      <div className="evidence-grid">
        {[
          [
            "OFFICIAL",
            "Authoritative publication or authority source.",
          ],
          [
            "VERIFIED",
            "A source whose identity and content have been checked.",
          ],
          [
            "THIRD-PARTY",
            "Seller, marketplace or customer information requiring scrutiny.",
          ],
          [
            "AI-DERIVED",
            "Interpretation generated from retrieved evidence.",
          ],
          [
            "UNVERIFIED",
            "Requires verification before procurement use.",
          ],
        ].map(([a, b]) => (
          <div className="card" key={a}>
            <span
              className={`badge ${a
                .toLowerCase()
                .replace("-", "")}`}
            >
              {a}
            </span>

            <p>{b}</p>
          </div>
        ))}
      </div>
    </Page>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard({ lang }: { lang: Lang }) {
  return (
    <Page
      title={tx(lang, "dashboard")}
      intro="A unified view of requirements, standards, compliance signals, product evaluation and evidence."
    >
      <div className="dashboard-grid">
        {[
          [
            "Requirement",
            "Natural-language input",
            "Detected automatically",
          ],
          [
            "Standards",
            "Applicable IS standards",
            "Relationship-aware",
          ],
          [
            "Compliance",
            "Needs Verification",
            "No certification claim",
          ],
          [
            "Recommendations",
            "Standards ranking",
            "Explainable matching",
          ],
          [
            "Comparison",
            "Side-by-side",
            "Scope and edition comparison",
          ],
          [
            "Evidence",
            "Verification status",
            "Authoritative sources separated",
          ],
        ].map((x) => (
          <div className="card metric" key={x[0]}>
            <small>{x[0]}</small>
            <strong>{x[1]}</strong>
            <span>{x[2]}</span>
          </div>
        ))}
      </div>
    </Page>
  );
}

/* =========================================================
   EXPLORER
========================================================= */

function Explorer({ lang }: { lang: Lang }) {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .search("", undefined)
      .then((r) => setResults(r?.results || []))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, []);

  const domains = [
    "Lighting & Electrical",
    "Electrical Safety",
    "Cables & Wires",
    "Water & Pumps",
    "Construction",
    "Mechanical",
    "Industrial Automation",
    "Textiles",
    "Food & Agriculture",
    "Medical Devices",
    "IT & Electronics",
    "Solar & Renewable Energy",
    "Fire & Safety",
    "Automotive",
    "Environment & Energy",
  ];

  return (
    <Page
      title={tx(lang, "explorer")}
      intro="Browse the standards knowledge layer by domain."
    >
      <div className="domain-grid">
        {domains.map((d) => (
          <Link
            key={d}
            to={`/search?domain=${encodeURIComponent(d)}`}
            className="domain-card card"
          >
            {d}
            <ChevronRight />
          </Link>
        ))}
      </div>

      {loading && (
        <div className="loading">Loading standards…</div>
      )}

      <div className="standard-list">
        {results.map((s) => (
          <Link
            className="card standard-line"
            to={`/standards/${s.id}`}
            key={s.id}
          >
            <span className="is-number">
              {s.is_number}
            </span>

            <span>
              {localizedStandard(s, lang).title}
            </span>

            <ChevronRight />
          </Link>
        ))}
      </div>
    </Page>
  );
}

/* =========================================================
   ANALYSIS PAGE
========================================================= */

function AnalysisPage({ lang }: { lang: Lang }) {
  const [text, setText] = useState(
    "cement for building construction"
  );

  const [result, setResult] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const run = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError("");

    try {
      setResult(await api.analyze(text, lang));
    } catch (e: any) {
      setError(e?.message || "Analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page
      title={tx(lang, "analysis")}
      intro="Paste a product specification or procurement requirement."
    >
      <div className="card analysis-input">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={7}
        />

        <button
          className="primary-btn"
          onClick={run}
          disabled={loading}
        >
          {loading ? "Analyzing…" : tx(lang, "analyze")}
        </button>
      </div>

      {error && (
        <div className="alert danger">{error}</div>
      )}

      {result && (
        <AnalysisResult
          lang={lang}
          result={result}
        />
      )}
    </Page>
  );
}

/* =========================================================
   SETTINGS
========================================================= */

function Settings({
  lang,
  setLang,
}: {
  lang: Lang;
  setLang: (x: Lang) => void;
}) {
  return (
    <Page
      title={tx(lang, "settings")}
      intro="Language and interface preferences."
    >
      <div className="card setting">
        <Languages />

        <div>
          <h3>Interface language</h3>

          <p>
            Official IS numbers remain unchanged while
            supported explanations can be localized.
          </p>

          <select
            value={lang}
            onChange={(e) =>
              setLang(e.target.value as Lang)
            }
          >
            {languages.map((l) => (
              <option
                value={l.code}
                key={l.code}
              >
                {l.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </Page>
  );
}

/* =========================================================
   PAGE
========================================================= */

function Page({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="page">
      <div className="page-title">
        <span className="eyebrow">BIS SENSOR</span>

        <h1>{title}</h1>

        {intro && <p>{intro}</p>}
      </div>

      {children}
    </div>
  );
}

/* =========================================================
   APP
========================================================= */

export default function App() {
  const [lang, setLangState] = useState<Lang>(
    (localStorage.getItem(
      "bissensor-lang"
    ) as Lang) || "en"
  );

  useEffect(() => {
    localStorage.setItem(
      "bissensor-lang",
      lang
    );

    (window as any).__bissensor_lang = lang;

    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (x: Lang) => {
    setLangState(x);
  };

  return (
    <Layout
      lang={lang}
      setLang={setLang}
    >
      <Routes>
        <Route
          path="/"
          element={<Home lang={lang} />}
        />

        <Route
          path="/search"
          element={<SearchPage lang={lang} />}
        />

        <Route
          path="/standards/:id"
          element={<StandardDetails lang={lang} />}
        />

        <Route
          path="/analysis"
          element={<AnalysisPage lang={lang} />}
        />

        <Route
          path="/tender"
          element={<TenderPage lang={lang} />}
        />

        <Route
          path="/explorer"
          element={<Explorer lang={lang} />}
        />

        <Route
          path="/compare"
          element={<ComparePage lang={lang} />}
        />

        <Route
          path="/recommend"
          element={<RecommendationPage lang={lang} />}
        />

        <Route
          path="/safety"
          element={<SafetyPage lang={lang} />}
        />

        <Route
          path="/evidence"
          element={<EvidencePage lang={lang} />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard lang={lang} />}
        />

        <Route
          path="/settings"
          element={
            <Settings
              lang={lang}
              setLang={setLang}
            />
          }
        />
      </Routes>
    </Layout>
  );
}

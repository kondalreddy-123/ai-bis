import React, {
  useEffect,
  useState,
} from "react";

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
} from "lucide-react";

import { api } from "./api";
import {
  languages,
  Lang,
  tx,
} from "./i18n";


// ======================================================
// HELPERS
// ======================================================

function localizedStandard(
  standard: any,
  lang: Lang
) {
  const translation =
    standard?.translations?.[lang];

  return translation
    ? {
        ...standard,
        title:
          translation.title ||
          standard.title,
        scope:
          translation.scope ||
          standard.scope,
      }
    : standard;
}


const examplePrompt =
  "Need standards for outdoor LED street lights for a government tender.";


// ======================================================
// LAYOUT
// ======================================================

function Layout({
  lang,
  setLang,
  children,
}: {
  lang: Lang;
  setLang: (x: Lang) => void;
  children: React.ReactNode;
}) {
  const [mobile, setMobile] =
    useState(false);

  const location = useLocation();

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

        <Link
          to="/"
          className="brand"
        >
          <span className="brand-mark">
            B
          </span>

          <span>
            BIS SENSOR
          </span>
        </Link>

        <button
          className="mobile-menu"
          onClick={() =>
            setMobile(!mobile)
          }
          aria-label="Menu"
        >
          {mobile ? <X /> : <Menu />}
        </button>

        <nav
          className={
            mobile
              ? "nav open"
              : "nav"
          }
        >
          {nav.map(
            ([path, key]) => (
              <Link
                key={path}
                to={path}
                onClick={() =>
                  setMobile(false)
                }
                className={
                  location.pathname ===
                  path
                    ? "active"
                    : ""
                }
              >
                {tx(
                  lang,
                  key
                )}
              </Link>
            )
          )}
        </nav>

        <label className="lang">
          <Languages size={17} />

          <select
            value={lang}
            onChange={(e) =>
              setLang(
                e.target.value as Lang
              )
            }
            aria-label="Language"
          >
            {languages.map(
              (language) => (
                <option
                  key={language.code}
                  value={language.code}
                >
                  {language.label}
                </option>
              )
            )}
          </select>
        </label>

      </header>

      <main>
        {children}
      </main>

      <footer>
        <span>BIS SENSOR</span>

        <span>
          {tx(
            lang,
            "disclaimer"
          )}
        </span>
      </footer>

    </div>
  );
}


// ======================================================
// HOME
// ======================================================

function Home({
  lang,
}: {
  lang: Lang;
}) {

  const [
    text,
    setText,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    result,
    setResult,
  ] = useState<any>(null);

  const [
    error,
    setError,
  ] = useState("");

  const runAnalysis =
    async () => {

      setError("");
      setLoading(true);

      try {

        const result =
          await api.analyze(
            text.trim() ||
              examplePrompt,
            lang
          );

        setResult(result);

      } catch (error: any) {

        console.error(error);

        setError(
          error?.message ||
            "Analysis failed."
        );

      } finally {

        setLoading(false);
      }
    };


  return (
    <div className="page home">

      <section className="hero">

        <div className="eyebrow">
          <span className="live-dot" />

          AI STANDARDS
          INTELLIGENCE
        </div>

        <h1>
          {tx(
            lang,
            "hero"
          )}
        </h1>

        <p>
          {tx(
            lang,
            "heroSub"
          )}
        </p>

        <div className="hero-input">

          <textarea
            value={text}
            onChange={(e) =>
              setText(
                e.target.value
              )
            }
            placeholder={tx(
              lang,
              "searchPlaceholder"
            )}
            aria-label={
              tx(
                lang,
                "searchPlaceholder"
              )
            }
          />

          <div className="input-actions">

            <button
              className="icon-btn"
              title={tx(
                lang,
                "voice"
              )}
              onClick={() =>
                startVoice(
                  setText,
                  lang
                )
              }
            >
              <Mic size={20} />
            </button>

            <Link
              className="secondary-btn"
              to="/tender"
            >
              <Upload size={18} />

              {tx(
                lang,
                "upload"
              )}
            </Link>

            <button
              className="primary-btn"
              disabled={loading}
              onClick={runAnalysis}
            >
              {loading
                ? "Analyzing..."
                : tx(
                    lang,
                    "analyze"
                  )}

              <ArrowRight
                size={18}
              />
            </button>

          </div>

        </div>

        <div className="demo-row">

          <button
            className="text-btn"
            onClick={() =>
              setText(
                examplePrompt
              )
            }
          >
            Try an example:
            "{examplePrompt}"
          </button>

        </div>

      </section>


      <section className="trust-strip">

        <div>
          <ShieldCheck />

          <b>
            Evidence-first
          </b>

          <span>
            Every major result
            has a source status.
          </span>
        </div>

        <div>
          <Database />

          <b>
            Standards graph
          </b>

          <span>
            Primary → related →
            test → safety.
          </span>
        </div>

        <div>
          <GitCompare />

          <b>
            Decision support
          </b>

          <span>
            Compare standards
            against requirements.
          </span>
        </div>

      </section>


      {error && (
        <div className="alert danger">
          {error}
        </div>
      )}


      {result ? (
        <AnalysisResult
          lang={lang}
          result={result}
        />
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
              "Identify missing requirements before procurement.",
              SlidersHorizontal,
            ],
            [
              "Simple explanations",
              "Understand technical standards in plain language.",
              Lightbulb,
            ],
            [
              "Evidence separation",
              "Official, verified and AI-derived information remain distinct.",
              ShieldCheck,
            ],
          ].map(
            ([
              title,
              description,
              Icon,
            ]) => (
              <div
                className="card feature"
                key={title}
              >
                <Icon />

                <h3>
                  {title}
                </h3>

                <p>
                  {description}
                </p>
              </div>
            )
          )}

        </section>
      )}

    </div>
  );
}


// ======================================================
// ANALYSIS RESULT
// ======================================================

function AnalysisResult({
  lang,
  result,
}: {
  lang: Lang;
  result: any;
}) {

  const navigate =
    useNavigate();

  const analysis =
    result?.analysis || {};

  const recommendations =
    Array.isArray(
      result?.recommendations
    )
      ? result.recommendations
      : [];

  const requirements =
    Array.isArray(
      analysis?.requirements
    )
      ? analysis.requirements
      : [];

  const missing =
    Array.isArray(
      analysis?.missing
    )
      ? analysis.missing
      : [];


  return (
    <section className="results">

      <div className="section-head">

        <div>

          <span className="eyebrow">
            ANALYSIS
          </span>

          <h2>
            {analysis.product ||
              "Specification Analysis"}
          </h2>

        </div>

        <span className="badge verified">
          VERIFIED SOURCES
        </span>

      </div>


      {requirements.length >
        0 && (
        <div className="requirement-grid">

          {requirements.map(
            (requirement: any) => (
              <div
                className="req"
                key={
                  requirement.name
                }
              >

                <CheckCircle2 />

                <span>

                  <small>
                    {
                      requirement.name
                    }
                  </small>

                  <b>
                    {
                      requirement.value
                    }
                  </b>

                </span>

              </div>
            )
          )}

        </div>
      )}


      {missing.length >
        0 && (
        <MissingQuestions
          lang={lang}
          missing={missing}
        />
      )}


      <h3>
        {tx(
          lang,
          "applicable"
        )}
      </h3>


      {recommendations.length >
      0 ? (
        <div className="standard-cards">

          {recommendations.map(
            (recommendation: any) => (
              <StandardCard
                key={
                  recommendation
                    ?.standard?.id
                }
                lang={lang}
                item={
                  recommendation
                }
                onClick={() =>
                  navigate(
                    `/standards/${
                      recommendation
                        ?.standard
                        ?.id
                    }`
                  )
                }
              />
            )
          )}

        </div>
      ) : (
        <div className="empty card">

          <Info />

          <p>
            No verified applicable
            standard found.
          </p>

        </div>
      )}

    </section>
  );
}


// ======================================================
// MISSING QUESTIONS
// ======================================================

function MissingQuestions({
  lang,
  missing,
}: {
  lang: Lang;
  missing: any[];
}) {

  const [
    values,
    setValues,
  ] = useState<
    Record<string, string>
  >({});


  return (
    <div className="card missing-box">

      <div className="missing-title">

        <AlertTriangle />

        <div>

          <b>
            {tx(
              lang,
              "missing"
            )}
          </b>

          <p>
            {tx(
              lang,
              "selectRequired"
            )}
          </p>

        </div>

      </div>


      <div className="question-grid">

        {missing.map(
          (question: any) => (
            <label
              key={question.key}
            >

              <span>
                {question.label}
              </span>

              <select
                value={
                  values[
                    question.key
                  ] || ""
                }
                onChange={(e) =>
                  setValues({
                    ...values,
                    [question.key]:
                      e.target.value,
                  })
                }
              >

                <option value="">
                  Select...
                </option>

                {Array.isArray(
                  question.options
                ) &&
                  question.options.map(
                    (option: string) => (
                      <option
                        key={option}
                        value={option}
                      >
                        {option}
                      </option>
                    )
                  )}

              </select>

            </label>
          )
        )}

      </div>

    </div>
  );
}


// ======================================================
// STANDARD CARD
// ======================================================

function StandardCard({
  lang,
  item,
  onClick,
}: {
  lang: Lang;
  item: any;
  onClick: () => void;
}) {

  const standard =
    localizedStandard(
      item?.standard || {},
      lang
    );


  return (
    <div className="card standard-card">

      <div className="standard-top">

        <div>

          <span className="is-number">
            {standard.is_number}
          </span>

          <h3>
            {standard.title}
          </h3>

        </div>

        <span className="badge verified">
          {
            standard.verification_status ||
            tx(
              lang,
              "official"
            )
          }
        </span>

      </div>


      <p>
        {
          item?.why_it_matches ||
          item?.applicability ||
          "Applicable based on the submitted requirements."
        }
      </p>


      <div className="standard-meta">

        <span>
          Edition / Year{" "}
          <b>
            {standard.edition ||
              "Not specified"}
          </b>
        </span>

        <span>
          Confidence{" "}
          <b>
            {item?.confidence ??
              "—"}
            {item?.confidence != null
              ? "%"
              : ""}
          </b>
        </span>

      </div>


      <div className="standard-actions">

        <button
          className="link-btn"
          onClick={onClick}
        >
          {tx(
            lang,
            "details"
          )}

          <ChevronRight
            size={16}
          />
        </button>


        {standard.source_url && (
          <a
            className="link-btn"
            href={
              standard.source_url
            }
            target="_blank"
            rel="noreferrer"
          >
            Official BIS evidence

            <ExternalLink
              size={15}
            />
          </a>
        )}

      </div>

    </div>
  );
}


// ======================================================
// SEARCH
// ======================================================

function SearchPage({
  lang,
}: {
  lang: Lang;
}) {

  const [
    query,
    setQuery,
  ] = useState("");

  const [
    domain,
    setDomain,
  ] = useState("");

  const [
    results,
    setResults,
  ] = useState<any[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");


  const doSearch =
    async () => {

      setError("");
      setLoading(true);

      try {

        const response =
          await api.search(
            query,
            domain || undefined
          );

        setResults(
          Array.isArray(
            response?.results
          )
            ? response.results
            : []
        );

      } catch (error: any) {

        setError(
          error?.message ||
            "Search failed."
        );

      } finally {

        setLoading(false);
      }
    };


  return (
    <Page
      title={tx(
        lang,
        "search"
      )}
      intro="Search by product, requirement, domain or IS identifier."
    >

      <div className="search-panel card">

        <div className="search-row">

          <Search />

          <input
            value={query}
            onChange={(e) =>
              setQuery(
                e.target.value
              )
            }
            onKeyDown={(e) => {
              if (
                e.key === "Enter"
              ) {
                doSearch();
              }
            }}
            placeholder="e.g. cement, water pump, electrical cable, street light..."
          />

          <button
            className="primary-btn"
            onClick={doSearch}
            disabled={loading}
          >
            {loading
              ? "Searching..."
              : tx(
                  lang,
                  "search"
                )}
          </button>

        </div>


        <div className="filter-row">

          <select
            value={domain}
            onChange={(e) =>
              setDomain(
                e.target.value
              )
            }
          >

            <option value="">
              All domains
            </option>

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
            ].map(
              (domainName) => (
                <option
                  key={domainName}
                  value={domainName}
                >
                  {domainName}
                </option>
              )
            )}

          </select>

        </div>

      </div>


      {error && (
        <div className="alert danger">
          {error}
        </div>
      )}


      <div className="search-results">

        {results.map(
          (standard) => {

            const localized =
              localizedStandard(
                standard,
                lang
              );

            return (
              <Link
                className="search-result card"
                to={`/standards/${standard.id}`}
                key={standard.id}
              >

                <div>

                  <span className="is-number">
                    {
                      localized.is_number
                    }
                  </span>

                  <h3>
                    {
                      localized.title
                    }
                  </h3>

                  <p>
                    {
                      standard.domain
                    }{" "}
                    ·{" "}
                    {
                      standard.product_category
                    }
                  </p>

                </div>

                <ChevronRight />

              </Link>
            );
          }
        )}

      </div>


      {results.length ===
        0 &&
        !loading && (
          <div className="empty card">

            <Info />

            <p>
              Search for a product
              or requirement to find
              applicable Indian
              Standards.
            </p>

          </div>
        )}

    </Page>
  );
}


// ======================================================
// STANDARD DETAILS
// ======================================================

function StandardDetails({
  lang,
}: {
  lang: Lang;
}) {

  const id =
    useLocation()
      .pathname
      .split("/")
      .pop() || "";


  const [
    data,
    setData,
  ] = useState<any>();

  const [
    error,
    setError,
  ] = useState("");


  useEffect(() => {

    setError("");

    api.standard(id)
      .then(setData)
      .catch(
        (error: any) =>
          setError(
            error?.message ||
              "Unable to load standard."
          )
      );

  }, [id]);


  if (error) {

    return (
      <Page title="Standard details">

        <div className="alert danger">
          {error}
        </div>

      </Page>
    );
  }


  if (!data) {

    return (
      <Page title="Standard details">

        <div className="loading">
          Loading...
        </div>

      </Page>
    );
  }


  const standard =
    localizedStandard(
      data.standard,
      lang
    );


  const relationships =
    Array.isArray(
      data.relationships
    )
      ? data.relationships
      : [];


  return (
    <Page
      title={
        standard.is_number
      }
      intro="Standard metadata, relationships and evidence."
    >

      <div className="detail-grid">

        <div className="card detail-main">

          <span className="is-number">
            {standard.is_number}
          </span>

          <h2>
            {standard.title}
          </h2>

          <div className="badge verified">
            {
              standard.verification_status
            }
          </div>

          <dl>

            <dt>
              Edition / Year
            </dt>

            <dd>
              {standard.edition}
            </dd>

            <dt>
              Status
            </dt>

            <dd>
              {standard.status}
            </dd>

            <dt>
              Scope
            </dt>

            <dd>
              {standard.scope}
            </dd>

            <dt>
              Domain
            </dt>

            <dd>
              {standard.domain}
            </dd>

            <dt>
              Product category
            </dt>

            <dd>
              {
                standard.product_category
              }
            </dd>

          </dl>

        </div>


        <aside className="card evidence-card">

          <h3>
            {tx(
              lang,
              "source"
            )}
          </h3>

          <div className="evidence-badge">
            BIS
          </div>

          <p>
            {
              standard.source_name ||
              "Bureau of Indian Standards"
            }
          </p>

          {standard.source_url && (
            <a
              className="primary-btn"
              href={
                standard.source_url
              }
              target="_blank"
              rel="noreferrer"
            >
              Official BIS evidence

              <ExternalLink
                size={15}
              />
            </a>
          )}

        </aside>

      </div>


      <h3>
        {tx(
          lang,
          "related"
        )}
      </h3>


      <div className="relationship-list">

        {relationships.map(
          (relationship: any) => {

            const related =
              localizedStandard(
                relationship.standard,
                lang
              );

            return (
              <div
                className="card relation"
                key={
                  relationship
                    .standard.id
                }
              >

                <span className="relation-type">
                  {
                    relationship.relationship
                  }
                </span>

                <span className="is-number">
                  {
                    related.is_number
                  }
                </span>

                <b>
                  {related.title}
                </b>

              </div>
            );
          }
        )}

      </div>

    </Page>
  );
}


// ======================================================
// STANDARD COMPARISON
// ======================================================

function ComparePage({
  lang,
}: {
  lang: Lang;
}) {

  const [
    selected,
    setSelected,
  ] = useState<string[]>([]);

  const [
    standards,
    setStandards,
  ] = useState<any[]>([]);

  const [
    searchText,
    setSearchText,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");


  const search =
    async () => {

      if (!searchText.trim()) {
        return;
      }

      try {

        const response =
          await api.search(
            searchText
          );

        setStandards(
          Array.isArray(
            response?.results
          )
            ? response.results
            : []
        );

      } catch (error: any) {

        setError(
          error?.message ||
            "Unable to search standards."
        );
      }
    };


  const toggle =
    (id: string) => {

      setSelected(
        (current) =>
          current.includes(id)
            ? current.filter(
                (item) =>
                  item !== id
              )
            : [
                ...current,
                id,
              ]
      );
    };


  const [
    comparison,
    setComparison,
  ] = useState<any>(null);


  const compare =
    async () => {

      if (
        selected.length <
        2
      ) {

        setError(
          "Select at least two standards to compare."
        );

        return;
      }

      setError("");
      setLoading(true);

      try {

        const response =
          await api.compareStandards(
            selected
          );

        setComparison(
          response
        );

      } catch (error: any) {

        setError(
          error?.message ||
            "Standard comparison failed."
        );

      } finally {

        setLoading(false);
      }
    };


  return (
    <Page
      title={tx(
        lang,
        "compare"
      )}
      intro="Compare applicable Indian Standards side-by-side."
    >

      <div className="card">

        <div className="search-row">

          <Search />

          <input
            value={searchText}
            onChange={(e) =>
              setSearchText(
                e.target.value
              )
            }
            placeholder="Search standards to compare..."
          />

          <button
            className="primary-btn"
            onClick={search}
          >
            Search
          </button>

        </div>


        <div className="standard-list">

          {standards.map(
            (standard) => (
              <label
                className="card standard-line"
                key={standard.id}
              >

                <input
                  type="checkbox"
                  checked={selected.includes(
                    standard.id
                  )}
                  onChange={() =>
                    toggle(
                      standard.id
                    )
                  }
                />

                <span className="is-number">
                  {
                    standard.is_number
                  }
                </span>

                <span>
                  {localizedStandard(
                    standard,
                    lang
                  ).title}
                </span>

              </label>
            )
          )}

        </div>


        <button
          className="primary-btn"
          onClick={compare}
          disabled={
            loading ||
            selected.length < 2
          }
        >
          {loading
            ? "Comparing..."
            : "Compare Selected Standards"}
        </button>

      </div>


      {error && (
        <div className="alert danger">
          {error}
        </div>
      )}


      {comparison && (
        <div className="card table-wrap">

          <h3>
            Standards Comparison
          </h3>

          <pre
            style={{
              whiteSpace:
                "pre-wrap",
              overflowX:
                "auto",
            }}
          >
            {JSON.stringify(
              comparison,
              null,
              2
            )}
          </pre>

        </div>
      )}

    </Page>
  );
}


// ======================================================
// AI RECOMMENDATION
// ======================================================

function RecommendationPage({
  lang,
}: {
  lang: Lang;
}) {

  const [
    text,
    setText,
  ] = useState(
    examplePrompt
  );

  const [
    recommendations,
    setRecommendations,
  ] = useState<any[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");


  const submit =
    async () => {

      if (!text.trim()) {

        setError(
          "Please enter a product specification or procurement requirement."
        );

        return;
      }

      setError("");
      setLoading(true);

      try {

        const response =
          await api.recommend(
            text,
            lang
          );

        setRecommendations(
          Array.isArray(
            response?.recommendations
          )
            ? response.recommendations
            : []
        );

      } catch (error: any) {

        console.error(error);

        setError(
          error?.message ||
            "Recommendation failed."
        );

      } finally {

        setLoading(false);
      }
    };


  return (
    <Page
      title={tx(
        lang,
        "recommend"
      )}
      intro="Describe your procurement requirement and BIS SENSOR will rank applicable standards."
    >

      <div className="card">

        <label>

          <span>
            Product / Procurement
            Requirement
          </span>

          <textarea
            value={text}
            onChange={(e) =>
              setText(
                e.target.value
              )
            }
            placeholder="Example: Need standards for cement for building construction..."
            style={{
              width: "100%",
              minHeight: "150px",
            }}
          />

        </label>


        <button
          className="primary-btn"
          onClick={submit}
          disabled={loading}
        >
          {loading
            ? "Generating..."
            : tx(
                lang,
                "generate"
              )}
        </button>

      </div>


      {error && (
        <div className="alert danger">
          {error}
        </div>
      )}


      {recommendations.length >
      0 && (
        <div className="recommend-grid">

          {recommendations.map(
            (
              recommendation,
              index
            ) => {

              const standard =
                localizedStandard(
                  recommendation
                    ?.standard ||
                    {},
                  lang
                );

              return (
                <div
                  className="card recommend-card"
                  key={
                    standard.id ||
                    index
                  }
                >

                  <div className="rank">
                    #{index + 1}
                  </div>

                  <span className="is-number">
                    {
                      standard.is_number
                    }
                  </span>

                  <h3>
                    {
                      standard.title
                    }
                  </h3>

                  <div className="score-ring">

                    {
                      recommendation
                        ?.confidence ??
                      "—"
                    }

                    <small>
                      %
                    </small>

                  </div>

                  <p>

                    <strong>
                      Why:
                    </strong>{" "}

                    {
                      recommendation
                        ?.why_it_matches ||
                      recommendation
                        ?.applicability ||
                      "Matches the submitted procurement requirement."
                    }

                  </p>


                  {standard.source_url && (
                    <a
                      className="link-btn"
                      href={
                        standard.source_url
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      Official BIS evidence

                      <ExternalLink
                        size={15}
                      />
                    </a>
                  )}

                </div>
              );
            }
          )}

        </div>
      )}


      {!loading &&
        recommendations.length ===
          0 &&
        !error && (
          <div className="empty card">

            <Info />

            <p>
              Enter a requirement
              and click Generate
              Recommendation.
            </p>

          </div>
        )}

    </Page>
  );
}


// ======================================================
// SAFETY
// ======================================================

function SafetyPage({
  lang,
}: {
  lang: Lang;
}) {

  const [
    items,
    setItems,
  ] = useState<any[]>([]);

  const [
    error,
    setError,
  ] = useState("");


  useEffect(() => {

    api.safety({
      product:
        "Outdoor LED Street Light",
      requirements: [
        "Outdoor",
        "Government tender",
      ],
      environment:
        "Outdoor",
    })
      .then(
        (response) =>
          setItems(
            Array.isArray(
              response?.items
            )
              ? response.items
              : []
          )
      )
      .catch(
        (error: any) =>
          setError(
            error?.message ||
              "Safety checklist unavailable."
          )
      );

  }, []);


  return (
    <Page
      title={tx(
        lang,
        "safety"
      )}
      intro={tx(
        lang,
        "safetyIntro"
      )}
    >

      {error && (
        <div className="alert danger">
          {error}
        </div>
      )}


      <div className="notice">

        <ShieldCheck />

        <div>

          <b>
            Safety is a
            verification workflow
          </b>

          <p>
            Verify product
            documentation,
            installation conditions
            and authoritative
            requirements before
            procurement.
          </p>

        </div>

      </div>


      <div className="checklist">

        {items.map(
          (item) => (
            <div
              className="card checklist-item"
              key={item.title}
            >

              <CheckCircle2 />

              <div>

                <b>
                  {item.title}
                </b>

                <p>
                  {item.description}
                </p>

              </div>

              <span>
                {item.type}
              </span>

            </div>
          )
        )}

      </div>

    </Page>
  );
}


// ======================================================
// TENDER
// ======================================================

function TenderPage({
  lang,
}: {
  lang: Lang;
}) {

  const [
    file,
    setFile,
  ] = useState<File>();

  const [
    result,
    setResult,
  ] = useState<any>();

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");


  const submit =
    async () => {

      if (!file) {
        return;
      }

      setError("");
      setLoading(true);

      try {

        const response =
          await api.tender(
            file
          );

        setResult(
          response
        );

      } catch (error: any) {

        setError(
          error?.message ||
            "Tender analysis failed."
        );

      } finally {

        setLoading(false);
      }
    };


  return (
    <Page
      title={tx(
        lang,
        "tender"
      )}
      intro="Upload a PDF, DOCX or TXT tender document for standards analysis."
    >

      <div className="upload-card card">

        <FileText size={30} />

        <h3>
          Upload tender
          document
        </h3>

        <p>
          Supported: PDF,
          DOCX and TXT.
        </p>

        <input
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={(e) =>
            setFile(
              e.target.files?.[0]
            )
          }
        />

        {file && (
          <b>
            {file.name}
          </b>
        )}

        <button
          className="primary-btn"
          disabled={
            !file || loading
          }
          onClick={submit}
        >
          {loading
            ? "Analyzing..."
            : "Run Tender Standards Review"}
        </button>

      </div>


      {error && (
        <div className="alert danger">
          {error}
        </div>
      )}


      {result && (
        <div className="card tender-result">

          <h3>
            Extracted Product
          </h3>

          <p>
            {
              result?.review
                ?.analysis
                ?.product ||
              "Not identified"
            }
          </p>


          <h3>
            {tx(
              lang,
              "applicable"
            )}
          </h3>


          {(
            result?.review
              ?.recommendations ||
            []
          ).map(
            (recommendation: any) => (
              <div
                className="mini-standard"
                key={
                  recommendation
                    ?.standard?.id
                }
              >

                <span className="is-number">
                  {
                    recommendation
                      ?.standard
                      ?.is_number
                  }
                </span>

                <p>
                  {
                    recommendation
                      ?.applicability
                  }
                </p>

                <span>
                  {
                    recommendation
                      ?.confidence
                  }%
                </span>

              </div>
            )
          )}

        </div>
      )}

    </Page>
  );
}


// ======================================================
// EVIDENCE
// ======================================================

function EvidencePage({
  lang,
}: {
  lang: Lang;
}) {

  return (
    <Page
      title={tx(
        lang,
        "evidence"
      )}
      intro="Evidence is separated from AI interpretation."
    >

      <div className="evidence-grid">

        {[
          [
            "OFFICIAL",
            "Authoritative BIS or government source.",
          ],
          [
            "VERIFIED",
            "A source whose identity and content have been checked.",
          ],
          [
            "THIRD-PARTY",
            "Seller, marketplace or customer information.",
          ],
          [
            "AI-DERIVED",
            "Interpretation generated from retrieved evidence.",
          ],
          [
            "UNVERIFIED",
            "Requires verification before procurement use.",
          ],
        ].map(
          ([name, description]) => (
            <div
              className="card"
              key={name}
            >

              <span
                className={`badge ${name
                  .toLowerCase()
                  .replace(
                    "-",
                    ""
                  )}`}
              >
                {name}
              </span>

              <p>
                {description}
              </p>

            </div>
          )
        )}

      </div>

    </Page>
  );
}


// ======================================================
// DASHBOARD
// ======================================================

function Dashboard({
  lang,
}: {
  lang: Lang;
}) {

  return (
    <Page
      title={tx(
        lang,
        "dashboard"
      )}
      intro="Unified view of standards intelligence and procurement decision support."
    >

      <div className="dashboard-grid">

        {[
          [
            "Requirement",
            "Natural-language input",
            "AI requirement extraction",
          ],
          [
            "Standards",
            "Indian Standards",
            "Relationship-aware",
          ],
          [
            "Compliance",
            "Verification workflow",
            "No automatic certification claim",
          ],
          [
            "Comparison",
            "Standards comparison",
            "Side-by-side analysis",
          ],
          [
            "Recommendation",
            "AI-assisted",
            "Explainable ranking",
          ],
          [
            "Evidence",
            "Source-aware",
            "Authoritative sources separated",
          ],
        ].map(
          (item) => (
            <div
              className="card metric"
              key={item[0]}
            >

              <small>
                {item[0]}
              </small>

              <strong>
                {item[1]}
              </strong>

              <span>
                {item[2]}
              </span>

            </div>
          )
        )}

      </div>

    </Page>
  );
}


// ======================================================
// EXPLORER
// ======================================================

function Explorer({
  lang,
}: {
  lang: Lang;
}) {

  const [
    results,
    setResults,
  ] = useState<any[]>([]);


  useEffect(() => {

    api.search(
      ""
    )
      .then(
        (response) =>
          setResults(
            Array.isArray(
              response?.results
            )
              ? response.results
              : []
          )
      )
      .catch(
        (error) =>
          console.error(error)
      );

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
      title={tx(
        lang,
        "explorer"
      )}
      intro="Browse the Indian Standards knowledge layer by domain."
    >

      <div className="domain-grid">

        {domains.map(
          (domain) => (
            <Link
              key={domain}
              to={`/search?domain=${encodeURIComponent(
                domain
              )}`}
              className="domain-card card"
            >
              {domain}

              <ChevronRight />
            </Link>
          )
        )}

      </div>


      <div className="standard-list">

        {results.map(
          (standard) => (
            <Link
              className="card standard-line"
              to={`/standards/${standard.id}`}
              key={standard.id}
            >

              <span className="is-number">
                {standard.is_number}
              </span>

              <span>
                {
                  localizedStandard(
                    standard,
                    lang
                  ).title
                }
              </span>

              <ChevronRight />

            </Link>
          )
        )}

      </div>

    </Page>
  );
}


// ======================================================
// ANALYSIS PAGE
// ======================================================

function AnalysisPage({
  lang,
}: {
  lang: Lang;
}) {

  const [
    text,
    setText,
  ] = useState(
    examplePrompt
  );

  const [
    result,
    setResult,
  ] = useState<any>();

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");


  const analyze =
    async () => {

      setError("");
      setLoading(true);

      try {

        const response =
          await api.analyze(
            text,
            lang
          );

        setResult(
          response
        );

      } catch (error: any) {

        setError(
          error?.message ||
            "Product analysis failed."
        );

      } finally {

        setLoading(false);
      }
    };


  return (
    <Page
      title={tx(
        lang,
        "analysis"
      )}
      intro="Paste a product specification or procurement requirement."
    >

      <div className="card analysis-input">

        <textarea
          value={text}
          onChange={(e) =>
            setText(
              e.target.value
            )
          }
          placeholder="Example: Need standards for cement used in building construction."
        />

        <button
          className="primary-btn"
          onClick={analyze}
          disabled={loading}
        >
          {loading
            ? "Analyzing..."
            : tx(
                lang,
                "analyze"
              )}
        </button>

      </div>


      {error && (
        <div className="alert danger">
          {error}
        </div>
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


// ======================================================
// SETTINGS
// ======================================================

function Settings({
  lang,
  setLang,
}: {
  lang: Lang;
  setLang: (x: Lang) => void;
}) {

  return (
    <Page
      title={tx(
        lang,
        "settings"
      )}
      intro="Language and interface preferences."
    >

      <div className="card setting">

        <Languages />

        <div>

          <h3>
            Interface language
          </h3>

          <p>
            Standard identifiers
            such as IS numbers
            remain unchanged.
          </p>

          <select
            value={lang}
            onChange={(e) =>
              setLang(
                e.target.value as Lang
              )
            }
          >

            {languages.map(
              (language) => (
                <option
                  value={
                    language.code
                  }
                  key={
                    language.code
                  }
                >
                  {language.label}
                </option>
              )
            )}

          </select>

        </div>

      </div>

    </Page>
  );
}


// ======================================================
// PAGE WRAPPER
// ======================================================

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

        <span className="eyebrow">
          BIS SENSOR
        </span>

        <h1>
          {title}
        </h1>

        {intro && (
          <p>
            {intro}
          </p>
        )}

      </div>

      {children}

    </div>
  );
}


// ======================================================
// VOICE
// ======================================================

function startVoice(
  setText: (text: string) => void,
  lang: Lang
) {

  const SpeechRecognition =
    (window as any)
      .SpeechRecognition ||
    (window as any)
      .webkitSpeechRecognition;


  if (!SpeechRecognition) {

    alert(
      "Voice input is not supported by this browser."
    );

    return;
  }


  const recognition =
    new SpeechRecognition();


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
      : "en-IN";


  recognition.interimResults =
    false;


  recognition.onresult =
    (event: any) => {

      const transcript =
        event?.results?.[0]?.[0]
          ?.transcript;

      if (transcript) {
        setText(
          transcript
        );
      }
    };


  recognition.onerror =
    (event: any) => {

      console.error(
        "Voice recognition error:",
        event
      );
    };


  recognition.start();
}


// ======================================================
// APP
// ======================================================

export default function App() {

  const [
    lang,
    setLangState,
  ] = useState<Lang>(
    (localStorage.getItem(
      "bissensor-lang"
    ) as Lang) || "en"
  );


  useEffect(() => {

    localStorage.setItem(
      "bissensor-lang",
      lang
    );

    (
      window as any
    ).__bissensor_lang =
      lang;

    document.documentElement.lang =
      lang;

  }, [lang]);


  const setLang =
    (language: Lang) =>
      setLangState(
        language
      );


  return (
    <Layout
      lang={lang}
      setLang={setLang}
    >

      <Routes>

        <Route
          path="/"
          element={
            <Home
              lang={lang}
            />
          }
        />

        <Route
          path="/search"
          element={
            <SearchPage
              lang={lang}
            />
          }
        />

        <Route
          path="/standards/:id"
          element={
            <StandardDetails
              lang={lang}
            />
          }
        />

        <Route
          path="/analysis"
          element={
            <AnalysisPage
              lang={lang}
            />
          }
        />

        <Route
          path="/tender"
          element={
            <TenderPage
              lang={lang}
            />
          }
        />

        <Route
          path="/explorer"
          element={
            <Explorer
              lang={lang}
            />
          }
        />

        <Route
          path="/compare"
          element={
            <ComparePage
              lang={lang}
            />
          }
        />

        <Route
          path="/recommend"
          element={
            <RecommendationPage
              lang={lang}
            />
          }
        />

        <Route
          path="/safety"
          element={
            <SafetyPage
              lang={lang}
            />
          }
        />

        <Route
          path="/evidence"
          element={
            <EvidencePage
              lang={lang}
            />
          }
        />

        <Route
          path="/dashboard"
          element={
            <Dashboard
              lang={lang}
            />
          }
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

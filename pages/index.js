import { useEffect, useState } from "react";

const ROLE_OPTIONS = [
  "Frontend Developer",
  "Backend Developer",
  "Data Analyst",
];

export default function Home() {
  const [targetRole, setTargetRole] = useState("Backend Developer");
  const [customRole, setCustomRole] = useState("");
  const [skillsInput, setSkillsInput] = useState("");
  const [skillGapResult, setSkillGapResult] = useState(null);
  const [roadmapResult, setRoadmapResult] = useState(null);
  const [news, setNews] = useState([]);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [loadingNews, setLoadingNews] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchNews() {
      try {
        setLoadingNews(true);
        const res = await fetch("/api/news");
        if (!res.ok) throw new Error("Failed to load news");
        const data = await res.json();
        setNews(data.items || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingNews(false);
      }
    }
    fetchNews();
  }, []);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setError("");
    const role =
      targetRole === "Custom" && customRole.trim()
        ? customRole.trim()
        : targetRole;

    if (!role) {
      setError("Please select or type a target role.");
      return;
    }

    const parsedSkills = skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (parsedSkills.length === 0) {
      setError("Please enter at least one current skill.");
      return;
    }

    setLoadingAnalysis(true);
    try {
      const [skillGapRes, roadmapRes] = await Promise.all([
        fetch("/api/skill-gap", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            targetRole: role,
            currentSkills: parsedSkills,
          }),
        }),
        fetch("/api/roadmap", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            targetRole: role,
          }),
        }),
      ]);

      if (!skillGapRes.ok) throw new Error("Skill-gap API failed");
      if (!roadmapRes.ok) throw new Error("Roadmap API failed");

      const skillGapData = await skillGapRes.json();
      const roadmapData = await roadmapRes.json();
      setSkillGapResult(skillGapData);
      setRoadmapResult(roadmapData);
    } catch (err) {
      setError(err.message || "Something went wrong. Try again.");
    } finally {
      setLoadingAnalysis(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
             CareerPath.AI
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Skill-gap analysis, roadmap & tech news in one minimal dashboard.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-xs text-slate-300">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
            Full Stack Application - CareerPath_AI
          </span>
        </header>

        {/* Input Card */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-black/40">
          <form
            onSubmit={handleAnalyze}
            className="grid gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.8fr)_auto] md:items-end"
          >
            {/* Role Selection */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300 uppercase tracking-wide">
                Target Role
              </label>
              <div className="space-y-2">
                <select
                  className="w-full rounded-xl border border-slate-700 px-3 py-2 text-sm outline-none ring-0 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/40 transition"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                >
                  {ROLE_OPTIONS.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                  <option value="Custom">Custom role…</option>
                </select>
                {targetRole === "Custom" && (
                  <input
                    type="text"
                    placeholder="e.g. AI Safety Engineer"
                    className="w-full rounded-xl border border-slate-700 px-3 py-2 text-sm outline-none ring-0 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/40 transition bg-slate-950/70"
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value)}
                  />
                )}
              </div>
            </div>

            {/* Skills Input */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300 uppercase tracking-wide">
                Current Skills
              </label>
              <textarea
                rows={3}
                placeholder="Comma-separated skills e.g. Java, SQL, Git, HTML"
                className="w-full rounded-xl border border-slate-700 px-3 py-2 text-sm outline-none ring-0 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/40 transition bg-slate-950/70 resize-none"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
              />
              <p className="text-[11px] text-slate-500">
                Tip: Include tools, languages and frameworks you are confident in.
              </p>
            </div>

            {/* Submit */}
            <div className="flex md:flex-col items-stretch gap-2 md:gap-3 md:justify-end">
              <button
                type="submit"
                disabled={loadingAnalysis}
                className="inline-flex items-center justify-center rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-brand-500/30 hover:bg-brand-600 disabled:opacity-60 disabled:cursor-not-allowed transition w-full md:w-auto"
              >
                {loadingAnalysis ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-slate-100 border-t-transparent" />
                    Analyzing…
                  </span>
                ) : (
                  "Analyze My Career Path"
                )}
              </button>
              {error && (
                <p className="text-[11px] text-rose-400 max-w-xs">{error}</p>
              )}
            </div>
          </form>
        </section>

        {/* Dashboard */}
        <section className="grid gap-4 lg:grid-cols-2">
          {/* Skill Gap */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:p-5 space-y-3">
            <header className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-100">
                  Skill Gap Analysis
                </h2>
                <p className="text-xs text-slate-500">
                  Auto-matched against core skills for popular roles.
                </p>
              </div>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-[11px] text-slate-300">
                /api/skill-gap
              </span>
            </header>

            {skillGapResult ? (
              <div className="space-y-3 text-sm">

                {/* 🆕 Custom role banner */}
                {skillGapResult.isCustomRole && (
                  <div className="rounded-lg bg-amber-500/10 border border-amber-500/40 px-3 py-2 text-xs text-amber-200">
                    ⚠️ <strong>{skillGapResult.targetRole}</strong> is not a predefined role.
                    Recommendations are based on real industry trends — review our job descriptions for accurate required skills.
                  </div>
                )}

                <div>
                  <p className="text-[11px] uppercase text-slate-500 mb-1">
                    Target Role
                  </p>
                  <p className="inline-flex items-center gap-2 rounded-lg bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-50">
                    {skillGapResult.targetRole}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-[11px] uppercase text-emerald-300 mb-1">
                      Matched Skills
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {skillGapResult.matchedSkills.length ? (
                        skillGapResult.matchedSkills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] text-emerald-200 border border-emerald-500/40"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-500">
                          No matched skills yet.
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase text-amber-300 mb-1">
                      Missing Skills
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {skillGapResult.missingSkills.length ? (
                        skillGapResult.missingSkills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] text-amber-100 border border-amber-500/40"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-500">
                          No predefined skill list available for this role.
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {skillGapResult.recommendations?.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-[11px] uppercase text-slate-400">
                      Recommendations
                    </p>
                    <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                      {skillGapResult.recommendations.map((rec, idx) => (
                        <li key={idx}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {skillGapResult.suggestedLearningOrder?.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-[11px] uppercase text-sky-300">
                      Suggested Learning Order
                    </p>
                    <ol className="space-y-1 text-xs text-slate-200 list-decimal list-inside">
                      {skillGapResult.suggestedLearningOrder.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                Run an analysis to see results.
              </p>
            )}
          </div>

          {/* Roadmap */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:p-5 space-y-3">
            <header className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-100">
                  Career Roadmap
                </h2>
                <p className="text-xs text-slate-500">Mock 3-phase roadmap.</p>
              </div>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-[11px] text-slate-300">
                /api/roadmap
              </span>
            </header>

            {roadmapResult ? (
              <div className="space-y-3 text-sm">
                <p className="text-[11px] uppercase text-slate-400">
                  Target Role
                </p>
                <p className="inline-flex items-center gap-2 rounded-lg bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-50">
                  {roadmapResult.targetRole}
                </p>

                <div className="space-y-2">
                  {roadmapResult.phases.map((phase) => (
                    <div
                      key={phase.id}
                      className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-slate-100">
                          {phase.title}
                        </p>
                        <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                          {phase.duration}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {phase.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {phase.focusAreas.map((area) => (
                          <span
                            key={area}
                            className="rounded-full bg-brand-500/10 px-2 py-1 text-[10px] text-brand-100 border border-brand-500/40"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                Run analysis to get roadmap.
              </p>
            )}
          </div>
        </section>

        {/* Tech News Section */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:p-5 space-y-3 mb-6">
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-100">
                Latest Tech Stories (Hacker News)
              </h2>
              <p className="text-xs text-slate-500">
                Fetched from the public HackerNews API.
              </p>
            </div>
            <span className="rounded-full bg-slate-800 px-3 py-1 text-[11px] text-slate-300">
              /api/news → HackerNews
            </span>
          </header>

          {loadingNews ? (
            <p className="text-xs text-slate-500">Loading tech stories…</p>
          ) : news && news.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {news.map((item) => (
                <article
                  key={item.id}
                  className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 space-y-1"
                >
                  <a
                    href={item.url || `https://news.ycombinator.com/item?id=${item.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-slate-50 hover:text-brand-300 line-clamp-2"
                  >
                    {item.title}
                  </a>
                  <p className="text-[11px] text-slate-500">
                    {item.type} • by {item.by}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                    <span>Score: {item.score}</span>
                    <span>{item.time}</span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">
              Couldn’t fetch news right now.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}

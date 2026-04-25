import ChatWidget from "@/components/ChatWidget";

export default function HomePage() {
  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">Portfolio Build: Client Orbit Support AI</p>
        <h1>Support replies in seconds. Lead capture by default.</h1>
        <p>
          This zero-budget, production-style assistant handles FAQs, captures buyer intent, and escalates high-risk queries to humans.
          It is designed for freelancers pitching AI support automation on Upwork.
        </p>
        <div className="badges">
          <span className="badge badge-accent">Gemini + fallback logic</span>
          <span className="badge">Rate-limited API</span>
          <span className="badge">Lead extraction</span>
          <span className="badge">Free-tier deploy plan</span>
        </div>
      </section>

      <section className="grid" aria-label="assistant grid">
        <ChatWidget />

        <div className="stack">
          <article className="card">
            <h3 style={{ marginTop: 0, marginBottom: "0.75rem" }}>How It Works</h3>
            <ol style={{ margin: 0, paddingLeft: "1.1rem", lineHeight: 1.55 }}>
              <li>User sends support question.</li>
              <li>API validates payload and checks rate limits.</li>
              <li>Assistant replies using policy-aware prompt guardrails.</li>
              <li>Lead fields are extracted and stored.</li>
              <li>Uncertain or high-risk cases are escalated.</li>
            </ol>
          </article>

          <article className="card">
            <h3 style={{ marginTop: 0, marginBottom: "0.75rem" }}>Demo KPI Targets</h3>
            <div className="kpi">
              <div>
                <strong>&lt;4s</strong>
                Median response time
              </div>
              <div>
                <strong>20/10m</strong>
                Anti-abuse rate limit
              </div>
              <div>
                <strong>4 fields</strong>
                Lead capture schema
              </div>
              <div>
                <strong>100%</strong>
                Server-side key safety
              </div>
            </div>
          </article>

          <article className="card">
            <h3 style={{ marginTop: 0, marginBottom: "0.7rem" }}>Client Value</h3>
            <p style={{ marginBottom: 0, color: "var(--muted)", lineHeight: 1.55 }}>
              Small businesses can reduce repetitive support workload and convert casual inquiries into qualified leads without hiring a full support team.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}

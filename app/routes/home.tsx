import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import { usePuterStore } from "~/lib/puter";
import { Link } from "react-router";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "ATS100 | Stop Getting Rejected by ATS" },
    { name: "description", content: "ATS100 analyzes your resume the way hiring systems and recruiters actually do." },
  ];
}

const FeatureCard = ({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) => (
  <div className="feature-card-3d">
    <div className="feature-glow" />
    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-md">
      <img src={icon} alt={title} className="size-6" />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

const WorkflowCard = ({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) => (
  <div className="workflow-card">
    <span className="text-sm font-bold text-[#606beb] uppercase tracking-[0.24em]">{step}</span>
    <h3 className="mt-5 text-2xl font-bold text-gray-900">{title}</h3>
    <p className="mt-4 text-gray-600 leading-relaxed">{description}</p>
  </div>
);

const researchChips = [
  "Role intent extraction",
  "ATS score",
  "Semantic gap detection",
  "Layout hierarchy analysis",
  "Scan flow readability",
  "Resume benchmarking",
  "Impact bullet rewrites",
  "Role-fit confidence",
  "Hiring simulation",
  "Section balance",
];

export default function Home() {
  const { auth } = usePuterStore();

  return (
    <main className="landing-shell min-h-screen flex flex-col">
      <Navbar />

      <section className="main-section flex-grow !gap-16 !pt-16">
        <div className="landing-grid">
          <div className="hero-copy">
            <span className="eyebrow">Built for modern hiring systems</span>

            <h1 className="text-pretty max-w-5xl leading-[1.02]">
              Stop Getting Rejected by ATS.
              <br />
              <span className="text-[#606beb]">Start Getting Interviews.</span>
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed">
              ATS100 analyzes your resume the way hiring systems and recruiters actually do, combining semantic understanding, visual structure analysis, and role alignment.
            </p>

            <p className="text-lg text-gray-500 leading-relaxed">
              Your resume is not just read. It is filtered, ranked, and often rejected before a human ever sees it.
              ATS100 helps you pass that first gate with confidence and gives you precise next steps to improve fast.
            </p>

            <div className="flex flex-row gap-4 flex-wrap">
              {auth.isAuthenticated ? (
                <Link to="/upload" className="primary-button px-10 py-4 text-xl font-semibold w-fit">
                  Analyze Resume
                </Link>
              ) : (
                <button
                  onClick={() => auth.signIn()}
                  className="primary-button px-12 py-4 text-xl font-semibold w-fit"
                >
                  Analyze Resume
                </button>
              )}

              <a
                href="#sample-report"
                className="px-10 py-4 border-2 border-gray-200 rounded-full text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                View Sample Report
              </a>
            </div>

            <div className="hero-proof">
              <div className="hero-proof-pill">ATS score + section breakdown</div>
              <div className="hero-proof-pill">Semantic + visual analysis</div>
              <div className="hero-proof-pill">Actionable rewrite guidance</div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-orb left-6 top-6 h-32 w-32 bg-[#8e98ff]/30" />
            <div className="hero-orb right-6 top-18 h-40 w-40 bg-[#fa7185]/20" />
            <div className="hero-orb left-24 bottom-10 h-28 w-28 bg-[#606beb]/20" />

            <div className="hero-panel hero-panel-main">
              <div className="hero-metric">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#606beb]">ATS score</p>
                    <p className="mt-3 text-6xl font-bold text-gray-900">84</p>
                  </div>
                  <div className="rounded-2xl bg-[#edf1ff] px-4 py-2 text-sm font-semibold text-[#606beb]">
                    Strong role alignment
                  </div>
                </div>
                <div className="mt-5 h-3 rounded-full bg-[#e8ecff]">
                  <div className="h-3 w-[84%] rounded-full bg-gradient-to-r from-[#8e98ff] to-[#606beb]" />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="hero-mini-card">
                  <p className="text-sm text-gray-500">Semantic gaps</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">4 found</p>
                </div>
                <div className="hero-mini-card">
                  <p className="text-sm text-gray-500">Hiring simulation</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">92%</p>
                </div>
              </div>

              <div className="mt-4 rounded-[28px] bg-[#f7f8ff] p-4">
                <p className="text-sm font-semibold text-gray-900">Top recommendation</p>
                <p className="mt-2 text-gray-600">
                  Rewrite experience bullets to show measurable impact and stronger role-specific vocabulary.
                </p>
              </div>
            </div>

            <div className="hero-panel hero-panel-side">
              <img src="/images/resume_02.png" className="rounded-[24px] shadow-lg" alt="Resume sample" />
              <div className="mt-4 hero-mini-card">
                <p className="text-sm text-gray-500">Visual scan flow</p>
                <p className="mt-2 text-xl font-bold text-gray-900">Readable, but dense</p>
              </div>
            </div>

            <div className="hero-panel hero-panel-bottom">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#606beb]">Live insights</p>
              <div className="mt-4 space-y-3">
                <div className="hero-mini-card">
                  <p className="text-sm text-gray-500">Keyword match</p>
                  <p className="mt-1 text-lg font-bold text-gray-900">Missing backend tooling terms</p>
                </div>
                <div className="hero-mini-card">
                  <p className="text-sm text-gray-500">Structure</p>
                  <p className="mt-1 text-lg font-bold text-gray-900">Projects section needs stronger hierarchy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="marquee-shell">
          <div className="marquee-track">
            {[...researchChips, ...researchChips].map((chip, index) => (
              <div key={`${chip}-${index}`} className="marquee-chip">
                {chip}
              </div>
            ))}
          </div>
        </div>

        <div id="benefits" className="section-block">
          <div className="section-heading">
            <span className="eyebrow">Why ATS100</span>
            <h2 className="text-4xl font-bold text-gray-900">A landing page for serious resume improvement</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              ATS100 is designed to feel like a focused SaaS product, not a generic AI wrapper. It explains what is wrong, why it matters, and what to improve next.
            </p>
          </div>

          <div className="feature-grid">
            <FeatureCard
              icon="/icons/check.svg"
              title="Built for Real Hiring Systems"
              description="Modern ATS platforms evaluate structure, relevance, and context. ATS100 is designed to mirror that behavior instead of relying on shallow keyword matching."
            />
            <FeatureCard
              icon="/images/pdf.png"
              title="Deep Semantic Analysis"
              description="It detects weak impact, vague experience, and poor role alignment so users understand how their resume reads beyond surface-level terms."
            />
            <FeatureCard
              icon="/icons/info.svg"
              title="Actionable Feedback"
              description="Every insight is mapped to a concrete improvement, from bullet rewrites to layout changes to missing role-fit signals."
            />
          </div>
        </div>

        <div id="workflow" className="section-block">
          <div className="section-heading">
            <span className="eyebrow">Multi-layered analysis</span>
            <h2 className="text-4xl font-bold text-gray-900">Most tools stop at keyword matching. ATS100 goes further.</h2>
          </div>

          <div className="workflow-grid">
            <WorkflowCard
              step="Step 01"
              title="Semantic Intelligence"
              description="Understands the meaning behind experience using role intent extraction, skill-to-impact mapping, and depth scoring."
            />
            <WorkflowCard
              step="Step 02"
              title="Visual Resume Analysis"
              description="Evaluates hierarchy, readability, scan flow, and section balance to measure how the resume is actually consumed."
            />
            <WorkflowCard
              step="Step 03"
              title="Hiring Simulation"
              description="Simulates recruiter and AI screening with role alignment scoring, benchmarking, and expectation matching."
            />
          </div>

          <div id="sample-report" className="sample-report">
            <div className="sample-stack">
              <div className="sample-card sample-card-primary">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#606beb]">Section-wise breakdown</p>
                <div className="mt-5 space-y-4">
                  {[
                    ["ATS", "91"],
                    ["Content", "82"],
                    ["Structure", "78"],
                    ["Skills", "86"],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between rounded-2xl bg-[#f7f8ff] px-4 py-3">
                      <span className="text-gray-600">{label}</span>
                      <span className="font-bold text-gray-900">{value}/100</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="sample-card sample-card-secondary">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#606beb]">Role-fit confidence</p>
                <p className="mt-3 text-5xl font-bold text-gray-900">88%</p>
                <p className="mt-3 text-gray-600">
                  Strong match for frontend roles, but missing clearer accessibility and testing impact signals.
                </p>
              </div>

              <div className="sample-card sample-card-tertiary">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#606beb]">Bullet rewrite suggestions</p>
                <p className="mt-3 text-gray-600">
                  Reframe vague responsibilities into quantified outcomes with stronger product, engineering, and collaboration language.
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-center gap-6">
              <span className="eyebrow w-fit">Report output</span>
              <h2 className="text-4xl font-bold text-gray-900">The report feels structured, premium, and easy to act on.</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Users get an ATS score, section-wise breakdown, semantic gap detection, role-fit confidence, and practical suggestions that make resume improvement feel immediate.
              </p>
              <div className="hero-proof">
                <div className="hero-proof-pill">ATS score 0-100</div>
                <div className="hero-proof-pill">Semantic + keyword gaps</div>
                <div className="hero-proof-pill">Rewrite-ready suggestions</div>
              </div>
            </div>
          </div>
        </div>

        {!auth.isAuthenticated && (
          <div className="cta-panel mb-28">
            <h2 className="text-4xl font-bold mb-6 !text-white">Stop guessing what is wrong with your resume.</h2>
            <p className="text-white/80 text-xl mb-10 max-w-3xl mx-auto">
              Get precise feedback, understand how hiring systems read your resume, and improve it in minutes.
            </p>
            <button
              onClick={() => auth.signIn()}
              className="bg-white text-[#606beb] px-12 py-5 rounded-full text-2xl font-bold hover:bg-gray-50 hover:scale-105 transition-all shadow-xl"
            >
              Analyze Resume
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

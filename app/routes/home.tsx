import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import { usePuterStore } from "~/lib/puter";
import { Link } from "react-router";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "ATS100 | Free AI Resume Analyzer & ATS Scanner" },
    { name: "description", content: "Optimize your resume with ATS100. Get free AI-powered feedback, bypass ATS filters, and land more interviews. The raw, honest truth about your resume." },
    { name: "keywords", content: "ATS scanner, resume analyzer, free ATS check, AI resume builder, bypass applicant tracking system, resume feedback, job application help" },
    
    // Open Graph / Facebook
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://ats100x.vercel.app/" },
    { property: "og:title", content: "ATS100 | Free AI Resume Analyzer & ATS Scanner" },
    { property: "og:description", content: "Stop sending resumes into the void. Get raw feedback and exact fixes to bypass AI filters and land more interviews." },
    { property: "og:image", content: "https://ats100x.vercel.app/og-image.png" },

    // Twitter
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:url", content: "https://ats100x.vercel.app/" },
    { name: "twitter:title", content: "ATS100 | Free AI Resume Analyzer & ATS Scanner" },
    { name: "twitter:description", content: "Stop getting ghosted. Start getting hired. The AI-powered resume analyzer built for developers and professionals." },
    { name: "twitter:image", content: "https://ats100x.vercel.app/og-image.png" },

    // Robots
    { name: "robots", content: "index, follow" },
    { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=5" },
    { name: "theme-color", content: "#606beb" },
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
      <img src={icon} alt={`${title} Icon`} className="size-6" loading="lazy" />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed font-medium">{description}</p>
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
    <p className="mt-4 text-gray-600 leading-relaxed font-medium">{description}</p>
  </div>
);

const researchChips = [
  "No more ghosting",
  "Actually helpful advice",
  "FAANG-level standards",
  "Bullet fixes that work",
  "Pass the 6-second test",
  "Quantify your worth",
  "Kill the clichés",
  "Visual flow audit",
  "Recruiter's perspective",
];

export default function Home() {
  const { auth } = usePuterStore();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "ATS100",
    "operatingSystem": "Web",
    "applicationCategory": "CareerApplication",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "1250"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "An AI-powered resume analyzer that helps job seekers bypass ATS filters and land more interviews by providing direct feedback and fixes.",
    "url": "https://ats100x.vercel.app/"
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is this ATS scanner really free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, it’s completely free to use. We built this to help job seekers bypass the robotic filters that keep great candidates from getting hired."
        }
      },
      {
        "@type": "Question",
        "name": "How does AI resume analysis work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We use advanced AI to simulate how both Applicant Tracking Systems (ATS) and human recruiters read your resume, identifying weak points and missing keywords."
        }
      },
      {
        "@type": "Question",
        "name": "How can I rank higher in ATS scanning?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our tool provides a detailed breakdown of keyword matching, impact metrics, and structural fixes that specifically target ATS scoring algorithms."
        }
      }
    ]
  };

  return (
    <main className="landing-shell min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Navbar />

      <section className="main-section flex-grow !gap-16 !pt-16">
        <div className="landing-grid">
          <div className="hero-copy">
            <span className="eyebrow">Stop sending resumes into the void</span>

            <h1 className="text-pretty max-w-5xl leading-[1.02] tracking-tighter">
              Stop Getting Ghosted.
              <br />
              <span className="text-[#606beb]">Start Getting Hired.</span>
            </h1>

            <p className="text-xl text-gray-700 font-medium leading-relaxed">
              Applying for jobs shouldn't feel like a guessing game. We show you exactly how hiring managers and AI filters read your resume, so you can fix it before you hit apply.
            </p>

            <p className="text-lg text-gray-500 leading-relaxed">
              Recruiters spend about 6 seconds on your resume. If you don't wow them immediately, you're out. We help you make those seconds count.
            </p>

            <div className="flex flex-row gap-4 flex-wrap">
              {auth.isAuthenticated ? (
                <Link to="/upload" className="primary-button px-10 py-4 text-xl font-semibold w-fit">
                  Check My Resume
                </Link>
              ) : (
                <button
                  onClick={() => auth.signIn()}
                  className="primary-button px-12 py-4 text-xl font-semibold w-fit"
                >
                  Check My Resume
                </button>
              )}

              <a
                href="#sample-report"
                className="px-10 py-4 border-2 border-gray-200 rounded-full text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                See How It Works
              </a>
            </div>

            <div className="hero-proof">
              <div className="hero-proof-pill">Direct, Honest Feedback</div>
              <div className="hero-proof-pill">Step-by-Step Fixes</div>
              <div className="hero-proof-pill">Proven Results</div>
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
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#606beb]">Hiring Probability</p>
                    <p className="mt-3 text-6xl font-bold text-gray-900">92</p>
                  </div>
                  <div className="rounded-2xl bg-[#edf1ff] px-4 py-2 text-sm font-semibold text-[#606beb]">
                    High Visibility
                  </div>
                </div>
                <div className="mt-5 h-3 rounded-full bg-[#e8ecff]">
                  <div className="h-3 w-[92%] rounded-full bg-gradient-to-r from-[#8e98ff] to-[#606beb]" />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="hero-mini-card">
                  <p className="text-sm text-gray-500">Industry Tone</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">Nailed it</p>
                </div>
                <div className="hero-mini-card">
                   <p className="text-sm text-gray-500">Impact Score</p>
                   <p className="mt-2 text-2xl font-bold text-[#606beb]">Strong</p>
                </div>
              </div>

              <div className="mt-4 rounded-[28px] bg-[#f7f8ff] p-4">
                <p className="text-sm font-semibold text-gray-900">The One Big Fix</p>
                <p className="mt-2 text-gray-600">
                  Your experience section is way too vague. Use actual numbers to show what you really achieved.
                </p>
              </div>
            </div>

            <div className="hero-panel hero-panel-side">
              <img src="/images/resume_02.png" className="rounded-[24px] shadow-lg" alt="AI Resume Analysis Screenshot" loading="lazy" />
              <div className="mt-4 hero-mini-card">
                <p className="text-sm text-gray-500">Visual Vibe</p>
                <p className="mt-2 text-xl font-bold text-gray-900">Clean & Easy to Read</p>
              </div>
            </div>

            <div className="hero-panel hero-panel-bottom">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#606beb]">What Managers See</p>
              <div className="mt-4 space-y-3">
                <div className="hero-mini-card">
                  <p className="text-sm text-gray-500">Role Alignment</p>
                  <p className="mt-1 text-lg font-bold text-gray-900">Perfect for Senior Dev roles</p>
                </div>
                <div className="hero-mini-card">
                  <p className="text-sm text-gray-500">Communication</p>
                  <p className="mt-1 text-lg font-bold text-gray-900">Clear, professional voice</p>
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
            <span className="eyebrow">Real Talk. No Fluff.</span>
            <h2 className="text-4xl font-bold text-gray-900">Why most resumes fail (and how we fix them)</h2>
            <p className="text-lg text-gray-600 leading-relaxed font-medium">
              We're not just another keyword scanner. We tell you exactly why you're being rejected, what actually matters to recruiters, and how to improve your status in minutes.
            </p>
          </div>

          <div className="feature-grid">
            <FeatureCard
              icon="/icons/check.svg"
              title="The Brutal Truth"
              description="Get the raw feedback you wish recruiters would tell you. We flag exactly what's weak and what will get you rejected immediately."
            />
            <FeatureCard
              icon="/images/pdf.png"
              title="Pass the AI Gatekeepers"
              description="Modern companies use machines to filter you out. We show you how to structure your resume so it actually gets seen by a person."
            />
            <FeatureCard
              icon="/icons/info.svg"
              title="Better Bullet Points"
              description="Stop listing duties. We help you rewrite your experience to show real results, making you look like the high-performer you are."
            />
          </div>
        </div>

        <div id="workflow" className="section-block">
          <div className="section-heading">
            <span className="eyebrow">The Game Plan</span>
            <h2 className="text-4xl font-bold text-gray-900">How we turn your resume into a job-landing machine</h2>
          </div>

          <div className="workflow-grid">
            <WorkflowCard
              step="Step 01"
              title="Deep Content Audit"
              description="We dive into the meaning behind your words to see if you're actually showing the value companies are looking for."
            />
            <WorkflowCard
              step="Step 02"
              title="Visual Flow Check"
              description="If a recruiter can't find your core skills in 6 seconds, you've lost. we make sure your resume is readable and focused."
            />
            <WorkflowCard
              step="Step 03"
              title="Role-Match Simulation"
              description="We test your profile against what top companies expect, so you can walk into interviews with total confidence."
            />
          </div>

          <div id="sample-report" className="sample-report">
            <div className="sample-stack">
              <div className="sample-card sample-card-primary">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#606beb]">Real Insights</p>
                <div className="mt-5 space-y-4">
                  {[
                    ["Search Ranking", "91"],
                    ["Impact Strength", "82"],
                    ["Visual Clarity", "78"],
                    ["Skill Relevance", "86"],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between rounded-2xl bg-[#f7f8ff] px-4 py-3">
                      <span className="text-gray-600">{label}</span>
                      <span className="font-bold text-gray-900">{value}/100</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="sample-card sample-card-secondary">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#606beb]">The Manager's Verdict</p>
                <p className="mt-3 text-5xl font-bold text-gray-900">88%</p>
                <p className="mt-3 text-gray-600 font-medium">
                  "You look great on paper for Senior roles, but you need to highlight your leadership impact more clearly."
                </p>
              </div>

              <div className="sample-card sample-card-tertiary">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#606beb]">One-Click Fixes</p>
                <p className="mt-3 text-gray-600 font-medium">
                  Get a perfectly formatted prompt to help you rewrite every single bullet point into a power statement.
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-center gap-6">
              <span className="eyebrow w-fit">More than just a score</span>
              <h2 className="text-4xl font-bold text-gray-900">Clear, honest feedback that actually leads to interviews.</h2>
              <p className="text-lg text-gray-600 leading-relaxed font-medium">
                Join thousands of developers and professionals who have stopped guessing. Get the feedback that actually moves the needle on your career.
              </p>
              <div className="hero-proof">
                <div className="hero-proof-pill">No Fluff</div>
                <div className="hero-proof-pill">Real Feedback</div>
                <div className="hero-proof-pill">Real Results</div>
              </div>
            </div>
          </div>
        </div>

        <div id="faq" className="section-block !mb-32">
          <div className="section-heading mb-16">
            <span className="eyebrow">Got Questions?</span>
            <h2 className="text-4xl font-bold text-gray-900">Frequently Asked Questions</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="dashboard-card !p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Is this ATS scanner really free?</h3>
              <p className="text-gray-600 leading-relaxed font-medium">
                Yes, it's completely free to use. We built this to help job seekers bypass the robotic filters that keep great candidates from getting hired.
              </p>
            </div>
            <div className="dashboard-card !p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">How does AI resume analysis work?</h3>
              <p className="text-gray-600 leading-relaxed font-medium">
                We use advanced AI to simulate how both Applicant Tracking Systems (ATS) and human recruiters read your resume, identifying weak points and missing keywords.
              </p>
            </div>
            <div className="dashboard-card !p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">What file formats do you support?</h3>
              <p className="text-gray-600 leading-relaxed font-medium">
                We support PDF, DOCX, and TXT files. PDF is recommended for visual audit accuracy, while DOCX is great for semantic keyword analysis.
              </p>
            </div>
            <div className="dashboard-card !p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">How can I rank higher in ATS scanning?</h3>
              <p className="text-gray-600 leading-relaxed font-medium">
                Our tool provides a detailed breakdown of keyword matching, impact metrics, and structural fixes that specifically target ATS scoring algorithms.
              </p>
            </div>
          </div>
        </div>

        {!auth.isAuthenticated && (
          <div className="cta-panel mb-28">
            <h2 className="text-4xl font-bold mb-6 !text-white tracking-tight">Stop guessing why you aren't getting hired.</h2>
            <p className="text-white/80 text-xl mb-10 max-w-3xl mx-auto font-medium">
              Get the feedback you need to bypass the filters and land the role you deserve. It takes less than a minute.
            </p>
            <button
              onClick={() => auth.signIn()}
              className="bg-white text-indigo-600 px-14 py-6 rounded-full text-2xl font-black hover:bg-indigo-50 hover:scale-105 transition-all shadow-2xl"
            >
              Check Your Resume Now
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

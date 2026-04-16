import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "ATS100 | Optimize Your Resume with AI" },
    { name: "description", content: "Beat the ATS with smart AI-powered resume feedback and keyword optimization." },
  ];
}

const FeatureCard = ({ title, description, icon }: { title: string, description: string, icon: string }) => (
    <div className="gradient-border p-8 flex flex-col gap-4 bg-white/40 backdrop-blur-md hover:scale-[1.02] transition-transform duration-300">
        <div className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm">
            <img src={icon} alt={title} className="size-6" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
)

const MethodStep = ({ step, title, description }: { step: string, title: string, description: string }) => (
    <div className="flex flex-col gap-4 p-6 border-l-2 border-[#8e98ff]/30 relative">
        <div className="absolute -left-[11px] top-6 w-5 h-5 bg-[#8e98ff] rounded-full border-4 border-white shadow-sm" />
        <span className="text-sm font-bold text-[#606beb] uppercase tracking-wider">{step}</span>
        <h4 className="text-lg font-bold text-gray-900">{title}</h4>
        <p className="text-gray-600">{description}</p>
    </div>
)

export default function Home() {
  const { auth, puterReady } = usePuterStore();

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen flex flex-col">
      <Navbar />

      <section className="main-section flex-grow">
        {/* HERO SECTION */}
        <div className="page-heading pt-20 pb-16">
          <h1 className="text-pretty max-w-5xl leading-[1.1] mb-6">
            Unlock Your Career Potential with <span className="text-[#606beb]">AI-Powered</span> Precision
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-10">
            Standardize your professional edge with ATS100. Get instant feedback, score optimization, and keyword analysis driven by world-class AI.
          </p>
          
          <div className="flex flex-row gap-4 justify-center">
            {auth.isAuthenticated ? (
                <Link to="/upload" className="primary-button px-10 py-4 text-xl font-semibold w-fit">
                    Analyze New Resume
                </Link>
            ) : (
                <button 
                    onClick={() => auth.signIn()} 
                    className="primary-button px-12 py-4 text-xl font-semibold w-fit"
                >
                    Get Started for Free
                </button>
            )}
            <a href="#benefits" className="px-10 py-4 border-2 border-gray-200 rounded-full text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
                Learn More
            </a>
          </div>
        </div>

        {/* BENEFITS SECTION */}
        <div id="benefits" className="w-full max-w-6xl mt-24 mb-32">
            <div className="text-center mb-16">
                <span className="text-[#606beb] font-bold uppercase tracking-widest text-sm">Why Choose ATS100</span>
                <h2 className="text-4xl font-bold mt-4">Built for the Modern Job Market</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <FeatureCard 
                    icon="/icons/check.svg"
                    title="Beat the ATS"
                    description="Our engine identifies keyword gaps and semantic mismatches that trigger automatic rejections by major hiring platforms."
                />
                <FeatureCard 
                    icon="/images/pdf.png"
                    title="Visual Intelligence"
                    description="We don't just read text; we see your resume as a recruiter does, analyzing layout, impact, and white-space balance."
                />
                <FeatureCard 
                    icon="/icons/info.svg"
                    title="Instant Insights"
                    description="Receive a comprehensive ATS score and categorized improvement tips within seconds of uploading any document."
                />
            </div>
        </div>

        {/* METHODOLOGY SECTION */}
        <div className="w-full max-w-5xl mb-32 bg-white/40 backdrop-blur-md rounded-[40px] p-12 border border-white/50 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                    <h2 className="text-4xl font-bold mb-8 leading-tight">Our Multi-Layered Analysis</h2>
                    <p className="text-gray-600 mb-8">
                        Most platforms only perform keyword matching. ATS100 uses a sophisticated pipeline to ensure your resume is ready for both robots and humans.
                    </p>
                    <div className="flex flex-col gap-2">
                         <MethodStep 
                            step="Step 01"
                            title="Semantic Extraction"
                            description="Deep parsing of your professional history to understand the 'meaning' of your experience, not just labels."
                        />
                        <MethodStep 
                            step="Step 02"
                            title="Visual Resume Mapping"
                            description="Converting your PDF into high-resolution imagery for spatial analysis of your resume's design impact."
                        />
                         <MethodStep 
                            step="Step 03"
                            title="Claude AI Verification"
                            description="Leveraging Claude-3-Haiku to cross-reference your resume against the industry-specific job expectations."
                        />
                    </div>
                </div>
                <div className="relative group">
                    <div className="absolute -inset-4 bg-gradient-to-tr from-[#8e98ff]/20 to-[#606beb]/20 rounded-[40px] blur-2xl group-hover:blur-3xl transition-all duration-500" />
                    <img src="/images/resume-scan.gif" className="relative rounded-[32px] shadow-2xl w-full" alt="process" />
                </div>
            </div>
        </div>

        {/* FINAL CTA */}
        {!auth.isAuthenticated && (
            <div className="w-full max-w-4xl text-center mb-32 py-20 bg-gradient-to-b from-[#8e98ff] to-[#606beb] rounded-[48px] shadow-2xl text-white px-8">
                <h2 className="text-4xl font-bold mb-6 !text-white">Ready to Land Your Dream Job?</h2>
                <p className="text-white/80 text-xl mb-10">Join thousands of candidates who have optimized their success with ATS100.</p>
                <button 
                    onClick={() => auth.signIn()} 
                    className="bg-white text-[#606beb] px-12 py-5 rounded-full text-2xl font-bold hover:bg-gray-50 hover:scale-105 transition-all shadow-xl"
                >
                    Get Started Now
                </button>
            </div>
        )}
      </section>
    </main>
  )
}

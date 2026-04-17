import { Link } from "react-router";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import type { Route } from "./+types/resume";
import { normalizeFeedbackScores } from "~/lib/scoring";
import { cn } from "~/lib/utils";

export const meta = () => ([
    { title: "ATS100 | Resume Analysis Report" },
    { name: "description", content: "Detailed ATS readiness, role-fit, and resume quality assessment." },
]);

const Resume = ({ params }: Route.ComponentProps) => {
    const { auth, fs, kv, puterReady } = usePuterStore();
    const { id } = params;
    const [imageUrl, setImageUrl] = useState("");
    const [resumeUrl, setResumeUrl] = useState("");
    const [feedback, setFeedback] = useState<Feedback | null>(null);

    useEffect(() => {
        const loadResume = async () => {
            if (!auth.isAuthenticated) return;

            try {
                const resume = await kv.get(`resume:${id}`);

                if (!resume) {
                    console.error("Resume not found");
                    return;
                }

                const data = JSON.parse(resume) as Resume;

                const resumeBlob = await fs.read(data.resumePath);
                if (resumeBlob) {
                    const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
                    const url = URL.createObjectURL(pdfBlob);
                    setResumeUrl(url);
                }

                const imageBlob = await fs.read(data.imagePath);
                if (imageBlob) {
                    const url = URL.createObjectURL(imageBlob);
                    setImageUrl(url);
                }

                setFeedback(normalizeFeedbackScores(data.feedback));
            } catch (err) {
                console.error("Failed to load resume details:", err);
            }
        };

        if (puterReady) {
            loadResume();
        }
    }, [id, auth.isAuthenticated, puterReady, fs, kv]);

    return (
        <main className="product-shell !pt-0">
            <nav className="navbar !bg-transparent !px-6 border-b border-gray-100">
                <div className="flex items-center gap-6">
                    <Link to="/profile" className="back-button !border-none !shadow-none hover:!bg-gray-100/50 transition-all">
                        <img src="/icons/back.svg" alt="back" className="size-3" />
                        <span className="text-gray-600 font-semibold">Dashboard</span>
                    </Link>
                    <div className="h-6 w-px bg-gray-200" />
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Report #{id.slice(0, 8)}</p>
                </div>
                <div className="flex items-center gap-4">
                    {resumeUrl && (
                        <a
                            href={resumeUrl}
                            download
                            className="soft-button"
                        >
                            Download Original
                        </a>
                    )}
                </div>
            </nav>

            <section className="main-section !pt-12 !pb-20">
                <div className="product-grid max-w-[1400px] !gap-12">
                    {/* Left side: Sticky Preview */}
                    <aside className="relative">
                        <div className="sticky top-12 flex flex-col gap-8">
                            <div className="report-highlight !p-2 !rounded-[32px] shadow-2xl overflow-hidden bg-white/40 border-white/60">
                                {imageUrl && resumeUrl ? (
                                    <div className="group relative">
                                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10" />
                                        <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                                            <img
                                                src={imageUrl}
                                                className="w-full h-auto object-contain rounded-[24px] shadow-sm transform transition-transform group-hover:scale-[1.01]"
                                                title="resume"
                                                alt="resume"
                                            />
                                        </a>
                                    </div>
                                ) : (
                                    <div className="flex min-h-[700px] flex-col items-center justify-center gap-4 text-center rounded-[24px] bg-white/60">
                                        {!auth.isAuthenticated ? (
                                            <p className="text-gray-500">Sign in to view this ATS report</p>
                                        ) : (
                                            <div className="flex flex-col items-center gap-4">
                                                <img src="/images/resume-scan-2.gif" alt="loading" className="w-24 opacity-60" />
                                                <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Loading Document...</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="px-6 flex flex-col gap-2">
                                <h3 className="font-bold text-gray-800">Visual Summary</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    Our visual engine analyze hierarchy, font sizes, and whitespace usage to simulate human recruiter scanning patterns.
                                </p>
                            </div>
                        </div>
                    </aside>

                    {/* Right side: Analysis Content */}
                    <div className="flex flex-col gap-12">
                        <header className="flex flex-col gap-4">
                            <span className="eyebrow w-fit">Performance Dashboard</span>
                            <h1 className="text-5xl font-black !text-black leading-[1.1]">Elite Analysis Report</h1>
                            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                                We've analyzed your resume against modern ATS algorithms and human hiring psychology. Here is your definitive roadmap to better conversions.
                            </p>
                        </header>

                        {!auth.isAuthenticated ? (
                            <div className="dashboard-card flex flex-col gap-8 items-center text-center p-12">
                                <div className="size-20 bg-[#eef2ff] rounded-full flex items-center justify-center">
                                    <img src="/icons/info.svg" className="size-10" alt="auth" />
                                </div>
                                <div className="max-w-md">
                                    <h2 className="!text-black">Account Required</h2>
                                    <p className="text-lg text-gray-600 mt-2">Please sign in to access your detailed ATS, semantic, and role alignment report.</p>
                                </div>
                                <button
                                    onClick={() => auth.signIn()}
                                    className="primary-button w-fit px-12 py-4 text-lg font-bold"
                                >
                                    Sign In with Puter
                                </button>
                            </div>
                        ) : feedback ? (
                            <div className="flex flex-col gap-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                                <Summary feedback={feedback} />
                                <ATS score={feedback.ATS?.score || 0} suggestions={feedback.ATS?.tips || []} />
                                <Details feedback={feedback} />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 gap-6">
                                <img src="/images/resume-scan-2.gif" alt="loading_resume" className="w-40" />
                                <p className="text-gray-400 font-bold uppercase tracking-tighter">Synthesizing Feedback...</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Resume;

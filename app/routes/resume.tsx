import { Link } from "react-router";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import type { Route } from "./+types/resume";
import { normalizeFeedbackScores } from "~/lib/scoring";
import { cn } from "~/lib/utils";
import { extractTextFromPdf } from "~/lib/pdf2img";
import { prepareInstructions } from "../../constants";

export const meta = () => ([
    { title: "Your Resume Report | ATS100 Optimizer" },
    { name: "description", content: "Comprehensive ATS score, keyword audit, and hiring manager feedback for your resume." },
    { name: "robots", content: "noindex, follow" },
]);

const Resume = ({ params }: Route.ComponentProps) => {
    const { auth, fs, ai, kv, ui, puterReady } = usePuterStore();
    const { id } = params;
    const [imageUrl, setImageUrl] = useState("");
    const [resumeUrl, setResumeUrl] = useState("");
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [resumeData, setResumeData] = useState<any>(null);
    const [isReanalyzing, setIsReanalyzing] = useState(false);

    useEffect(() => {
        const loadResume = async () => {
            if (!auth.isAuthenticated) return;

            try {
                const resume = await kv.get(`resume:${id}`);

                if (!resume) {
                    console.error("Resume not found");
                    return;
                }

                const data = JSON.parse(resume) as any;
                setResumeData(data);

                const resumeBlob = await fs.read(data.resumePath);
                if (resumeBlob) {
                    const pdfBlob = new Blob([resumeBlob as BlobPart], { type: "application/pdf" });
                    const url = URL.createObjectURL(pdfBlob);
                    setResumeUrl(url);
                }

                if (data.imagePath) {
                    const imageBlob = await fs.read(data.imagePath);
                    if (imageBlob) {
                        const url = URL.createObjectURL(imageBlob as BlobPart);
                        setImageUrl(url);
                    }
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

    const handleReanalyze = async () => {
        if (!resumeData || !resumeData.resumePath) return;
        setIsReanalyzing(true);
        try {
            const resumeBlob = await fs.read(resumeData.resumePath);
            if (!resumeBlob) throw new Error("Could not locate original resume file in storage.");
            
            const ext = resumeData.resumePath.split(".").pop()?.toLowerCase();
            const file = new File([resumeBlob as BlobPart], `resume.${ext || "pdf"}`, { 
                type: ext === "pdf" ? "application/pdf" : ext === "docx" ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document" : "text/plain" 
            });
            
            let text = "";
            if (ext === "pdf") {
                text = await extractTextFromPdf(file);
            } else if (ext === "docx") {
                text = await ai.extractTextFromDocx(file);
            } else {
                text = await file.text();
            }
            
            const feedbackResponse = await ai.feedback(text, prepareInstructions({ jobTitle: resumeData.jobTitle, jobDescription: resumeData.jobDescription }), "text");
            if (!feedbackResponse) throw new Error("AI returned empty response.");
            
            const content = typeof feedbackResponse.message.content === "string" ? feedbackResponse.message.content : (feedbackResponse.message.content as any)[0]?.text;
            
            let cleanJson = content;
            const firstBrace = content.indexOf('{');
            const lastBrace = content.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
                cleanJson = content.substring(firstBrace, lastBrace + 1);
            } else if (content.includes("\`\`\`json")) {
                cleanJson = content.split("\`\`\`json")[1].split("\`\`\`")[0].trim();
            }
            
            const parsedFeedback = JSON.parse(cleanJson);
            const normalizedFeedback = normalizeFeedbackScores(parsedFeedback);
            
            const updatedData = { ...resumeData, feedback: normalizedFeedback };
            await kv.set(`resume:${id}`, JSON.stringify(updatedData));
            
            setFeedback(normalizedFeedback);
            setResumeData(updatedData);
            
            ui.notify({title: "Analysis Complete", text: "Your resume report has been updated.", icon: "success"});
        } catch (err: any) {
            console.error("Reanalyze failed:", err);
            ui.alert("Reanalyze Failed", err?.message || String(err));
        } finally {
            setIsReanalyzing(false);
        }
    };

    const handleCopyPrompt = () => {
        if (!feedback) return;
        
        let promptText = `I have received an expert ATS and Senior Hiring Manager review of my resume. Please act as an expert Resume Writer and help me fix my resume based on this specific feedback.\n\n`;
        
        promptText += `### OVERALL RATING: ${feedback.overallScore}/100\n\n`;
        
        const formatSection = (title: string, sectionFeedback: any) => {
            if (!sectionFeedback || !sectionFeedback.tips || sectionFeedback.tips.length === 0) return "";
            let text = `### ${title} (Section Score: ${sectionFeedback.score}/100)\n`;
            sectionFeedback.tips.forEach((t: any) => {
                text += `- ${t.tip}\n`;
                if (t.explanation) {
                    text += `  Reason: ${t.explanation}\n`;
                }
            });
            return text + `\n`;
        };

        promptText += formatSection("ATS Optimization & Keywords", feedback.ATS);
        promptText += formatSection("Content & Impact (Brutal Truth)", feedback.content);
        promptText += formatSection("Bullet Point Structure", feedback.structure);
        promptText += formatSection("Industry Tone & Role Alignment", feedback.skills);
        promptText += formatSection("Final Polish & Grammar", feedback.toneAndStyle);
        
        promptText += `\nPlease review my provided resume and completely rewrite it to directly address and resolve all the weaknesses listed in this report.`;

        navigator.clipboard.writeText(promptText);
        ui.notify({title: "Prompt Copied!", text: "You can now paste this into ChatGPT, Claude, etc.", icon: "success"});
    };

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
                    {feedback && (
                        <button
                            onClick={handleCopyPrompt}
                            className="soft-button !bg-indigo-50 !text-indigo-600 hover:!bg-indigo-100 border !border-indigo-100"
                        >
                            Copy Prompt
                        </button>
                    )}
                    <button
                        onClick={handleReanalyze}
                        disabled={isReanalyzing || !resumeData}
                        className={cn(
                            "soft-button",
                            isReanalyzing && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        {isReanalyzing ? "Reanalyzing..." : "Reanalyze Resume"}
                    </button>
                </div>
            </nav>

            <section className="main-section !pt-12 !pb-20">
                <div className="product-grid max-w-[1400px] !gap-12">
                    {/* Left side: Sticky Preview */}
                    <aside className="relative">
                        <div className="sticky top-12 flex flex-col gap-8">
                            <div className="report-highlight !p-2 !rounded-[32px] shadow-2xl overflow-hidden bg-white/40 border-white/60">
                                {imageUrl && resumeUrl ? (
                                    <div className="group relative max-h-[75vh] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full rounded-[24px]">
                                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10" />
                                        <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                                            <img
                                                src={imageUrl}
                                                className="w-full h-auto object-contain rounded-[24px] shadow-sm transform transition-transform"
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

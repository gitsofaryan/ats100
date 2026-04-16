import { type FormEvent, useMemo, useState } from "react";
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { convertPdfToImage, extractTextFromPdf } from "~/lib/pdf2img";
import { generateUUID } from "~/lib/utils";
import { prepareInstructions } from "../../constants";
import { canRunAnalysis, recordAnalysisUsage } from "~/lib/billing";
import { normalizeFeedbackScores } from "~/lib/scoring";

const Upload = () => {
    const { auth, fs, ai, kv, ui } = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const analysisChecklist = useMemo(() => ([
        "ATS compatibility scoring",
        "Semantic role-fit analysis",
        "Visual structure review",
        "Bullet and section improvement guidance",
    ]), []);

    const handleFileSelect = (selectedFile: File | null) => {
        setFile(selectedFile);
    };

    const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobTitle: string, jobDescription: string, file: File }) => {
        if (!auth.isAuthenticated) {
            await auth.signIn();
            return;
        }

        const username = auth.user?.username;
        if (!username) {
            ui.alert("Account Error", "We could not load your Puter account. Please sign in again.");
            return;
        }

        const gate = await canRunAnalysis(kv, username);
        if (!gate.allowed) {
            ui.alert("Usage Limit Reached", gate.reason || "You have reached your usage limit.");
            return;
        }

        setIsProcessing(true);

        try {
            const ext = file.name.split(".").pop()?.toLowerCase();
            let feedbackResponse;
            let resumePath = "";
            let imagePath = "";

            if (ext === "pdf") {
                setStatusText("Uploading resume to Puter...");
                const uploadedFile = await fs.upload([file]);
                const fileItem = Array.isArray(uploadedFile) ? uploadedFile[0] : uploadedFile;
                if (!fileItem || !fileItem.path) throw new Error("Failed to upload file");
                resumePath = fileItem.path;

                setStatusText("Preparing visual resume analysis...");
                const imageResult = await convertPdfToImage(file);
                if (imageResult.file) {
                    const uploadedImage = await fs.upload([imageResult.file]);
                    const imageItem = Array.isArray(uploadedImage) ? uploadedImage[0] : uploadedImage;
                    if (imageItem?.path) imagePath = imageItem.path;
                }

                setStatusText("Extracting semantic data...");
                const text = await extractTextFromPdf(file);

                setStatusText("Running ATS and role-fit analysis...");
                feedbackResponse = await ai.feedback(text, prepareInstructions({ jobTitle, jobDescription }), "text");
            } else if (ext === "docx" || ext === "txt") {
                let text = "";

                if (ext === "docx") {
                    setStatusText("Extracting text from DOCX...");
                    text = await ai.extractTextFromDocx(file);
                } else {
                    setStatusText("Reading text file...");
                    text = await file.text();
                }

                setStatusText("Uploading original document to Puter...");
                const uploadedFile = await fs.upload([file]);
                const fileItem = Array.isArray(uploadedFile) ? uploadedFile[0] : uploadedFile;
                if (fileItem?.path) resumePath = fileItem.path;

                setStatusText("Running ATS and semantic analysis...");
                feedbackResponse = await ai.feedback(text, prepareInstructions({ jobTitle, jobDescription }), "text");
            } else {
                throw new Error("Unsupported file format");
            }

            if (!feedbackResponse) throw new Error("The AI model failed to produce an initial response. Please check your file content and try again.");

            const feedbackText = typeof feedbackResponse.message.content === "string"
                ? feedbackResponse.message.content
                : (feedbackResponse.message.content as any)[0]?.text || "";

            if (!feedbackText) throw new Error("The AI model returned an empty response. This might happen if the file content is unreadable.");

            console.log("Raw Analysis Response:", feedbackText);

            let cleanJson = feedbackText;
            
            // Robust JSON extraction: Find the first '{' and last '}'
            // Most AI models wrap JSON in markdown or preamble text.
            const firstBrace = feedbackText.indexOf('{');
            const lastBrace = feedbackText.lastIndexOf('}');
            
            if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
                cleanJson = feedbackText.substring(firstBrace, lastBrace + 1);
            } else {
                // Fallback to backtick extraction if braces logic fails
                if (feedbackText.includes("```json")) {
                    cleanJson = feedbackText.split("```json")[1].split("```")[0].trim();
                } else if (feedbackText.includes("```")) {
                    cleanJson = feedbackText.split("```")[1].split("```")[0].trim();
                }
            }

            let parsedFeedback;
            try {
                parsedFeedback = JSON.parse(cleanJson);
            } catch (pErr) {
                console.error("Critical JSON Parse Failure. Cleaned text attempted:", cleanJson);
                throw new Error("The analysis response was corrupted. Try another model or check if your document text is extractable.");
            }

            const normalizedFeedback = normalizeFeedbackScores(parsedFeedback);

            const data = {
                id: generateUUID(),
                resumePath,
                imagePath,
                companyName,
                jobTitle,
                jobDescription,
                createdAt: new Date().toISOString(),
                feedback: normalizedFeedback,
            };

            setStatusText("Saving report...");
            await kv.set(`resume:${data.id}`, JSON.stringify(data));
            await recordAnalysisUsage(kv, username);

            ui.notify({
                title: "Resume Analyzed!",
                text: `Score: ${data.feedback.overallScore}/100.`,
                icon: "success"
            });

            navigate(`/resume/${data.id}`);
        } catch (err: any) {
            console.error("Deep diagnostic report for analysis failure:", err);
            
            let msg = "An unexpected error occurred during the analysis phase.";
            if (err instanceof Error) {
                msg = err.message;
            } else if (typeof err === "string") {
                msg = err;
            } else if (err && typeof err === "object") {
                // If Puter rejects with a response object, it might have message/text
                msg = err.message || err.text || JSON.stringify(err);
            }

            setStatusText(`Analysis Failed: ${msg}`);
            ui.alert("Analysis Error", msg);
            setIsProcessing(false);
        }
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest("form");
        if (!form || !file) return;
        const formData = new FormData(form);

        const companyName = formData.get("company-name") as string;
        const jobTitle = formData.get("job-title") as string;
        const jobDescription = formData.get("job-description") as string;

        handleAnalyze({ companyName, jobTitle, jobDescription, file });
    };

    return (
        <main className="product-shell">
            <Navbar />

            <section className="main-section !gap-10">
                {/* <div className="dashboard-hero w-full max-w-6xl">
                    <div className="relative z-10 max-w-4xl">
                        <span className="eyebrow mb-5">Upload workspace</span>
                        <h1 className="text-pretty mb-4">Analyze your resume like a modern hiring system would</h1>
                        <p className="text-xl leading-8 text-gray-600">
                            Upload a resume, match it to a role, and generate a weighted ATS report with semantic review, visual structure feedback, and role-fit insight.
                        </p>
                        <div className="hero-proof mt-6">
                            {analysisChecklist.map((item) => (
                                <div key={item} className="hero-proof-pill">{item}</div>
                            ))}
                        </div>
                    </div>
                </div> */}

                <div className="upload-shell">
                    <div className="upload-grid">
                        <div className="dashboard-card">
                            {isProcessing ? (
                                <div className="flex min-h-[520px] flex-col items-center justify-center gap-6 text-center">
                                    <img src="/images/resume-scan.gif" className="w-full max-w-sm rounded-[28px]" width={400} height={300} alt="processing" />
                                    <div>
                                        <h2 className="!text-black">Generating your report</h2>
                                        <p className="mt-3 text-lg text-gray-600">{statusText}</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <span className="eyebrow mb-4">What happens here</span>
                                    <h2 className="!text-black">A better upload experience</h2>
                                    <p className="mt-3 text-lg leading-7 text-gray-600">
                                        The app stores the original file in Puter, analyzes visual structure for PDFs, and then runs a role-aware AI review before saving the final weighted report.
                                    </p>

                                    <div className="mt-8 space-y-4">
                                        {[
                                            ["1", "Upload a PDF, DOCX, or TXT resume"],
                                            ["2", "Add target company and role context"],
                                            ["3", "Generate a weighted ATS and hiring-fit report"],
                                        ].map(([step, text]) => (
                                            <div key={step} className="flex items-start gap-4 rounded-2xl bg-white p-4 shadow-sm">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eef2ff] font-bold text-[#606beb]">
                                                    {step}
                                                </div>
                                                <p className="pt-1 text-gray-600">{text}</p>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {!isProcessing && (
                            <div className="dashboard-card">
                                {!auth.isAuthenticated ? (
                                    <div className="flex min-h-[520px] flex-col items-center justify-center gap-6 text-center">
                                        <span className="eyebrow">Puter-powered account</span>
                                        <h2 className="!text-black">Please sign in to analyze your resume</h2>
                                        <p className="max-w-md text-lg leading-7 text-gray-600">
                                            Resume files, report history, avatar, and future plan controls all stay inside your Puter account without needing a separate backend.
                                        </p>
                                        <button
                                            onClick={() => auth.signIn()}
                                            className="primary-button w-fit px-12 text-xl font-semibold"
                                        >
                                            Sign In with Puter
                                        </button>
                                    </div>
                                ) : (
                                    <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
                                        <div className="mb-2">
                                            <span className="eyebrow mb-4">Report input</span>
                                            <h2 className="!text-black">Set the target role</h2>
                                            <p className="mt-3 text-base leading-7 text-gray-600">
                                                Better role context produces better ATS tips, stronger bullet rewrites, and more useful role-fit scoring.
                                            </p>
                                        </div>

                                        <div className="form-div">
                                            <label htmlFor="company-name">Company Name</label>
                                            <input
                                                type="text"
                                                name="company-name"
                                                placeholder="e.g., Google, Stripe, Razorpay..."
                                                id="company-name"
                                                autoComplete="organization"
                                            />
                                        </div>
                                        <div className="form-div">
                                            <label htmlFor="job-title">Job Title</label>
                                            <input
                                                type="text"
                                                name="job-title"
                                                placeholder="e.g., Software Engineer, Data Analyst..."
                                                id="job-title"
                                                autoComplete="organization-title"
                                            />
                                        </div>
                                        <div className="form-div">
                                            <label htmlFor="job-description">Job Description</label>
                                            <textarea
                                                rows={6}
                                                name="job-description"
                                                placeholder="Paste the role description, required skills, and what the company expects..."
                                                id="job-description"
                                            />
                                        </div>

                                        <div className="form-div">
                                            <label htmlFor="uploader">Upload Resume</label>
                                            <FileUploader onFileSelect={handleFileSelect} />
                                        </div>

                                        <button className="primary-button mt-2" type="submit">
                                            Generate ATS Report
                                        </button>
                                    </form>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Upload;

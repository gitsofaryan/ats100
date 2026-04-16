import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import type { Route } from "./+types/resume";

export const meta = () => ([
    { title: 'ATS100 | Review ' },
    { name: 'description', content: 'Detailed overview of your resume' },
])

const Resume = ({ params }: Route.ComponentProps) => {
    const { auth, isLoading, fs, kv, puterReady } = usePuterStore();
    const { id } = params;
    const [imageUrl, setImageUrl] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [loadingData, setLoadingData] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const loadResume = async () => {
            if (!auth.isAuthenticated) return;
            
            setLoadingData(true);
            try {
                const resume = await kv.get(`resume:${id}`);

                if (!resume) {
                    console.error("Resume not found");
                    return;
                }

                const data = JSON.parse(resume);

                const resumeBlob = await fs.read(data.resumePath);
                if (resumeBlob) {
                    const pdfBlob = new Blob([resumeBlob], { type: 'application/pdf' });
                    const url = URL.createObjectURL(pdfBlob);
                    setResumeUrl(url);
                }

                const imageBlob = await fs.read(data.imagePath);
                if (imageBlob) {
                    const url = URL.createObjectURL(imageBlob);
                    setImageUrl(url);
                }

                setFeedback(data.feedback);
            } catch (err) {
                console.error("Failed to load resume details:", err);
            } finally {
                setLoadingData(false);
            }
        }

        if (puterReady) {
            loadResume();
        }
    }, [id, auth.isAuthenticated, puterReady]);

    return (
        <main className="!pt-0">
            <nav className="resume-nav">
                <Link to="/" className="back-button">
                    <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />
                    <span className="text-gray-800 text-sm font-semibold">Back to Homepage</span>
                </Link>
            </nav>
            <div className="flex flex-row w-full max-lg:flex-col-reverse">
                <section className="feedback-section bg-[url('/images/bg-small.svg')] bg-cover h-[100vh] sticky top-0 items-center justify-center">
                    {imageUrl && resumeUrl ? (
                        <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit">
                            <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={imageUrl}
                                    className="w-full h-full object-contain rounded-2xl"
                                    title="resume"
                                />
                            </a>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-4 text-center">
                             {!auth.isAuthenticated ? (
                                 <p className="text-gray-500">Sign in to view this resume report</p>
                             ) : (
                                 <img src="/images/resume-scan-2.gif" alt="loading" className="w-20" />
                             )}
                        </div>
                    )}
                </section>
                <section className="feedback-section">
                    <h2 className="text-4xl !text-black font-bold">Resume Review</h2>
                    {!auth.isAuthenticated ? (
                        <div className="flex flex-col gap-6 items-start mt-10">
                            <p className="text-xl text-gray-600">Please sign in to access your detailed AI feedback report.</p>
                            <button 
                                onClick={() => auth.signIn()} 
                                className="primary-button w-fit px-12"
                            >
                                Sign In with Puter
                            </button>
                        </div>
                    ) : (
                        <>
                            {feedback ? (
                                <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
                                    <Summary feedback={feedback} />
                                    <ATS score={feedback.ATS?.score || 0} suggestions={feedback.ATS?.tips || []} />
                                    <Details feedback={feedback} />
                                </div>
                            ) : (
                                <img src="/images/resume-scan-2.gif" alt="loading_resume" className="w-full" />
                            )}
                        </>
                    )}
                </section>
            </div>
        </main>
    )
}
export default Resume

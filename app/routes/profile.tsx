import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";

export const meta = () => ([
    { title: 'ATS100 | Your Career Profile' },
    { name: 'description', content: 'Track your resume scores and career growth progress.' },
])

const StatCard = ({ title, value, subtext, trend }: { title: string, value: string | number, subtext: string, trend?: string }) => (
    <div className="gradient-border p-8 bg-white/40 backdrop-blur-md flex flex-col gap-2">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
        <div className="flex items-end gap-3 text-pretty">
            <h3 className="text-5xl font-bold !text-black">{value}</h3>
            {trend && <span className="text-green-600 font-bold mb-2">{trend}</span>}
        </div>
        <p className="text-gray-600 text-sm mt-2">{subtext}…</p>
    </div>
)

const Profile = () => {
    const { auth, kv, fs, ui, puterReady, isLoading } = usePuterStore();
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loadingResumes, setLoadingResumes] = useState(false);
    const navigate = useNavigate();

    const loadResumes = async () => {
        if (!auth.isAuthenticated) return;
        setLoadingResumes(true);
        try {
            const items = (await kv.list('resume:*', true)) as KVItem[];
            const parsedResumes = items?.map((item) => JSON.parse(item.value) as Resume);
            setResumes(parsedResumes || []);
        } catch (err) {
            console.error("Failed to load resumes:", err);
        } finally {
            setLoadingResumes(false);
        }
    }

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) {
            navigate('/');
        }
    }, [auth.isAuthenticated, isLoading]);

    useEffect(() => {
        if (puterReady) {
            loadResumes();
        }
    }, [auth.isAuthenticated, puterReady]);

    const averageScore = resumes.length > 0 
        ? Math.round(resumes.reduce((acc, curr) => acc + (curr.feedback.overallScore || 0), 0) / resumes.length)
        : 0;

    const handleWipeData = async () => {
        const confirmation = await ui.prompt("Wipe All Data?", "Type 'WIPE' to confirm deletion of all resumes and analysis reports. This cannot be undone.");
        
        if (confirmation === 'WIPE') {
            try {
                // Delete all files in root (resumes and images)
                const files = await fs.readDir("./");
                if (files) {
                    for (const file of files) {
                        await fs.delete(file.path);
                    }
                }
                
                // Flush all KV data (resumes metadata)
                await kv.flush();
                
                ui.notify({
                    title: "Data Wiped",
                    text: "Your account data has been successfully cleared.",
                    icon: "success"
                });
                
                // Reload state
                setResumes([]);
            } catch (err) {
                console.error("Wipe failed:", err);
                ui.alert("Maintenance Error", "Failed to clear all data. Please try again.");
            }
        } else if (confirmation) {
            ui.notify("Wipe canceled. Confirmation code did not match.");
        }
    }

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen flex flex-col">
            <Navbar />

            <section className="main-section flex-grow pt-16">
                <div className="w-full max-w-6xl">
                    <header className="mb-12">
                        <h1 className="text-pretty mb-2">Hello, {auth.user?.username || 'Professional'}</h1>
                        <p className="text-xl text-gray-600">Track your progress and review your historical analysis reports.</p>
                    </header>

                    {/* STATS GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                        <StatCard 
                            title="Average Score" 
                            value={averageScore} 
                            subtext="Combined rating across all reports"
                            trend={resumes.length > 1 ? "↑ Stable" : undefined}
                        />
                        <StatCard 
                            title="Total Scans" 
                            value={resumes.length} 
                            subtext="Resumes optimized so far"
                        />
                        <StatCard 
                            title="Recent Activity" 
                            value={resumes.length > 0 ? "Active" : "None"} 
                            subtext="Resume analysis engagement"
                        />
                    </div>

                    {/* RESUME GRID */}
                    <div className="mb-32">
                        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 !text-black">
                            <img src="/icons/info.svg" className="size-8" alt="history" />
                            Analysis History
                        </h2>

                        {loadingResumes ? (
                            <div className="flex flex-col items-center py-20">
                                <img src="/images/resume-scan-2.gif" alt="loading" className="w-20" />
                            </div>
                        ) : (
                            <>
                                {resumes.length > 0 ? (
                                    <div className="resumes-section !justify-start">
                                        {resumes.map((resume) => (
                                            <ResumeCard key={resume.id} resume={resume} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 bg-white/30 backdrop-blur-sm rounded-3xl border-2 border-dashed border-gray-200">
                                        <p className="text-gray-500 text-lg mb-6">You haven't analyzed any resumes yet.</p>
                                        <Link to="/upload" className="primary-button px-8 py-3 w-fit mx-auto">
                                            Start Your First Analysis
                                        </Link>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* MAINTENANCE SECTION */}
                    <div className="mb-20 pt-12 border-t border-gray-200">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Account Maintenance</h3>
                        <div className="bg-red-50/50 rounded-2xl p-6 border border-red-100 flex items-center justify-between max-sm:flex-col max-sm:items-start gap-4">
                            <div>
                                <h4 className="font-bold text-red-900">Reset Application Data</h4>
                                <p className="text-red-700/70 text-sm">Delete all historical resumes, images, and AI analysis reports from your Puter account.</p>
                            </div>
                            <button 
                                onClick={handleWipeData}
                                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold transition-colors shadow-lg shadow-red-200"
                            >
                                Wipe All Data
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
export default Profile

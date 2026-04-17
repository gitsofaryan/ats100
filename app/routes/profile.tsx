import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { Link, useNavigate } from "react-router";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { getUserProfile, saveUserProfile, type UserProfile } from "~/lib/profile";
import { formatDate, getInitials, cn } from "~/lib/utils";
import { normalizeFeedbackScores } from "~/lib/scoring";

export const meta = () => ([
    { title: "User Profile | ATS100 Resume Scan History" },
    { name: "description", content: "View your saved AI resume analysis reports, track your ATS screening improvements, and manage your professional profile." },
    { name: "keywords", content: "resume scan history, ATS screening results, resume analysis dashboard, career progress tracker" },
    { name: "robots", content: "noindex, nofollow" },
]);

const StatCard = ({
    title,
    value,
    subtext,
}: {
    title: string;
    value: string | number;
    subtext: string;
}) => (
    <div className="stat-card">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gray-500">{title}</p>
        <h3 className="mt-4 text-5xl font-bold !text-black">{value}</h3>
        <p className="mt-3 text-sm leading-6 text-gray-600">{subtext}</p>
    </div>
);

const Profile = () => {
    const { auth, kv, fs, ui, puterReady, isLoading, wipeData } = usePuterStore();
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loadingResumes, setLoadingResumes] = useState(false);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [avatarUrl, setAvatarUrl] = useState("");
    const [avatarUploading, setAvatarUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const username = auth.user?.username || "";

    const loadAvatarPreview = async (avatarPath?: string) => {
        if (!avatarPath) {
            setAvatarUrl("");
            return;
        }

        const blob = await fs.read(avatarPath);
        if (!blob) {
            setAvatarUrl("");
            return;
        }

        setAvatarUrl(URL.createObjectURL(blob));
    };

    const loadProfileData = async () => {
        if (!username) return;
        const storedProfile = await getUserProfile(kv, username);
        setProfile(storedProfile);
        await loadAvatarPreview(storedProfile.avatarPath);
    };

    const loadResumes = async () => {
        if (!auth.isAuthenticated) return;
        setLoadingResumes(true);
        try {
            const items = (await kv.list("resume:*", true)) as KVItem[];
            const parsedResumes = items?.map((item) => {
                const parsed = JSON.parse(item.value) as Resume;
                return {
                    ...parsed,
                    feedback: normalizeFeedbackScores(parsed.feedback),
                };
            });
            const sortedResumes = (parsedResumes || []).sort((a, b) =>
                new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
            );
            setResumes(sortedResumes);
        } catch (err) {
            console.error("Failed to load resumes:", err);
        } finally {
            setLoadingResumes(false);
        }
    };

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) {
            navigate("/");
        }
    }, [auth.isAuthenticated, isLoading, navigate]);

    useEffect(() => {
        if (puterReady && auth.isAuthenticated) {
            loadResumes();
            loadProfileData();
        }
    }, [auth.isAuthenticated, puterReady, username]);

    const averageScore = useMemo(() => (
        resumes.length > 0
            ? Math.round(resumes.reduce((acc, curr) => acc + curr.feedback.overallScore, 0) / resumes.length)
            : 0
    ), [resumes]);

    const averageAtsScore = useMemo(() => (
        resumes.length > 0
            ? Math.round(resumes.reduce((acc, curr) => acc + curr.feedback.ATS.score, 0) / resumes.length)
            : 0
    ), [resumes]);

    const bestScore = useMemo(() => (
        resumes.length > 0
            ? Math.max(...resumes.map((resume) => resume.feedback.overallScore))
            : 0
    ), [resumes]);

    const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !username) return;

        setAvatarUploading(true);

        try {
            const uploadedFile = await fs.upload([file]);
            const fileItem = Array.isArray(uploadedFile) ? uploadedFile[0] : uploadedFile;

            if (!fileItem?.path) {
                throw new Error("Failed to upload avatar");
            }

            const nextProfile = await saveUserProfile(kv, {
                username,
                avatarPath: fileItem.path,
                updatedAt: new Date().toISOString(),
            });

            setProfile(nextProfile);
            await loadAvatarPreview(nextProfile.avatarPath);

            ui.notify({
                title: "Avatar updated",
                text: "Your profile image has been saved.",
                icon: "success",
            });
        } catch (err) {
            console.error("Avatar upload failed:", err);
            ui.alert("Avatar Upload Error", "We could not update your avatar. Please try again.");
        } finally {
            setAvatarUploading(false);
            if (event.target) event.target.value = "";
        }
    };

    return (
        <main className="product-shell flex flex-col">
            <Navbar />

            <section className="main-section flex-grow !gap-10 pt-16">
                <div className="dashboard-hero w-full max-w-6xl">
                    <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_320px] lg:items-center">
                        <div>
                            <span className="eyebrow mb-5">Your workspace</span>
                            <h1 className="text-pretty mb-4">Hello, {username || "Professional"}</h1>
                            <p className="max-w-3xl text-xl leading-8 text-gray-600">
                                Track saved reports, compare score quality over time, and keep your resume improvement process organized in one place.
                            </p>
                            <div className="hero-proof mt-6">
                                <div className="hero-proof-pill">Corrected weighted scoring</div>
                                <div className="hero-proof-pill">Saved ATS report history</div>
                                <div className="hero-proof-pill">Avatar-ready profile</div>
                            </div>
                        </div>

                        <div className="avatar-uploader">
                            <div className="avatar-ring">
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-[#606beb]">
                                        {getInitials(username)}
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className="text-lg font-semibold text-gray-900">{username || "Professional"}</p>
                                <p className="text-sm text-gray-500">
                                    {profile?.updatedAt ? `Updated ${formatDate(profile.updatedAt)}` : "Add a profile image"}
                                </p>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAvatarChange}
                            />
                            <button
                                type="button"
                                className="soft-button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={avatarUploading}
                            >
                                {avatarUploading ? "Uploading..." : "Upload Avatar"}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="stats-grid max-w-6xl">
                    <StatCard
                        title="Average Score"
                        value={`${averageScore}/100`}
                        subtext="Weighted overall score based on ATS, content, structure, skills, and tone."
                    />
                    <StatCard
                        title="Average ATS"
                        value={`${averageAtsScore}/100`}
                        subtext="Your average ATS readiness across all saved reports."
                    />
                    <StatCard
                        title="Best Score"
                        value={`${bestScore}/100`}
                        subtext="The strongest resume performance currently saved in your account."
                    />
                </div>

                <div className="dashboard-card w-full max-w-6xl">
                    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <span className="eyebrow mb-4">Saved analysis reports</span>
                            <h2 className="!text-black">Your history</h2>
                            <p className="mt-3 max-w-2xl text-lg leading-7 text-gray-600">
                                Every report is recalculated using the app’s weighted scoring method, so profile stats stay consistent even if older saves came from raw model output.
                            </p>
                        </div>

                        <Link to="/upload" className="primary-button w-fit px-8 py-3">
                            Analyze Another Resume
                        </Link>
                    </div>

                    {loadingResumes ? (
                        <div className="flex flex-col items-center py-20">
                            <img src="/images/resume-scan-2.gif" alt="loading" className="w-20" />
                        </div>
                    ) : resumes.length > 0 ? (
                        <div className="resumes-section !justify-start">
                            {resumes.map((resume) => (
                                <ResumeCard key={resume.id} resume={resume} />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-[32px] border-2 border-dashed border-gray-200 bg-white/50 py-20 text-center">
                            <p className="text-gray-500 text-lg mb-6">You have not generated any ATS reports yet.</p>
                            <Link to="/upload" className="primary-button px-8 py-3 w-fit mx-auto">
                                Analyze Your First Resume
                            </Link>
                        </div>
                    )}
                </div>

                <div className="dashboard-card w-full max-w-6xl border border-red-100 bg-red-50/50">
                    <h3 className="text-xl font-bold text-red-900 mb-4">Account Maintenance</h3>
                    <div className="flex items-center justify-between gap-4 max-sm:flex-col max-sm:items-start">
                        <div>
                            <h4 className="font-bold text-red-900">Reset Application Data</h4>
                            <p className="text-red-700/80 text-sm leading-6">
                                Delete all uploaded resumes, previews, avatars, and saved ATS analysis reports from your Puter account.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                            <button
                                onClick={async () => {
                                    await auth.signOut();
                                    navigate("/");
                                }}
                                className="px-6 py-2.5 bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 rounded-full font-bold transition-colors shadow-sm text-center whitespace-nowrap w-full sm:w-auto"
                            >
                                Sign Out
                            </button>
                            <Link 
                                to="/wipe"
                                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold transition-colors shadow-lg shadow-red-200 text-center whitespace-nowrap w-full sm:w-auto"
                            >
                                Wipe All Data
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Profile;

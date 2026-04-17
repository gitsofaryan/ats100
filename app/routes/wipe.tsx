import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

export const meta = () => [
  { title: "System Wipe | ATS100" },
  { name: "robots", content: "noindex, nofollow" },
];


const WipeApp = () => {
    const { auth, isLoading, error, fs, ui, wipeData } = usePuterStore();
    const navigate = useNavigate();
    const [isWiping, setIsWiping] = useState(false);
    const hasWiped = useRef(false);

    useEffect(() => {
        const performAutoWipe = async () => {
            if (!isLoading && auth.isAuthenticated && !hasWiped.current) {
                hasWiped.current = true;
                try {
                    setIsWiping(true);
                    await wipeData();
                    ui.notify({
                        title: "System Purged",
                        text: "All application data has been cleared automatically.",
                        icon: "success"
                    });
                    setTimeout(() => window.location.assign("/"), 1500);
                } catch (err) {
                    console.error("Auto-wipe failed:", err);
                    ui.alert("Wipe Failed", "Could not clear all data. Please try again.");
                } finally {
                    setIsWiping(false);
                }
            } else if (!isLoading && !auth.isAuthenticated) {
                auth.signIn();
            }
        };

        performAutoWipe();
    }, [isLoading, auth.isAuthenticated]);

    if (isLoading) {
        return <div className="p-20 text-center font-bold">Connecting to Puter...</div>;
    }

    if (error) {
        return <div className="p-20 text-center text-red-500">Error: {typeof error === 'string' ? error : JSON.stringify(error)}</div>;
    }

    return (
        <div className="p-20 flex flex-col items-center justify-center gap-8 max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-red-600">Maintenance: System Wipe</h1>
            <div className="flex flex-col items-center gap-4">
                <img src="/images/resume-scan.gif" className="w-64 rounded-3xl shadow-2xl" alt="wiping" />
                <p className="text-xl font-medium text-gray-600">
                    {isWiping ? "Purging all data from your Puter account..." : "Preparing system reset..."}
                </p>
                <p className="text-sm text-gray-400 italic">
                    You will be redirected to the home page once the process is complete.
                </p>
            </div>
        </div>
    );
};

export default WipeApp;

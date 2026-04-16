import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

const WipeApp = () => {
    const { auth, isLoading, error, clearError, fs, ai, kv, ui } = usePuterStore();
    const navigate = useNavigate();
    const [files, setFiles] = useState<FSItem[]>([]);
    const [isWiping, setIsWiping] = useState(false);

    const loadFiles = async () => {
        const files = (await fs.readDir("./")) as FSItem[];
        setFiles(files);
    };

    useEffect(() => {
        loadFiles();
    }, []);

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) {
            navigate("/auth?next=/wipe");
        }
    }, [isLoading]);

    const handleDelete = async () => {
        try {
            setIsWiping(true);
            
            // Delete all files
            const currentFiles = (await fs.readDir("./")) || [];
            for (const file of currentFiles) {
                await fs.delete(file.path);
            }
            
            // 2. Clear known app prefixes specifically
            const patterns = ["resume:*", "profile:*", "billing:*", "usage:*", "stats:*"];
            for (const pattern of patterns) {
                try {
                    const keys = (await kv.list(pattern)) || [];
                    for (const key of keys) {
                        await kv.delete(key);
                    }
                } catch (e) {
                    console.warn(`Failed to clear pattern ${pattern}:`, e);
                }
            }

            await kv.flush();
            window.location.reload(); 
        } catch (err) {
            console.error("Wipe failed:", err);
            ui.alert("Wipe Error", "Failed to clear all data.");
        } finally {
            setIsWiping(false);
        }
    };

    if (isLoading) {
        return <div className="p-20 text-center font-bold">Connecting to Puter...</div>;
    }

    if (error) {
        return <div className="p-20 text-center text-red-500">Error: {typeof error === 'string' ? error : JSON.stringify(error)}</div>;
    }

    return (
        <div className="p-10 flex flex-col gap-8 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold">Maintenance: Full System Wipe</h1>
            <div className="p-6 bg-gray-100 rounded-2xl border border-gray-200">
                <p className="font-bold mb-2">Authenticated as: <span className="text-blue-600">{auth.user?.username}</span></p>
                <div className="mt-4">
                    <p className="font-bold text-gray-700">Storage Contents:</p>
                    <div className="mt-2 flex flex-col gap-1 max-h-40 overflow-y-auto bg-white p-3 rounded-lg border">
                        {files.length > 0 ? files.map((file: any) => (
                            <div key={file.path} className="text-xs font-mono text-gray-500">
                                {file.name}
                            </div>
                        )) : <p className="text-xs text-gray-400 italic">No files found</p>}
                    </div>
                </div>
            </div>

            <div className="p-6 bg-red-50 rounded-2xl border border-red-200">
                <p className="text-red-700 mb-4 text-sm">
                    This will delete all PDFs, processed images, analysis reports, usage stats, and profile settings.
                </p>
                <button
                    className={`
                        w-full py-4 rounded-xl font-bold transition-all
                        ${isWiping ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white shadow-lg'}
                    `}
                    disabled={isWiping}
                    onClick={() => handleDelete()}
                >
                    {isWiping ? "System Purge in Progress..." : "START FULL SYSTEM WIPE"}
                </button>
            </div>
        </div>
    );
};

export default WipeApp;

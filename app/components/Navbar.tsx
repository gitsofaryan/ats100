import { Link } from "react-router";
import { usePuterStore } from "~/lib/puter";
import { useEffect, useRef } from "react";

const Navbar = () => {
    const { auth, ui, puterReady } = usePuterStore();
    const prevAuthRef = useRef(auth.isAuthenticated);

    useEffect(() => {
        if (auth.isAuthenticated && !prevAuthRef.current) {
            ui.notify({
                title: "Signed In",
                text: `Welcome back, ${auth.user?.username}!`,
                icon: "success"
            });
        }
        prevAuthRef.current = auth.isAuthenticated;
    }, [auth.isAuthenticated, auth.user, ui]);

    const handleSignIn = async () => {
        try {
            await auth.signIn();
        } catch (err) {
            console.error("Sign in failed:", err);
            ui.alert("Sign In Failed", "Please try again to access your account.");
        }
    };

    return (
        <nav className="navbar">
            <Link to="/">
                <p className="text-2xl font-bold text-gradient">ATS100</p>
            </Link>
            <div className="flex items-center gap-4">
                {puterReady && (
                    <>
                        {auth.isAuthenticated ? (
                            <div className="flex items-center gap-4">
                                <Link to="/profile" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-full transition-colors font-medium text-gray-700">
                                    <img src="/icons/info.svg" className="size-5" alt="profile" />
                                    <span>Profile</span>
                                </Link>
                                <Link to="/upload" className="primary-button w-fit px-8">
                                    Analyze Resume
                                </Link>
                            </div>
                        ) : (
                            <button
                                onClick={handleSignIn}
                                className="primary-button w-fit px-8"
                            >
                                Analyze Resume
                            </button>
                        )}
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;

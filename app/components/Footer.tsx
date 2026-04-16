const Footer = () => {
    return (
        <footer className="w-full py-8 mt-auto border-t border-gray-100 bg-white/50 backdrop-blur-sm">
            <div className="max-w-[1200px] mx-auto px-10 flex flex-row justify-between items-center max-md:flex-col gap-4">
                <div className="flex items-center gap-6">
                    <a
                        href="https://github.com/gitsofaryan"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors duration-200 text-sm font-medium"
                    >
                        <img
                            src="https://github.com/gitsofaryan.png"
                            alt="gitsofaryan profile"
                            width={24}
                            height={24}
                            className="w-6 h-6 rounded-full border border-gray-200"
                        />
                        Developer: @gitsofaryan
                    </a>
                    <a
                        href="https://github.com/gitsofaryan/ats100"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-sm font-medium text-gray-700"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M10 2L13.09 8.26L20 9L15 13.74L16.18 20.02L10 16.77L3.82 20.02L5 13.74L0 9L6.91 8.26L10 2Z" clipRule="evenodd" />
                        </svg>
                        Star on GitHub
                    </a>
                </div>
                <p className="text-gray-400 text-sm">
                    © {new Date().getFullYear()} ATS100 — built for modern hiring systems.
                </p>
            </div>
        </footer>
    );
};

export default Footer;

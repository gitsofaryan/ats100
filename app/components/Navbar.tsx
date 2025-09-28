import { Link } from "react-router";

const Navbar = () => {
    return (
        <nav className="navbar">
            <Link to="/">
                <p className="text-2xl font-bold text-gradient">ATS100</p>
            </Link>
            <div className="flex items-center gap-4">
                <a 
                    href="https://github.com/gitsofaryan" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 text-sm font-medium"
                >
                    <img 
                        src="https://github.com/gitsofaryan.png" 
                        alt="gitsofaryan profile"
                        className="w-6 h-6 rounded-full border border-gray-200"
                    />
                    Developer: @gitsofaryan
                </a>
                <a 
                    href="https://github.com/gitsofaryan/ats100" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 text-sm font-medium text-gray-700"
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2L13.09 8.26L20 9L15 13.74L16.18 20.02L10 16.77L3.82 20.02L5 13.74L0 9L6.91 8.26L10 2Z" clipRule="evenodd" />
                    </svg>
                    Star on GitHub
                </a>
                <Link to="/upload" className="primary-button w-fit">
                    Upload Resume
                </Link>
            </div>
        </nav>
    )
}
export default Navbar

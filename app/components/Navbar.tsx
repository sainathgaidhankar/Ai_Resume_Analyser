import {usePuterStore} from "~/lib/puter";
import {Link} from "react-router";

const Navbar = () => {
    const { auth } = usePuterStore();

    return (
        <nav className="navbar">
            <Link to="/">
                <p className="text-2xl font-bold text-gradient">RESUMIND</p>
            </Link>
            <div className="flex items-center gap-3">
                {auth.role === "admin" && (
                    <Link to="/admin" className="auth-button">
                        Admin Dashboard
                    </Link>
                )}
                <Link to="/upload" className="primary-button w-fit">
                    Upload Resume
                </Link>
            </div>
        </nav>
    )
}
export default Navbar

import { Link } from "react-router-dom";

const Navbar = ({ children }) => {
    return (
        <>
            <nav className="navbar navbar-expand-md bg-dark navbar-dark">
                <Link className="navbar-brand" to={'/'}>Personal Budget</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="collapsibleNavbar">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link" to={'/'}>Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to={'/dashboard'}>Dashboard</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to={'/login'}>Login</Link>
                        </li>
                    </ul>
                </div>
            </nav>
            {children}
        </>
    )
};

export default Navbar;
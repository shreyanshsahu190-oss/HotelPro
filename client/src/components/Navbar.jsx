import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

export default function Navbar() {
  const { isLoggedIn, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg hp-nav">
      <div className="container">
        <Link className="brand" to="/">
          Hotel<span>Pro</span>
        </Link>
        <button className="navbar-toggler bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#nav">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="nav">
          <div className="navbar-nav ms-auto align-items-lg-center gap-lg-3">
            <NavLink className="nav-link" to="/">Home</NavLink>
            {!isLoggedIn && <NavLink className="nav-link" to="/login">Login</NavLink>}
            {!isLoggedIn && <NavLink className="nav-link" to="/signup">SignUp</NavLink>}
            {isLoggedIn && !isAdmin && <NavLink className="nav-link" to="/user">Rooms</NavLink>}
            {isLoggedIn && !isAdmin && <NavLink className="nav-link" to="/bookings">My Bookings</NavLink>}
            {isAdmin && <NavLink className="nav-link" to="/admin">Admin</NavLink>}
            {isLoggedIn ? (
              <button className="btn btn-gold ms-lg-2" onClick={onLogout}>
                Logout {user?.name ? `· ${user.name.split(" ")[0]}` : ""}
              </button>
            ) : (
              <Link className="btn btn-gold ms-lg-2" to="/signup">Reserve a stay</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

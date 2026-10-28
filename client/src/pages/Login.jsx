import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api.js";
import { useAuth } from "../AuthContext.jsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/user/Login", { email, password });
      login(data);
      navigate(data.user.userType === "Admin" ? "/admin" : "/user");
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-visual">
        <p className="eyebrow">Welcome back</p>
        <h1>Your key is waiting at the desk.</h1>
      </div>
      <div className="auth-form">
        <form onSubmit={submit} className="w-100" style={{ maxWidth: 420, margin: "0 auto" }}>
          <h2>Login</h2>
          <p className="text-muted">Registered guests and administrators.</p>
          {error && <div className="alert alert-danger py-2">{error}</div>}
          <label className="form-label">Email</label>
          <input className="form-control mb-3" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <label className="form-label">Password</label>
          <input className="form-control mb-4" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="btn btn-gold w-100 mb-3">Sign in</button>
          <p className="small text-muted">
            New here? <Link to="/signup">Create an account</Link>
            <br />
            Demo guest: guest@hotelpro.com / Guest@123
            <br />
            Demo admin: admin@hotelpro.com / Admin@123
          </p>
        </form>
      </div>
    </div>
  );
}

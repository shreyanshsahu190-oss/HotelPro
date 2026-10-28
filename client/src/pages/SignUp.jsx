import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api.js";

const empty = {
  name: "",
  email: "",
  password: "",
  c_password: "",
  phone: "",
};

export default function SignUp() {
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.c_password) {
      setError("Password must match Confirm Password");
      return;
    }
    try {
      await api.post("/user/SignUp", { ...form, userType: "Ordinary" });
      alert("Account created successfully");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.msg || "Could not create account");
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-visual">
        <p className="eyebrow">Join HotelPro</p>
        <h1>Register once. Arrive as a regular.</h1>
      </div>
      <div className="auth-form">
        <form onSubmit={submit} className="w-100" style={{ maxWidth: 460, margin: "0 auto" }}>
          <h2>SignUp</h2>
          {error && <div className="alert alert-danger py-2">{error}</div>}
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label">Name</label>
              <input className="form-control" name="name" required value={form.name} onChange={change} />
            </div>
            <div className="col-12">
              <label className="form-label">Email</label>
              <input className="form-control" type="email" name="email" required value={form.email} onChange={change} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Password</label>
              <input className="form-control" type="password" name="password" required value={form.password} onChange={change} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Confirm Password</label>
              <input className="form-control" type="password" name="c_password" required value={form.c_password} onChange={change} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Phone</label>
              <input className="form-control" name="phone" required value={form.phone} onChange={change} />
            </div>
            <div className="col-12">
              <button className="btn btn-gold w-100">Create account</button>
            </div>
          </div>
          <p className="small text-muted mt-3">
            Already registered? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

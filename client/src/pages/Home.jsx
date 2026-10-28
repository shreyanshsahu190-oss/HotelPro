import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api.js";
import RoomCard from "../components/RoomCard.jsx";
import { useAuth } from "../AuthContext.jsx";

const slides = [
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=2000&q=80",
];

export default function Home() {
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState("");
  const [slide, setSlide] = useState(0);
  const { isLoggedIn, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/rooms/getallrooms")
      .then((res) => setRooms(res.data.slice(0, 3)))
      .catch(() => setError("Rooms are temporarily unavailable. Please try again shortly."));
  }, []);

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % slides.length), 5500);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-slide" style={{ backgroundImage: `url(${slides[slide]})` }} />
        <div className="hero-overlay" />
        <div className="container hero-copy">
          <p className="eyebrow">Mumbai · Est. 2026</p>
          <h1>Stay where the city exhales.</h1>
          <p className="fs-5" style={{ maxWidth: 540 }}>
            HotelPro is a complete booking and management house — rooms, suites, and a concierge desk that remembers how you take your tea.
          </p>
          <div className="d-flex flex-wrap gap-3 mt-4">
            <Link className="btn btn-gold" to={isLoggedIn ? (isAdmin ? "/admin" : "/user") : "/signup"}>
              {isLoggedIn ? "Go to dashboard" : "Create an account"}
            </Link>
            <a className="btn btn-ghost" href="#rooms">Browse rooms</a>
          </div>
        </div>
      </section>

      <section className="section section-cream" id="about">
        <div className="container">
          <div className="row g-5 align-items-center about-grid">
            <div className="col-lg-6">
              <img src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1400&q=80" alt="Lobby" />
            </div>
            <div className="col-lg-6">
              <p className="eyebrow">About HotelPro</p>
              <h2 className="display-5">A private hotel, run with public-grade systems.</h2>
              <div className="gold-line" />
              <p className="text-muted fs-5">
                Guests browse availability, book with secure sessions, and manage stays from a personal dashboard.
                Administrators add rooms, review bookings, and look after every registered guest — all through one MERN stack house.
              </p>
              <ul className="text-muted">
                <li>JWT sessions for guests and administrators</li>
                <li>Live room inventory with date-aware availability</li>
                <li>Booking history, cancellations, and payment capture</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="rooms">
        <div className="container">
          <p className="eyebrow">Highlights</p>
          <h2 className="display-5">Rooms with a point of view</h2>
          <div className="gold-line" />
          {error && <div className="alert alert-warning">{error}</div>}
          <div className="row g-4 mt-2">
            {rooms.map((room) => (
              <div className="col-md-6 col-xl-4" key={room._id}>
                <RoomCard
                  room={room}
                  cta="View on booking desk"
                  onBook={() => navigate(isLoggedIn && !isAdmin ? "/user" : "/login")}
                />
              </div>
            ))}
          </div>
          <div className="text-center mt-5">
            <Link className="btn btn-gold" to={isLoggedIn && !isAdmin ? "/user" : "/login"}>
              See all rooms
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

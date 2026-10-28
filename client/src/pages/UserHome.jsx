import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api.js";
import RoomCard from "../components/RoomCard.jsx";
import BookingModal from "../components/BookingModal.jsx";
import { useAuth } from "../AuthContext.jsx";

export default function UserHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [fromdate, setFromdate] = useState("");
  const [todate, setTodate] = useState("");
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    const params = fromdate && todate ? { fromdate, todate } : {};
    try {
      const { data } = await api.get("/rooms/getallrooms", { params });
      setRooms(data);
    } catch (err) {
      setError(err.response?.data?.msg || "Rooms could not be loaded.");
    }
  };

  useEffect(() => {
    load().catch(() => {});
  }, []);

  return (
    <>
      <section className="dash-hero">
        <div className="container">
          <p className="eyebrow">User dashboard</p>
          <h1>Hi, {user?.name}</h1>
          <p className="mb-0">Choose arrival and departure, then book the room that fits the stay.</p>
          <Link className="btn btn-gold mt-4" to="/bookings">My Bookings</Link>
        </div>
      </section>
      <section className="section pt-4">
        <div className="container">
          <div className="panel mb-4">
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="row g-3 align-items-end">
              <div className="col-md-4">
                <label className="form-label">Arrival</label>
                <input type="date" className="form-control" value={fromdate} onChange={(e) => setFromdate(e.target.value)} />
              </div>
              <div className="col-md-4">
                <label className="form-label">Departure</label>
                <input type="date" className="form-control" value={todate} onChange={(e) => setTodate(e.target.value)} />
              </div>
              <div className="col-md-4">
                <button className="btn btn-gold w-100" onClick={load}>Show available rooms</button>
              </div>
            </div>
          </div>
          <div className="row g-4">
            {rooms.map((room) => (
              <div className="col-md-6 col-xl-4" key={room._id}>
                <RoomCard room={room} onBook={setSelected} />
              </div>
            ))}
            {rooms.length === 0 && <p className="text-muted">No rooms match those dates.</p>}
          </div>
        </div>
      </section>
      <BookingModal
        show={Boolean(selected)}
        room={selected}
        fromdate={fromdate}
        todate={todate}
        onHide={() => setSelected(null)}
        onBooked={() => {
          setSelected(null);
          navigate("/bookings");
        }}
      />
    </>
  );
}

import { useEffect, useState } from "react";
import api from "../api.js";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const { data } = await api.get("/bookings/getuserbookings");
      setBookings(data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.msg || "Bookings could not be loaded.");
    }
  };

  useEffect(() => {
    load().catch(() => {});
  }, []);

  const cancel = async (bookingid, status) => {
    if (status === "cancelled") return;
    try {
      await api.post("/bookings/cancelbooking", { bookingid });
      await load();
    } catch (err) {
      setError(err.response?.data?.msg || "Booking could not be cancelled.");
    }
  };

  return (
    <>
      <section className="dash-hero">
        <div className="container">
          {error && <div className="alert alert-danger">{error}</div>}
          <p className="eyebrow">Stay history</p>
          <h1>My Bookings</h1>
        </div>
      </section>
      <section className="section pt-4">
        <div className="container">
          <div className="table-responsive panel">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Room type</th>
                  <th>From / To</th>
                  <th>Total</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id}>
                    <td className="small">{b._id}</td>
                    <td>{b.type} {b.roomid?.roomNumber ? `· #${b.roomid.roomNumber}` : ""}</td>
                    <td>{b.fromdate} → {b.todate}<br /><small>{b.totaldays} nights</small></td>
                    <td>₹{Number(b.totalAmount).toLocaleString("en-IN")}</td>
                    <td>{b.phone}</td>
                    <td>
                      <span className={`badge ${b.status === "cancelled" ? "badge-cancelled" : "badge-booked"}`}>
                        {b.status === "cancelled" ? "Cancelled" : "Active"}
                      </span>
                    </td>
                    <td>
                      {b.status !== "cancelled" && (
                        <button className="btn btn-sm btn-outline-danger" onClick={() => cancel(b._id, b.status)}>
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-muted">No bookings yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}

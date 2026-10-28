import { useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import api from "../api.js";

function nights(fromdate, todate) {
  if (!fromdate || !todate) return 0;
  return Math.max(0, Math.ceil((new Date(todate) - new Date(fromdate)) / 86400000));
}

export default function BookingModal({ show, onHide, room, fromdate, todate, onBooked }) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const days = useMemo(() => nights(fromdate, todate), [fromdate, todate]);
  const total = days * (room?.rent || 0);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!fromdate || !todate || days < 1) {
      setError("Please choose valid arrival and departure dates.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/bookings/bookroom", {
        roomid: room._id,
        fromdate,
        todate,
      });
      setSuccess("Room booked successfully");
      window.setTimeout(() => onBooked?.(), 900);
    } catch (err) {
      setError(err.response?.data?.msg || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  if (!room) return null;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title className="serif">Confirm {room.type} · #{room.roomNumber}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-muted">
          {fromdate || "—"} → {todate || "—"} · {days} night{days === 1 ? "" : "s"} ·{" "}
          <strong>₹{total.toLocaleString("en-IN")}</strong>
        </p>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        {success && <div className="alert alert-success py-2">{success}</div>}
        <form onSubmit={submit} className="row g-3">
          <p className="small text-muted mb-0">
            No payment is required. Confirming will reserve this room for your selected dates.
          </p>
          <div className="col-12">
            <button className="btn btn-gold w-100" disabled={loading || Boolean(success)}>
              {loading ? "Booking..." : "Confirm booking"}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}
